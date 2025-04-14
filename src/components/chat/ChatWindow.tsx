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
  const transformClass = isOpen ? 'translate-x-0' : 'translate-x-full';

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[32rem] z-[9999] transform transition-transform duration-300 flex flex-col ${transformClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-widget-title"
      hidden={!isOpen} // Hide from accessibility tree when closed
    >
      <div className="h-[100dvh] bg-white shadow-xl flex flex-col">
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
