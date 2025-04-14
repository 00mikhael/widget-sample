import React from 'react';
import { Message, CurrentChat } from './utils';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatContentProps {
  previousMessages: Message[];
  currentChat: CurrentChat;
  isTyping: boolean;
  chatContentRef: React.RefObject<HTMLDivElement>;
  welcomeMessage?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({
  previousMessages,
  currentChat,
  isTyping,
  chatContentRef,
  welcomeMessage = "Ask AI about..."
}) => {
  const showWelcome = previousMessages.length === 0 && !currentChat.user && !currentChat.ai && !isTyping;

  return (
    <div
      ref={chatContentRef}
      className="tw-flex-1 tw-min-h-0 tw-overflow-y-auto tw-p-4 tw-relative tw-flex tw-flex-col tw-space-y-4"
    >
      {showWelcome && (
        <div className="tw-text-center tw-text-gray-500">{welcomeMessage}</div>
      )}

      <div className="tw-flex tw-flex-col tw-space-y-4">
        {previousMessages.map((message) => (
          <ChatMessage key={message.id} message={message} isStreaming={false} />
        ))}

        {currentChat.user && (
          <>
            <ChatMessage message={currentChat.user} isStreaming={false} />
            {isTyping && <TypingIndicator />}
          </>
        )}

        {!isTyping && currentChat.ai && (
          <ChatMessage message={currentChat.ai} isStreaming={true} />
        )}
      </div>
    </div>
  );
};

export default ChatContent;
