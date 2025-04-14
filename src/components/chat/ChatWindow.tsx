import React, { useState, useEffect } from 'react';
import { Message, CurrentChat } from './utils';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInput from './ChatInput';
interface ChatWindowProps {
  isOpen: boolean;
  isTyping: boolean;
  previousMessages: Message[];
  currentChat: CurrentChat;
  error: string;
  uploadedFileName?: string;
  chatContentRef: React.RefObject<HTMLDivElement>;
  primaryColor?: string;
  isFullscreen: boolean;
  name: string;
  welcomeMessages?: string[];
  onClose: () => void;
  onClearChat: (event?: React.MouseEvent) => void;
  onSendMessage: (messageText: string) => void;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
  onToggleFullscreen: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  primaryColor,
  isOpen,
  isTyping,
  previousMessages,
  currentChat,
  error,
  uploadedFileName,
  chatContentRef,
  isFullscreen,
  name,
  onClose,
  onClearChat,
  onSendMessage,
  onFileUpload,
  onRemoveFile,
  onToggleFullscreen,
  welcomeMessages
}) => {
  const showWelcome = previousMessages.length === 0 && !currentChat.user && !currentChat.ai && !isTyping;
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 512);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // We control visibility via transform based on isOpen prop
  const transformClass = isOpen ? 'tw-translate-x-0' : 'tw-translate-x-full';

  return (
    <div
      className={`tw-fixed tw-inset-y-0 tw-right-0 ${isFullscreen || isSmallScreen ? 'tw-w-full' : 'tw-w-[32rem]'
        } tw-z-[9999] tw-transform tw-transition-transform tw-duration-300 tw-flex tw-flex-col ${transformClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-widget-title"
      hidden={!isOpen} // Hide from accessibility tree when closed
    >
      <div className="tw-h-[100vh] tw-bg-white tw-shadow-xl tw-flex tw-flex-col">
        {/* Header */}
        <ChatHeader
          onClose={onClose}
          onClearChat={onClearChat}
          primaryColor={primaryColor}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          name={name}
        />

        <div className={`tw-h-full tw-w-full tw-mx-auto tw-flex tw-flex-col ${isFullscreen ? 'tw-max-w-[1000px]' : ''}`}>
          {/* Chat Content Area */}
          <ChatContent
            previousMessages={previousMessages}
            currentChat={currentChat}
            isTyping={isTyping}
            isFullscreen={isFullscreen}
            chatContentRef={chatContentRef}
            welcomeMessages={welcomeMessages}
          />
          {/* Input Area */}
          <ChatInput
            error={error}
            uploadedFileName={uploadedFileName}
            primaryColor={primaryColor}
            onSendMessage={onSendMessage}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            isFullscreen={isFullscreen}
            showWelcome={showWelcome}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
