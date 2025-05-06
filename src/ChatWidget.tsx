import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/widget.css';
import { Message, CurrentChat, sendMessageAPI, authAPI } from './components/chat/utils';
import { monitoring } from './services/monitoring';
import { updateConfig } from './config';
import { initWebSocket, ProcessingStatus } from './services/api/websocket';
import { getClientId, tokenRefreshTimeout } from './services/api/chat';
import Overlay from './components/chat/Overlay';
import ChatWindow from './components/chat/ChatWindow';
import ChatToggleButton from './components/chat/ChatToggleButton';
import WidgetErrorBoundary from './components/ErrorBoundary';

type ButtonPosition = 'top-right' | 'center-right' | 'bottom-right' | 'top-left' | 'center-left' | 'bottom-left';

interface WidgetProps {
  name: string;
  apiKey: string;
  primaryColor?: string;
  position?: ButtonPosition;
  welcomeMessages?: string[];
  popularQuestions?: string[];
  popularQuestionsTitle?: string;
  logo_url?: string;
}

const ChatWidget: React.FC<WidgetProps> = ({
  name,
  apiKey,
  primaryColor,
  position = 'center-right',
  welcomeMessages = ["Ask me anything..."],
  popularQuestions = [],
  popularQuestionsTitle = "Popular Questions",
  logo_url,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<CurrentChat>({ user: null, ai: null });
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image'; file: File } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Gathering your information...");

  const chatContentRef = useRef<HTMLDivElement>(null);

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // --- WebSocket Connection ---
  useEffect(() => {
    if (!initialized) return;

    const initWS = async () => {
      const clientId = await getClientId();
      const wsService = initWebSocket(clientId);
      wsService.onMessage((data: ProcessingStatus) => {
        console.log('WebSocket message received:', data);
        setStatusMessage(capitalizeFirstLetter(data.status));
      });
    };

    initWS();
    // No cleanup needed as we want to keep the connection
  }, [initialized]); // Only re-establish on initialization

  // --- Initialization ---
  useEffect(() => {
    async function init() {
      try {
        monitoring.startPerformanceTransaction('widget_initialization');
        const initResponse = await authAPI.initialize(name, apiKey);
        updateConfig(initResponse);
        monitoring.finishTransaction();
        monitoring.identifyUser(apiKey);
        const clientId = await getClientId();
        monitoring.setUserProperties({
          name,
          apiKey,
          clientId,
        });
        monitoring.trackEvent('widget_initialized', { name, apiKey });


        // Initialize state from localStorage
        const storedIsOpen = localStorage.getItem('chatIsOpen');
        const storedIsFullscreen = localStorage.getItem('chatIsFullscreen');
        const storedChat = localStorage.getItem('chatMessages');

        setIsOpen(storedIsOpen === 'true');
        setIsFullscreen(storedIsFullscreen === 'true');

        // Restore chat messages if they exist
        if (storedChat) {
          try {
            const { previousMessages: savedMessages, currentChat: savedChat } = JSON.parse(storedChat);
            const restoredMessages = savedMessages.map((msg: Message) => ({ ...msg, isStreaming: false }));
            const restoredChat = {
              user: savedChat.user,
              ai: savedChat.ai ? { ...savedChat.ai, isStreaming: false } : null
            };
            setPreviousMessages(restoredMessages);
            setCurrentChat(restoredChat);
          } catch (error) {
            console.error('Failed to parse stored chat messages:', error);
          }
        }

        if (storedIsOpen === 'true') {
          document.body.classList.add('overflow-hidden');
        }

        // Set up event listeners
        const handleOpenChatEvent = () => {
          if (!isOpen) toggleChat();
        };

        const handleOpenWithMessageEvent = (event: CustomEvent) => {
          if (event.detail && event.detail.message) {
            console.warn("Received 'open-chat-widget-with-message', input setting needs implementation via ref or state management.");
            if (!isOpen) toggleChat();
          } else {
            if (!isOpen) toggleChat();
          }
        };

        document.addEventListener('open-chat-widget', handleOpenChatEvent);
        document.addEventListener('open-chat-widget-with-message', handleOpenWithMessageEvent as EventListener);

        // Mark as initialized
        setInitialized(true);

        // Return cleanup function
        return () => {
          document.removeEventListener('open-chat-widget', handleOpenChatEvent);
          document.removeEventListener('open-chat-widget-with-message', handleOpenWithMessageEvent as EventListener);
          document.body.classList.remove('overflow-hidden');
          if (tokenRefreshTimeout) {
            clearTimeout(tokenRefreshTimeout);
          }
        };
      } catch (error) {
        console.error('Failed to initialize chat widget:', error);
        monitoring.captureError(error as Error, { name, apiKey });
        setError('Failed to initialize chat widget');
        monitoring.finishTransaction();
      }
    }

    init();
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

  // Sync chat messages with localStorage
  useEffect(() => {
    if (!initialized) return;

    if (previousMessages.length > 0 || currentChat.user || currentChat.ai) {
      localStorage.setItem('chatMessages', JSON.stringify({
        previousMessages,
        currentChat
      }));
    }
  }, [previousMessages, currentChat, initialized]);

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
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
  }, [isOpen]);

  const toggleFullscreen = useCallback(() => {
    const newIsFullscreen = !isFullscreen;
    setIsFullscreen(newIsFullscreen);
  }, [isFullscreen]);

  const handleClearChat = useCallback((event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling if called from button click

    localStorage.removeItem('chatMessages'); // Clear persisted messages
    setUploadedMedia(null); // Clear any pending upload
    setError('');
    setPreviousMessages([]); // Previous messages are cleared
    setCurrentChat({
      user: null,
      ai: null
    }); // Reset currentChat with clean state
    setIsTyping(false); // Ensure typing state is reset
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() && !uploadedMedia) return;

    monitoring.startPerformanceTransaction('send_message');

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

      const clientId = await getClientId();
      const response = await sendMessageAPI({
        message: userMessage.content,
        sender: 'user',
        content_type: mediaToSend ? 'text_image' : 'text',
        media_url: mediaToSend?.url,
        conversation_id: currentChat.ai?.conversation_id,
        client_id: clientId
      });

      setIsTyping(false);
      const aiMessage = {
        ...response.message,
        id: response.message.id || Date.now() + 1,
        isStreaming: true, // Mark new AI messages for streaming
        hasTyped: false // Initialize as not typed
      };
      setCurrentChat(prev => ({ ...prev, ai: aiMessage }));
      monitoring.finishTransaction(); // Finish transaction after successful send
    } catch (err) {
      console.error('Failed to send message:', err);
      monitoring.captureError(err as Error, {
        name,
        apiKey,
        messageText,
        hasMedia: !!uploadedMedia
      });
      setIsTyping(false);
      setError('Failed to send message. Please try again.');
      monitoring.finishTransaction();
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

  // Don't render until initialization is complete
  if (!initialized) {
    return null
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
        popularQuestions={popularQuestions}
        popularQuestionsTitle={popularQuestionsTitle}
        statusMessage={statusMessage}
        logo_url={logo_url}
      />

      {/* Toggle Button */}
      {!isOpen && (
        <ChatToggleButton onClick={toggleChat} position={position} primaryColor={primaryColor} />
      )}
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
    root.render(
      <WidgetErrorBoundary>
        <ChatWidget {...options} />
      </WidgetErrorBoundary>
    );
  }
};

export default chatWidgetExports;
