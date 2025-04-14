import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/widget.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Message, CurrentChat, fetchHistoryAPI, sendMessageAPI, clearChatAPI } from './components/chat/utils';
import Overlay from './components/chat/Overlay';
import ChatWindow from './components/chat/ChatWindow';
import ChatToggleButton from './components/chat/ChatToggleButton';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<CurrentChat>({ user: null, ai: null });
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image'; file: File } | null>(null); // Store file object too

  const chatContentRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // --- Initialization ---
  useEffect(() => {
    // Check localStorage and referrer only once on mount
    const storedIsOpen = localStorage.getItem('chatIsOpen') === 'true';
    const cameFromAskAi = document.referrer.includes('/askai'); // Check previous page
    const shouldOpenInitially = storedIsOpen || cameFromAskAi;

    setIsOpen(shouldOpenInitially);
    if (shouldOpenInitially) {
      document.body.classList.add('overflow-hidden');
    }

    // Fetch history
    const loadHistory = async () => {
      try {
        const data = await fetchHistoryAPI();
        if (data.history?.length > 0) {
          // Process messages (e.g., parse AI messages if needed, though API might handle it)
          const messages = data.history.map(msg => ({
            ...msg,
            id: msg.id || Date.now() + Math.random(), // Ensure ID exists
          }));

          // Logic to potentially set the last pair as currentChat (similar to Alpine)
          const lastUserIndex = messages.length - 2;
          const lastAIIndex = messages.length - 1;

          if (lastAIIndex >= 0 && messages[lastAIIndex].sender === 'ai') {
            if (lastUserIndex >= 0 && messages[lastUserIndex].sender === 'user') {
              setCurrentChat({ user: messages[lastUserIndex], ai: messages[lastAIIndex] });
              setPreviousMessages(messages.slice(0, lastUserIndex));
            } else {
              // Only AI message at the end? Unlikely but handle it.
              setCurrentChat({ user: null, ai: messages[lastAIIndex] });
              setPreviousMessages(messages.slice(0, lastAIIndex));
            }
          } else {
            // No AI message at the end, or only user message
            if (lastAIIndex >= 0 && messages[lastAIIndex].sender === 'user') {
              setCurrentChat({ user: messages[lastAIIndex], ai: null });
              setPreviousMessages(messages.slice(0, lastAIIndex));
            } else {
              // History might be empty or have other structures
              setPreviousMessages(messages);
              setCurrentChat({ user: null, ai: null });
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
        setError('Could not load chat history.');
      } finally {
        setInitialized(true); // Mark as initialized after setup
      }
    };

    loadHistory();

    // Add event listeners for custom events (if needed from other components)
    const handleOpenChatEvent = () => {
      if (!isOpen) toggleChat();
    };
    const handleOpenWithMessageEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        // We need a way to set the input value in ChatInput from here
        // Option 1: Pass a setter down (complex prop drilling)
        // Option 2: Use a ref on ChatInput (better)
        // Option 3: Use a state management library (like Zustand or Context)
        // For now, we'll just open the chat. The message sending needs ChatInput ref.
        console.warn("Received 'open-chat-widget-with-message', input setting needs implementation via ref or state management.");
        if (!isOpen) toggleChat();
        // TODO: Set input value and trigger send after a delay
      } else {
        if (!isOpen) toggleChat();
      }
    };

    document.addEventListener('open-chat-widget', handleOpenChatEvent);
    document.addEventListener('open-chat-widget-with-message', handleOpenWithMessageEvent as EventListener);

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener('open-chat-widget', handleOpenChatEvent);
      document.removeEventListener('open-chat-widget-with-message', handleOpenWithMessageEvent as EventListener);
      // Ensure body class is removed if component unmounts while open
      document.body.classList.remove('overflow-hidden');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- LocalStorage Sync & Body Class ---
  useEffect(() => {
    // Don't run this effect on initial mount before initialization is complete
    if (!initialized) return;

    if (isOpen) {
      localStorage.setItem('chatIsOpen', 'true');
      document.body.classList.add('overflow-hidden');
      scrollToBottom(); // Scroll when opening
    } else {
      localStorage.removeItem('chatIsOpen');
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen, initialized]);

  // --- Scrolling ---
  const scrollToBottom = useCallback(() => {
    if (chatContentRef.current) {
      setTimeout(() => {
        if (chatContentRef.current) { // Check again inside timeout
          chatContentRef.current.scrollTo({
            top: chatContentRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 50); // Small delay allows content to render
    }
  }, []);

  // Effect to scroll when messages change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [previousMessages, currentChat, isTyping, isOpen, scrollToBottom]);


  // --- Event Handlers ---
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClearChat = useCallback(async (event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling if called from button click
    setUploadedMedia(null); // Clear any pending upload
    setError('');
    try {
      await clearChatAPI();
      setPreviousMessages([]);
      setCurrentChat({ user: null, ai: null });
    } catch (err) {
      console.error('Failed to clear chat:', err);
      setError('Could not clear chat history.');
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() && !uploadedMedia) return;

    setError('');
    setIsTyping(true);

    const userMessage: Message = {
      id: Date.now(),
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
      content_type: uploadedMedia ? 'text_image' : 'text',
    };

    // Move previous turn to history
    const newPreviousMessages = [...previousMessages];
    if (currentChat.user) newPreviousMessages.push(currentChat.user);
    if (currentChat.ai) newPreviousMessages.push(currentChat.ai);
    setPreviousMessages(newPreviousMessages);

    // Set new user message, clear AI response
    setCurrentChat({ user: userMessage, ai: null });

    // Prepare data for API
    const messageData: { message: string; sender: 'user'; content_type?: string; media_url?: string } = {
      message: userMessage.content,
      sender: 'user',
    };

    const mediaToSend = uploadedMedia; // Capture current media state
    setUploadedMedia(null); // Clear media state immediately for UI

    if (mediaToSend) {
      messageData.content_type = 'text_image';
      messageData.media_url = mediaToSend.url; // Send base64 URL
    }

    // Call API
    try {
      const response = await sendMessageAPI(messageData);
      setIsTyping(false);
      // Update current chat with AI response
      setCurrentChat(prev => ({ ...prev, ai: { ...response.message, id: response.message.id || Date.now() + 1 } }));
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      setIsTyping(false);
      // Optionally revert state or keep user message displayed with error
      // For simplicity, we'll leave the user message in currentChat
    }
  }, [previousMessages, currentChat, uploadedMedia]); // Dependencies


  const handleFileUpload = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setUploadedMedia(null);
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setUploadedMedia({ url: reader.result, type: 'image', file: file });
        scrollToBottom(); // Scroll to show file name if input area changes size
      } else {
        setError('Failed to read file.');
        setUploadedMedia(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setUploadedMedia(null);
    };
  }, [scrollToBottom]);

  const handleRemoveFile = useCallback(() => {
    setUploadedMedia(null);
    setError('');
  }, []);


  // --- Render Logic ---
  // Don't render anything on the Ask AI page
  // if (isAskAiPage) {
  //   return null;
  // }

  // Don't render until initialization (history fetch, localStorage check) is complete
  if (!initialized) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <>
      {/* Overlay */}
      <Overlay isOpen={isOpen} onClick={toggleChat} />

      {/* Chat Window (Slide-in Panel) */}
      <ChatWindow
        isOpen={isOpen}
        isTyping={isTyping}
        previousMessages={previousMessages}
        currentChat={currentChat}
        error={error}
        uploadedFileName={uploadedMedia?.file.name}
        // @ts-ignore
        chatContentRef={chatContentRef}
        onClose={toggleChat}
        onClearChat={handleClearChat}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
      // Add onNavigateToAskAi prop if needed
      />

      {/* Toggle Button */}
      {!isOpen && <ChatToggleButton onClick={toggleChat} />}
    </>
  );
};

interface WidgetProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  apiKey: string;
  primaryColor?: string;
};

const chatWidgetExports = {
  init: (options: WidgetProps) => {
    const container = document.createElement("div");
    container.id = "widget-container";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<ChatWidget {...options} />);
  }
};

export default chatWidgetExports;
