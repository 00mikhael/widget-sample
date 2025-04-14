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

  // Determine if we should show the welcome message
  const showWelcome = previousMessages.length === 0 && !currentChat.user && !currentChat.ai && !isTyping;

  return (
    <div
      id="chatContent"
      ref={chatContentRef}
      className="tw-flex-1 tw-min-h-0 tw-overflow-y-auto tw-p-4 tw-relative tw-flex tw-flex-col tw-space-y-4"
    // The focusin logic from Alpine isn't directly applicable/needed in React this way
    >
      {/* Welcome Message */}
      {showWelcome && (
        <div className="tw-text-center tw-text-gray-500">{welcomeMessage}</div>
      )}

      {/* Previous Messages */}
      <div id="previousMessages" className="tw-flex tw-flex-col tw-space-y-4">
        {previousMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* Current Chat Turn */}
      <div id="currentChat" className="tw-flex tw-flex-col tw-space-y-4">
        {/* Current User Message */}
        {currentChat.user && (
          <ChatMessage message={currentChat.user} />
        )}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Current AI Response */}
        {currentChat.ai && !isTyping && ( // Only show AI response if not typing
          <ChatMessage message={currentChat.ai} isStreaming={false} /> // Pass isStreaming if using react-typed later
        )}
      </div>
    </div>
  );
};

export default ChatContent;
