import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { Message, parseMessage } from './utils';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean; // Optional prop to control Typed.js initialization
  isCurrentMessage?: boolean; // Optional prop to identify current chat message
  chatContentRef: React.RefObject<HTMLDivElement>; // Reference to chat content for scrolling
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false, isCurrentMessage = false, chatContentRef }) => {
  const isUser = message.sender === 'user';
  const typedElementRef = useRef<HTMLSpanElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);

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
          // Mark message as typed
          message.hasTyped = true;
        },
        onStringTyped: () => {
          // Scroll into view as text is being typed using the ref
          if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
          }
        }
      };

      typedInstanceRef.current = new Typed(typedElementRef.current, options);
    } else if ((!isStreaming || message.hasTyped) && typedInstanceRef.current) {
      // If streaming stops or message was already typed, destroy Typed instance
      typedInstanceRef.current.destroy();
      typedInstanceRef.current = null;
      // Ensure final content is displayed correctly
      if (typedElementRef.current) {
        typedElementRef.current.innerHTML = parseMessage(message.content);
      }
    }

    // Cleanup function to destroy Typed instance on unmount or re-render
    return () => {
      typedInstanceRef.current?.destroy();
      typedInstanceRef.current = null;
    };
  }, [isUser, isStreaming, message.content, message.hasTyped]); // Remove message.id from deps since we use hasTyped now

  const parsedContent = parseMessage(message.content);
  const isImageOnly = message.content_type === 'text_image' && !message.content.trim();

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
        {/* Show image preview for text_image type */}
        {message.content_type === 'text_image' && message.image_url && (
          <div className="tw-max-w-[150px] tw-rounded-lg tw-overflow-hidden tw-relative image-container">
            <img
              src={message.image_url}
              alt="Attached"
              className="tw-w-full tw-h-auto tw-rounded-lg"
              loading="lazy"
            />

            {/* Image indicator for user messages - show only when there's text */}
            {isUser && message.content_type === 'text_image' && (
              <div className="tw-flex tw-items-center tw-gap-1 tw-my-2 tw-text-xs tw-text-gray-500 tw-transition-opacity tw-duration-200 tw-opacity-75 hover:tw-opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-4 tw-h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span>Image attached</span>
              </div>
            )}

            <div className="tw-absolute tw-bottom-[-1.5rem] tw-left-1/2 tw-transform tw--translate-x-1/2 message-timestamp">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}

        {/* Show text content in bubble */}
        {(!isImageOnly || !isUser) && (
          <div
            className={`
              tw-max-w-[80%] tw-rounded-2xl tw-px-4 tw-py-3
              tw-text-gray-900
              tw-transition-all tw-duration-200
              hover:tw-shadow-md message-content
              ${isUser ? 'tw-bg-gray-100 hover:tw-bg-gray-200 user-message' : 'ai-message'}
            `}
          >

            {/* Show content only if it's not an image-only message */}
            {(!isImageOnly) && (
              !isUser && isStreaming ? (
                <span ref={typedElementRef} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: parsedContent }}></div>
              )
            )}

            {/* Timestamp that shows on hover */}
            <div className={`message-timestamp-hover ${isUser ? 'tw-right-4' : 'tw-left-4'}`}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
