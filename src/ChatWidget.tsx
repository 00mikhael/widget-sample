import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/widget.css';
import 'aos/dist/aos.css';
import { Message, CurrentChat, sendMessageAPI } from './components/chat/utils';
import Overlay from './components/chat/Overlay';
import ChatWindow from './components/chat/ChatWindow';
import ChatToggleButton from './components/chat/ChatToggleButton';

type ButtonPosition = 'top-right' | 'center-right' | 'bottom-right' | 'top-left' | 'center-left' | 'bottom-left';

interface WidgetProps {
  name: string;
  apiKey: string;
  primaryColor?: string;
  position?: ButtonPosition;
  welcomeMessages?: string[];
}

const ChatWidget: React.FC<WidgetProps> = ({
  name,
  apiKey,
  primaryColor,
  position = 'center-right',
  welcomeMessages = ["Ask me anything..."],
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<CurrentChat>({ user: null, ai: null });
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image'; file: File } | null>(null); // Store file object too

  const chatContentRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // --- Initialization ---
  useEffect(() => {
    // Initialize API with credentials
    import('./components/chat/utils').then(utils => {
      utils.initializeAPI(apiKey, name);
    });

    // Check localStorage for chat state
    const storedIsOpen = localStorage.getItem('chatIsOpen') === 'true';
    const storedIsFullscreen = localStorage.getItem('chatIsFullscreen') === 'true';

    setIsOpen(storedIsOpen);
    setIsFullscreen(storedIsFullscreen);

    if (storedIsOpen) {
      document.body.classList.add('overflow-hidden');
    }

    // Initialize as ready
    setInitialized(true);

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

  // --- LocalStorage Sync ---
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

  // Sync fullscreen state with localStorage
  useEffect(() => {
    if (!initialized) return;

    if (isFullscreen) {
      localStorage.setItem('chatIsFullscreen', 'true');
    } else {
      localStorage.removeItem('chatIsFullscreen');
    }
  }, [isFullscreen, initialized]);

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleClearChat = useCallback((event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling if called from button click
    setUploadedMedia(null); // Clear any pending upload
    setError('');
    setPreviousMessages([]);
    setCurrentChat({ user: null, ai: null });
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
      image_url: uploadedMedia?.url // Add image URL for preview
    };

    // Move previous turn to history
    const newPreviousMessages = [...previousMessages];
    if (currentChat.user) newPreviousMessages.push(currentChat.user);
    if (currentChat.ai) newPreviousMessages.push(currentChat.ai);
    setPreviousMessages(newPreviousMessages);

    // Set new user message, clear AI response
    setCurrentChat({ user: userMessage, ai: null });

    try {
      const mediaToSend = uploadedMedia; // Capture current media state
      setUploadedMedia(null); // Clear media state immediately for UI

      const response = await sendMessageAPI({
        message: userMessage.content,
        sender: 'user',
        content_type: mediaToSend ? 'text_image' : 'text',
        media_url: mediaToSend?.url,
        conversation_id: currentChat.ai?.conversation_id
      });

      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: { ...response.message, id: response.message.id || Date.now() + 1 } }));
    } catch (err) {
      console.error('Failed to send message:', err);
      setIsTyping(false);
      setError('Failed to send message. Please try again.');
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

  // Don't render until initialization (history fetch, localStorage check) is complete
  if (!initialized) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <div className='lawma-ai-widget'>
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
        primaryColor={primaryColor}
        isFullscreen={isFullscreen}
        name={name}
        onClose={toggleChat}
        onClearChat={handleClearChat}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        onToggleFullscreen={toggleFullscreen}
        welcomeMessages={welcomeMessages}
      />

      {/* Toggle Button */}
      {!isOpen && <ChatToggleButton onClick={toggleChat} position={position} primaryColor={primaryColor} />}
    </div>
  );
};

const chatWidgetExports = {
  init: (options: WidgetProps) => {
    if (!options.name || !options.apiKey) {
      throw new Error('ChatWidget initialization requires name and apiKey');
    }

    const container = document.createElement("div");
    container.id = "widget-container";
    document.body.appendChild(container);

    // Apply primary color and its variants
    if (options.primaryColor) {
      container.style.setProperty('--chat-primary-color', options.primaryColor);
      container.style.setProperty(
        '--chat-primary-lighter',
        `color-mix(in srgb, ${options.primaryColor} 95%, white)`
      );
      container.style.setProperty(
        '--chat-primary-darker',
        `color-mix(in srgb, ${options.primaryColor} 60%, black)`
      );
    }

    const root = createRoot(container);
    root.render(<ChatWidget {...options} />);
  }
};

export default chatWidgetExports;
