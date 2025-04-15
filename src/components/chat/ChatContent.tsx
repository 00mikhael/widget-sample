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
  onScroll?: () => void;
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

  // Enhanced auto-scroll effect with smooth scrolling
  useEffect(() => {
    const scrollToBottom = (smooth = true) => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTo({
          top: chatContentRef.current.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    // Initial scroll without smooth behavior
    scrollToBottom(false);

    // Set up an observer to watch for content changes
    const observer = new MutationObserver(() => {
      scrollToBottom(true);
    });

    if (chatContentRef.current) {
      observer.observe(chatContentRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Clean up
    return () => observer.disconnect();
  }, [previousMessages, currentChat, isTyping]);

  // Additional scroll trigger when new content is added
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentChat.ai?.content]);

  return (
    <div
      ref={chatContentRef}
      className={`
        tw-absolute tw-inset-0 tw-overflow-y-auto
        tw-overscroll-none tw-p-4 tw-space-y-4
        hide-scrollbar
        ${showWelcome ? 'tw-h-auto' : 'tw-h-full'}
      `}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >

      {showWelcome && (
        <div className={`tw-text-center tw-px-6 welcome-gradient ${isFullscreen ? 'tw-text-3xl tw-pt-48 tw-font-bold' : ''}`}>
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

      <div className={`tw-flex tw-flex-col tw-space-y-4 ${!showWelcome ? 'tw-min-h-full' : ''}`}>
        {previousMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={false}
            isCurrentMessage={false}
            chatContentRef={chatContentRef}
          />
        ))}

        {currentChat.user && (
          <>
            <ChatMessage
              message={currentChat.user}
              isStreaming={false}
              isCurrentMessage={true}
              chatContentRef={chatContentRef}
            />
            {isTyping && <TypingIndicator />}
          </>
        )}

        {!isTyping && currentChat.ai && (
          <ChatMessage
            key={`ai-${currentChat.ai.id}`}
            message={currentChat.ai}
            isStreaming={currentChat.ai.isStreaming}
            isCurrentMessage={true}
            chatContentRef={chatContentRef}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContent;
