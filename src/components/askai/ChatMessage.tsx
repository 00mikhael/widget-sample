import React from 'react';

// Define message type (can be shared or imported if defined elsewhere)
interface Message {
    id: string | number;
    content: string;
    sender: 'user' | 'ai';
    timestamp?: string;
    content_type?: 'text' | 'text_image';
    agent?: string;
}

interface ChatMessageProps {
    message: Message;
    parseMessage: (content: string) => string;
    isStreaming?: boolean; // Optional prop for future streaming implementation
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, parseMessage, isStreaming }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className="flex flex-col">
                <div
                    className={`max-w-3xl rounded-3xl px-4 py-2 text-base ${
                        isUser
                            ? 'bg-gray-100 text-gray-800' // User message style
                            : 'bg-white text-gray-800 shadow-sm' // AI message style (added shadow for distinction)
                    }`}
                >
                    {/* Use dangerouslySetInnerHTML for parsed HTML content */}
                    <span dangerouslySetInnerHTML={{ __html: parseMessage(message.content) }} />
                    {/* Add streaming cursor if needed */}
                    {isStreaming && message.sender === 'ai' && <span className="typed-cursor">|</span>}
                </div>

                {/* Image indicator for user messages */}
                {isUser && message.content_type === 'text_image' && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span>Image attached</span>
                    </div>
                )}
                 {/* Optional: Display agent name for AI messages */}
                 {/* {!isUser && message.agent && (
                    <div className="mt-1 text-xs text-gray-400">
                        Agent: {message.agent}
                    </div>
                 )} */}
            </div>
        </div>
    );
};

export default ChatMessage;
