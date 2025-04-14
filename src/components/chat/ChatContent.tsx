import React, { useState, useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
import type { Typed } from 'react-typed';
import { Message, CurrentChat } from './utils';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatContentProps {
  previousMessages: Message[];
  currentChat: CurrentChat;
  isTyping: boolean;
  isFullscreen: boolean;
  chatContentRef: React.RefObject<HTMLDivElement>;
  welcomeMessages?: string[];
}

const ChatContent: React.FC<ChatContentProps> = ({
  previousMessages,
  currentChat,
  isTyping,
  isFullscreen,
  chatContentRef,
  welcomeMessages
}) => {
  const showWelcome = previousMessages.length === 0 && !currentChat.user && !currentChat.ai && !isTyping;
  const typedInstanceRef = useRef<Typed | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [previousMessages, currentChat, isTyping]);

  return (
    <div
      ref={chatContentRef}
      className="tw-flex-1 tw-min-h-0 tw-overflow-y-auto tw-p-4 tw-relative tw-flex tw-flex-col tw-space-y-4"
    >

      {showWelcome && (
        <div className={`tw-text-center tw-px-6 ${isFullscreen ? 'tw-text-3xl tw-pt-48 tw-text-gray-700' : 'tw-text-gray-500'}`}>
          <ReactTyped
            strings={welcomeMessages}
            typeSpeed={20}
            backSpeed={30}
            backDelay={3000}
            loop
            smartBackspace
            shuffle={false}
            // Store instance for potential destruction
            typedRef={(typed) => { typedInstanceRef.current = typed; }}
          />
        </div>
      )}

      <div className="tw-flex tw-flex-col tw-space-y-4">
        {previousMessages.map((message) => (
          <ChatMessage key={message.id} message={message} isStreaming={false} isCurrentMessage={false} />
        ))}

        {currentChat.user && (
          <>
            <ChatMessage message={currentChat.user} isStreaming={false} isCurrentMessage={true} />
            {isTyping && <TypingIndicator />}
          </>
        )}

        {!isTyping && currentChat.ai && (
          <ChatMessage message={currentChat.ai} isStreaming={true} isCurrentMessage={true} />
        )}
      </div>
    </div>
  );
};

export default ChatContent;
