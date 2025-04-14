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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 512);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const transformClass = isOpen ? 'tw-translate-x-0' : 'tw-translate-x-full';

  return (
    <div
      className={`
        tw-fixed tw-inset-y-0 tw-right-0
        ${isFullscreen || isSmallScreen ? 'tw-w-full' : 'tw-w-[32rem]'}
        tw-z-[9999] tw-transform
        tw-transition-all tw-duration-300 tw-ease-out
        tw-flex tw-flex-col chat-window
        ${transformClass}
        ${isOpen ? 'tw-opacity-100 tw-scale-100' : 'tw-opacity-0 tw-scale-95'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-widget-title"
      hidden={!isOpen}
    >
      <div className="tw-h-screen tw-bg-white tw-shadow-xl tw-flex tw-flex-col tw-will-change-transform tw-overflow-hidden">
        <ChatHeader
          onClose={onClose}
          onClearChat={onClearChat}
          primaryColor={primaryColor}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          name={name}
        />

        <div className={`tw-flex-1 tw-w-full tw-mx-auto tw-flex tw-flex-col tw-overflow-hidden ${isFullscreen ? 'tw-max-w-[1000px]' : ''}`}>
          <div className="tw-relative tw-flex-1 tw-min-h-0">
            <ChatContent
              previousMessages={previousMessages}
              currentChat={currentChat}
              isTyping={isTyping}
              isFullscreen={isFullscreen}
              chatContentRef={chatContentRef}
              welcomeMessages={welcomeMessages}
            />
            {/* Scroll to bottom button */}
            <button
              className="scroll-to-bottom"
              onClick={() => chatContentRef.current?.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: 'smooth' })}
              aria-label="Scroll to bottom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
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
