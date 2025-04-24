import React, { useState, useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
import type { Typed } from 'react-typed';
import { Message, CurrentChat } from './utils';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import PopularQuestions from './PopularQuestions';

interface ChatContentProps {
  previousMessages: Message[];
  currentChat: CurrentChat;
  isTyping: boolean;
  isFullscreen: boolean;
  chatContentRef: React.RefObject<HTMLDivElement>;
  welcomeMessages?: string[];
  popularQuestions?: string[];
  popularQuestionsTitle?: string;
  onScroll?: () => void;
  onSendMessage: (messageText: string) => void;
  statusMessage?: string;
}

const MAX_MESSAGE_LENGTH = 60

const ChatContent: React.FC<ChatContentProps> = ({
  previousMessages,
  currentChat,
  isTyping,
  isFullscreen,
  chatContentRef,
  welcomeMessages,
  popularQuestions,
  popularQuestionsTitle,
  onSendMessage,
  statusMessage
}) => {
  const showWelcome = previousMessages.length === 0 && !currentChat.user && !currentChat.ai && !isTyping;
  const typedInstanceRef = useRef<Typed | null>(null);

  // Enhanced auto-scroll effect with smooth scrolling
  useEffect(() => {
    const scrollToBottom = (smooth = true) => {
      if (chatContentRef.current && !showWelcome) {
        chatContentRef.current.scrollTo({
          top: chatContentRef.current.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    // Initial scroll without smooth behavior
    if (!showWelcome) {
      scrollToBottom(false);
    }

    // Set up an observer to watch for content changes
    const observer = new MutationObserver(() => {
      if (!showWelcome) {
        scrollToBottom(true);
      }
    });

    if (chatContentRef.current && !showWelcome) {
      observer.observe(chatContentRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Clean up
    return () => observer.disconnect();
  }, [previousMessages, currentChat, isTyping, showWelcome]);

  // Additional scroll trigger when new content is added
  useEffect(() => {
    if (chatContentRef.current && !showWelcome) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentChat.ai?.content, showWelcome]);

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
        <>
          <div className={`tw-text-center tw-px-6 welcome-gradient ${isFullscreen ? 'tw-text-3xl tw-pt-20 tw-font-bold' : 'tw-pt-4 tw-h-14'}`}>
            <ReactTyped
              key={showWelcome ? 'active' : 'inactive'}
              strings={welcomeMessages?.map((msg) => {
                if (msg?.length > MAX_MESSAGE_LENGTH) {
                  return msg.slice(0, MAX_MESSAGE_LENGTH) + '...';
                }
                return msg;
              })}
              typeSpeed={20}
              backSpeed={30}
              backDelay={3000}
              loop
              smartBackspace
              shuffle={false}
              typedRef={(typed) => { typedInstanceRef.current = typed; }}
            />
          </div>

          {popularQuestions && popularQuestions.length > 0 && (
            <div className={`${isFullscreen ? `tw-pt-2` : `tw-pt-6`}`}>
              <PopularQuestions
                questions={popularQuestions}
                handleSendMessage={async (text) => {
                  await onSendMessage(text);
                }}
                title={popularQuestionsTitle}
              />
            </div>
          )}
        </>
      )}

      <div className={`tw-flex tw-flex-col tw-space-y-4 ${!showWelcome ? 'tw-min-h-full' : ''}`}>
        {previousMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={false}
            isCurrentMessage={false}
            chatContentRef={chatContentRef}
            onSendMessage={onSendMessage}
          />
        ))}

        {currentChat.user && (
          <>
            <ChatMessage
              message={currentChat.user}
              isStreaming={false}
              isCurrentMessage={true}
              chatContentRef={chatContentRef}
              onSendMessage={onSendMessage}
            />
            {isTyping && <TypingIndicator statusMessage={statusMessage} />}
          </>
        )}

        {!isTyping && currentChat.ai && (
          <ChatMessage
            key={`ai-${currentChat.ai.id}`}
            message={currentChat.ai}
            isStreaming={currentChat.ai.isStreaming}
            isCurrentMessage={true}
            chatContentRef={chatContentRef}
            onSendMessage={onSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContent;
