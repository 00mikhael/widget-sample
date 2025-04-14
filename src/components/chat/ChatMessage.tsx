import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { Message, parseMessage } from './utils';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean; // Optional prop to control Typed.js initialization
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false }) => {
  const isUser = message.sender === 'user';
  const typedElementRef = useRef<HTMLSpanElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);

  // Effect for Typed.js animation on AI messages
  useEffect(() => {
    // Only run for AI messages marked for streaming AND if the element exists
    if (!isUser && isStreaming && typedElementRef.current) {
      // Destroy previous instance if it exists
      typedInstanceRef.current?.destroy();

      const options = {
        strings: [parseMessage(message.content)], // Parse content before typing
        typeSpeed: 50,
        showCursor: true,
        cursorChar: '|',
        contentType: 'html', // Typed.js expects a string, 'html' is valid
        onComplete: (self: Typed) => {
          // Remove cursor after completion
          if (self.cursor) {
            self.cursor.remove();
          }
          // Optionally call a callback here if needed by parent
        },
        // Consider adding onStringTyped if scroll adjustment is needed during typing
      };

      typedInstanceRef.current = new Typed(typedElementRef.current, options);
    } else if (!isStreaming && typedInstanceRef.current) {
      // If streaming stops (e.g., message fully loaded elsewhere), destroy Typed instance
      typedInstanceRef.current.destroy();
      typedInstanceRef.current = null;
      // Ensure final content is displayed correctly if Typed was interrupted
      if (typedElementRef.current) {
        typedElementRef.current.innerHTML = parseMessage(message.content);
      }
    }

    // Cleanup function to destroy Typed instance on unmount or re-render
    return () => {
      typedInstanceRef.current?.destroy();
      typedInstanceRef.current = null;
    };
  }, [isUser, isStreaming, message.content, message.id]); // Re-run if streaming status or content changes

  const parsedContent = parseMessage(message.content);

  return (
    <div className={`tw-flex tw-flex-col ${isUser ? 'tw-items-end' : 'tw-items-start'}`}>
      <div className="tw-flex tw-flex-col">
        <div
          className={`tw-max-w-[85%] tw-rounded-3xl tw-pl-3 tw-pr-6 tw-py-2 ${isUser ? 'tw-bg-gray-100 tw-text-gray-900' : 'tw-text-gray-800'
            }`}
        >
          {/* Use dangerouslySetInnerHTML for parsed HTML content */}
          {/* For AI messages intended for streaming, use the ref */}
          {!isUser && isStreaming ? (
            <span ref={typedElementRef} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: parsedContent }} />
          )}
        </div>

        {/* Image indicator for user messages */}
        {isUser && message.content_type === 'text_image' && (
          <div className="tw-flex tw-items-center tw-gap-1 tw-mt-1 tw-text-xs tw-text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-4 tw-h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>Image attached</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
