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
  popularQuestions?: string[];
  popularQuestionsTitle?: string;
  statusMessage?: string;
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
  welcomeMessages,
  popularQuestions,
  popularQuestionsTitle,
  statusMessage
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
        ${isFullscreen || isSmallScreen ? 'tw-w-full' : 'tw-w-[24rem]'}
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

        <div className={`tw-flex-1 tw-w-full tw-mx-auto tw-flex tw-flex-col tw-overflow-hidden ${isFullscreen ? 'tw-max-w-[1100px]' : ''}`}>
          <div className="tw-relative tw-flex-1 tw-min-h-0">
            <ChatContent
              previousMessages={previousMessages}
              currentChat={currentChat}
              isTyping={isTyping}
              isFullscreen={isFullscreen}
              chatContentRef={chatContentRef}
              welcomeMessages={welcomeMessages}
              onSendMessage={onSendMessage}
              popularQuestions={popularQuestions}
              popularQuestionsTitle={popularQuestionsTitle}
              statusMessage={statusMessage}
            />
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
