import React from 'react';
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
  onClose: () => void;
  onClearChat: (event?: React.MouseEvent) => void;
  onSendMessage: (messageText: string) => void;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
  // onNavigateToAskAi: () => void; // Add if needed
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  isTyping,
  previousMessages,
  currentChat,
  error,
  uploadedFileName,
  chatContentRef,
  onClose,
  onClearChat,
  onSendMessage,
  onFileUpload,
  onRemoveFile,
  // onNavigateToAskAi
}) => {
  // We control visibility via transform based on isOpen prop
  const transformClass = isOpen ? 'tw-translate-x-0' : 'tw-translate-x-full';

  return (
    <div
      className={`tw-fixed tw-inset-y-0 tw-right-0 tw-w-[32rem] tw-z-[9999] tw-transform tw-transition-transform tw-duration-300 tw-flex tw-flex-col ${transformClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-widget-title"
      hidden={!isOpen} // Hide from accessibility tree when closed
    >
      <div className="tw-h-[100dvh] tw-bg-white tw-shadow-xl tw-flex tw-flex-col">
        {/* Header */}
        <ChatHeader
          onClose={onClose}
          onClearChat={onClearChat}
        // onNavigateToAskAi={onNavigateToAskAi} // Pass if needed
        />

        {/* Chat Content Area */}
        <ChatContent
          previousMessages={previousMessages}
          currentChat={currentChat}
          isTyping={isTyping}
          chatContentRef={chatContentRef}
        />

        {/* Input Area */}
        <ChatInput
          error={error}
          uploadedFileName={uploadedFileName}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
