import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, CurrentChat, sendMessageAPI, parseMessage as utilsParseMessage } from '../chat/utils';
import { ReactTyped } from 'react-typed';
// Assuming ReactTyped exports its instance type, otherwise might need adjustment
import type { Typed } from 'react-typed';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

// Placeholder strings for the initial typing animation
const placeholderStrings = [
  "Hello! How can I assist you with Mixhers supplements today?",
  "Questions about Mixhers supplements? Ask away!",
  "Ask me about Hertime PMS relief supplements!",
  "Curious about Mixhers for painful cramps? Ask me anything!",
  "Need info on Mixhers' metabolism boosters?",
  "Ask about Mixhers' digestion support.",
  "Learn about Mixhers' sleep aids."
];

const AskAiPage: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<{ user: Message | null; ai: Message | null }>({ user: null, ai: null });
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image' } | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [randomPlaceholder, setRandomPlaceholder] = useState('');

  const chatContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null); // Ref to store Typed instance

  // Define the structure for the API request body
  interface ApiChatRequest {
    message: string;
    conversation_id: string;
    content_type: 'text' | 'text_image';
    media_url?: string; // Optional base64 image data
  }

  // Define the structure for the API response body
  interface ApiChatResponse {
    content: string;
    conversation_id: string;
    agent: string;
    sender: 'ai'; // Assuming sender is always 'ai' in response
  }

  // --- Helper Functions ---

  const scrollToBottom = useCallback(() => {
    if (chatContentRef.current) {
      // Use setTimeout to ensure DOM updates are flushed
      setTimeout(() => {
        if (chatContentRef.current) {
          chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
      }, 0);
    }
  }, []);

  const showResultsView = useCallback(() => {
    setShowResults(true);
    // Stop typing animation when chat starts
    if (typedInstanceRef.current) {
      typedInstanceRef.current.destroy();
      typedInstanceRef.current = null;
    }
    scrollToBottom();
  }, [scrollToBottom]);

  // --- Effects ---

  useEffect(() => {
    // Set initial random placeholder
    setRandomPlaceholder(placeholderStrings[Math.floor(Math.random() * placeholderStrings.length)]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [previousMessages, currentChat, isTyping, scrollToBottom]);

  // --- Event Handlers ---

  const handleSendMessage = async () => {
    const messageText = messageInput.trim();
    if (!messageText && !uploadedMedia) return; // Need text or media

    setError('');
    setIsTyping(true);

    if (!showResults) {
      showResultsView();
    }

    // Move current chat to history
    const newPreviousMessages = [...previousMessages];
    if (currentChat.user) newPreviousMessages.push(currentChat.user);
    if (currentChat.ai) newPreviousMessages.push(currentChat.ai);
    setPreviousMessages(newPreviousMessages);

    // Create new user message
    const newUserMessage: Message = {
      id: Date.now(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      content_type: uploadedMedia ? 'text_image' : 'text',
    };

    setCurrentChat({ user: newUserMessage, ai: null });
    setMessageInput('');
    const mediaToSend = uploadedMedia; // Capture media before clearing state
    const currentConvId = conversationId || uuidv4(); // Generate ID if first message
    if (!conversationId) {
      setConversationId(currentConvId);
    }

    // Clear file state immediately after capturing
    setUploadedMedia(null);
    setUploadedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Scroll after adding user message
    scrollToBottom();

    try {
      const { message: aiMessage } = await sendMessageAPI({
        message: messageText,
        sender: 'user',
        content_type: mediaToSend ? 'text_image' : 'text',
        media_url: mediaToSend?.url,
        conversation_id: currentConvId
      });

      setIsTyping(false);

      if (aiMessage.conversation_id) {
        setConversationId(aiMessage.conversation_id);
      }

      setCurrentChat(prev => ({ ...prev, ai: aiMessage }));

    } catch (err: unknown) { // Use unknown for better type safety
      setIsTyping(false);
      let errorMessage = 'An error occurred while sending your message.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      console.error('Send message error:', err);
      // Optionally revert state or keep user message displayed with error
      // setCurrentChat(prev => ({ ...prev, ai: null })); // Keep user message
    } finally {
      // Ensure scroll happens after potential state updates in catch/finally
      scrollToBottom();
    }
  };

  const handleClearChat = () => {
    setPreviousMessages([]);
    setCurrentChat({ user: null, ai: null });
    setUploadedMedia(null);
    setUploadedFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError('');
    setIsTyping(false);
    setConversationId(null); // Reset conversation ID
    setShowResults(false); // Go back to initial view
    // Re-initialize placeholder and typing animation if needed
    setRandomPlaceholder(placeholderStrings[Math.floor(Math.random() * placeholderStrings.length)]);
    // Note: We don't need to call a backend clear endpoint per the latest API info
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setUploadedMedia(null);
      setUploadedFileName('');
      event.target.value = ''; // Reset file input
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUploadedMedia({ url: reader.result as string, type: 'image' });
      setUploadedFileName(file.name);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setUploadedMedia(null);
      setUploadedFileName('');
    };
  };

  const handleRemoveFile = () => {
    setUploadedMedia(null);
    setUploadedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  // --- Render Logic ---

  const sendDisabled = !messageInput.trim() && !uploadedMedia;
  const showClearButton = !!(uploadedFileName || previousMessages.length > 0 || currentChat.user || currentChat.ai); // Ensure boolean

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col relative pt-[120px] md:pt-0 md:justify-center">
      {/* Initial Message */}
      <div
        className={`transition-all duration-500 absolute inset-x-0 top-0 pb-16 z-10 ${showResults ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-gray-600 text-lg sm:text-3xl pt-48 p-8">
            {!showResults && randomPlaceholder && (
              <ReactTyped
                strings={placeholderStrings}
                typeSpeed={20}
                backSpeed={30}
                backDelay={3000}
                loop
                smartBackspace
                shuffle={false}
                // Store instance for potential destruction
                typedRef={(typed) => { typedInstanceRef.current = typed; }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div
        className={`transition-all duration-500 absolute inset-x-0 top-0 bottom-32 z-10 flex flex-col h-full w-full md:bottom-0 ${showResults ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          ref={chatContentRef}
          className="w-full mx-auto px-4 space-y-6 h-full flex-1 min-h-0 overflow-y-auto relative flex flex-col items-center pb-40 sm:pb-52 scrollbar-hide"
        >
          {/* Previous Messages */}
          <div id="previousMessages" className="flex flex-col space-y-4 w-full max-w-3xl">
            {previousMessages.map((message) => (
              <ChatMessage key={message.id} message={message} parseMessage={utilsParseMessage} />
            ))}
          </div>

          {/* Current Chat */}
          <div id="currentChat" className="flex flex-col space-y-4 w-full max-w-3xl">
            {currentChat.user && (
              <ChatMessage message={currentChat.user} parseMessage={utilsParseMessage} />
            )}
            {isTyping && <TypingIndicator />}
            {currentChat.ai && (
              <ChatMessage message={currentChat.ai} parseMessage={utilsParseMessage} isStreaming={false} /> // Pass isStreaming if needed later
            )}
          </div>

          {error && (
            <div className="mt-2 rounded-lg bg-red-100 p-2 text-xs text-red-600 self-center max-w-3xl w-full">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Search Input Area */}
      <ChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        uploadedFileName={uploadedFileName}
        handleSendMessage={handleSendMessage}
        handleClearChat={handleClearChat}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        fileInputRef={fileInputRef}
        sendDisabled={sendDisabled}
        showClearButton={showClearButton}
        placeholder={randomPlaceholder}
        showResults={showResults}
      />
    </div>
  );
};

export default AskAiPage;
