import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { Message, parseMessage } from './utils';
import MessageContentRenderer from './MessageContentRenderer';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean; // Optional prop to control Typed.js initialization
  isCurrentMessage?: boolean; // Optional prop to identify current chat message
  chatContentRef: React.RefObject<HTMLDivElement>; // Reference to chat content for scrolling
  onSendMessage: (messageText: string) => void; // Handler for sending messages (for question options)
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false, isCurrentMessage = false, chatContentRef, onSendMessage }) => {
  const isUser = message.sender === 'user';
  const typedElementRef = useRef<HTMLSpanElement | null>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [isPrimaryContentTyped, setIsPrimaryContentTyped] = useState(false);

  // Effect for Typed.js animation on AI messages
  useEffect(() => {
    // Only run for AI messages that are marked for streaming, haven't been typed yet, and if the element exists
    if (!isUser && isStreaming && !message.hasTyped && typedElementRef.current) {
      // Destroy previous instance if it exists
      typedInstanceRef.current?.destroy();

      const options = {
        strings: [parseMessage(message.content)], // Parse content before typing
        typeSpeed: 20,
        showCursor: true,
        cursorChar: '|',
        contentType: 'html', // Typed.js expects a string, 'html' is valid
        onComplete: (self: Typed) => {
          // Remove cursor after completion
          if (self.cursor) {
            self.cursor.remove();
          }
          // Mark message as typed and allow additional responses
          message.hasTyped = true;
          setIsPrimaryContentTyped(true);
        },
        onStringTyped: () => {
          // Scroll into view as text is being typed using the ref
          if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
          }
        }
      };

      typedInstanceRef.current = new Typed(typedElementRef.current, options);
    } else if (!isStreaming || message.hasTyped) {
      // If streaming stops or message was already typed
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }
      // Always ensure final content is displayed correctly, even if typing was interrupted
      if (typedElementRef.current) {
        typedElementRef.current.innerHTML = parseMessage(message.content);
      }
      // Set primary content as typed to allow additional responses
      if (!isPrimaryContentTyped) {
        setIsPrimaryContentTyped(true);
      }
    }

    // Cleanup function to destroy Typed instance on unmount or re-render
    return () => {
      typedInstanceRef.current?.destroy();
      typedInstanceRef.current = null;
    };
  }, [isUser, isStreaming, message.content, message.hasTyped]); // Remove message.id from deps since we use hasTyped now

  return (
    <div
      className={`
        tw-flex tw-flex-col
        ${isUser ? 'tw-items-end' : 'tw-items-start'}
        ${isCurrentMessage ? 'user-message-animate' : ''}
        tw-w-full
      `}
    >
      <div className={`tw-flex tw-flex-col ${isUser ? 'tw-items-end' : 'tw-items-start'} tw-w-full tw-gap-2`}>

        <div className="tw-w-full">

          <MessageContentRenderer
            contentType={message.content_type}
            content={message.content}
            mediaUrl={message.media_url}
            imageUrl={message.image_url}
            options={message.options}
            onSendMessage={onSendMessage}
            isStreaming={isStreaming}
            isUser={isUser}
            typedElementRef={typedElementRef}
          />

          {/* Show additional responses */}
          {!isUser && isPrimaryContentTyped && message.additional_responses && message.additional_responses.length > 0 && (
            <div className="tw-flex tw-flex-col tw-gap-4 tw-mt-4 tw-pt-4 additional-responses">
              {message.additional_responses.map((response, index) => (
                <MessageContentRenderer
                  key={index}
                  contentType={response.content_type}
                  content={response.content}
                  mediaUrl={response.media_url}
                  options={response.options}
                  follow_up_questions={response.follow_up_questions}
                  onSendMessage={onSendMessage}
                  isUser={isUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
