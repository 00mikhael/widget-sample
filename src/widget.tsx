import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/widget.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Sample prompts component
const SamplePrompts = ({ onPromptClick: sendMessage }: { onPromptClick: (prompt: string) => void }) => (
  <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-text-center tw-p-6">
    <p className="tw-text-gray-600 tw-mb-2 tw-font-medium">Try asking about:</p>
    {[
      "What are the waste collection days in my area?",
      "How do I report illegal dumping?"
    ].map((prompt) => (
      <button
        key={prompt}
        onClick={() => sendMessage(prompt)}
        className="tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-gray-800 tw-px-5 tw-py-3.5 tw-rounded-xl tw-text-sm tw-transition-all tw-duration-300 tw-max-w-[280px] tw-text-left tw-shadow-sm hover:tw-shadow-md tw-w-full"
      >
        {prompt}
      </button>
    ))}
  </div>
);

// Typing indicator component
const TypingIndicator = () => (
  <div
    className="tw-flex tw-space-x-2 tw-p-3.5 tw-bg-gray-100 tw-rounded-xl tw-max-w-[80%]"
    data-aos="fade"
    data-aos-duration="500"
  >
    <div className="tw-flex tw-space-x-1">
      <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full typing-dot"></div>
      <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full typing-dot"></div>
      <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full typing-dot"></div>
    </div>
  </div>
);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type WidgetProps = {
  name: string;
  apiKey: string;
};

const Widget = ({ name, apiKey }: WidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  console.log({ apiKey })

  useEffect(() => {
    setIsClient(true);
    setMessages([]);

    // Initialize AOS
    AOS.init({
      duration: 500,
      once: false,
      mirror: true
    });

    // Trigger button animation after a short delay
    const timer = setTimeout(() => setIsButtonVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setIsAiTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message. This is a demo response from ${name}.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setIsAiTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
    }, 2000);
  };

  return (
    <div className="lawma-ai-widget">
      {/* Floating Action Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`tw-transform tw-transition-all tw-duration-300 tw-ease-out tw-w-14 tw-h-14 tw-rounded-l-full tw-rounded-r-none tw-bg-black hover:tw-bg-gray-900 tw-text-white tw-flex tw-items-center tw-justify-center tw-shadow-lg hover:tw-shadow-xl ${isButtonVisible ? 'tw-translate-x-0 tw-opacity-100' : 'tw-translate-x-full tw-opacity-0'
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="tw-h-6 tw-w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      )}
      {/* Slide Pane */}
      <div
        className={`tw-fixed tw-top-0 tw-right-0 tw-h-full tw-w-[400px] tw-bg-white tw-shadow-2xl tw-transform tw-transition-transform tw-duration-300 tw-ease-in-out tw-isolate ${isExpanded ? 'tw-translate-x-0' : 'tw-translate-x-full'
          }`}
      >
        <div className="tw-p-4 tw-flex tw-justify-between tw-items-center tw-border-b tw-bg-gray-50">
          <h2 className="tw-text-xl tw-font-semibold">{name}</h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="tw-p-2 hover:tw-bg-gray-100 tw-rounded-full tw-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="tw-h-6 tw-w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="tw-flex tw-flex-col tw-h-[calc(100%-64px)]">
          {/* Messages container */}
          <div className="tw-flex-1 tw-overflow-y-auto tw-p-6 tw-space-y-6 tw-relative tw-bg-white">
            {messages.length === 0 && (
              <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-w-full">
                <SamplePrompts onPromptClick={(prompt) => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    content: prompt,
                    sender: 'user',
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, newMessage]);
                  // Simulate AI response
                  setIsAiTyping(true);
                  setTimeout(() => {
                    const aiResponse: Message = {
                      id: (Date.now() + 1).toString(),
                      content: `Thank you for your message. This is a demo response from ${name}.`,
                      sender: 'ai',
                      timestamp: new Date(),
                    };
                    setIsAiTyping(false);
                    setMessages((prev) => [...prev, aiResponse]);
                  }, 2000);
                }} />
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                data-aos={isClient ? "fade-up" : undefined}
                data-aos-delay={isClient ? (message.sender === 'user' ? "0" : "300") : undefined}
                className={`tw-flex ${message.sender === 'user' ? 'tw-justify-end' : 'tw-justify-start'
                  }`}
              >
                <div
                  className={`tw-max-w-[80%] tw-rounded-2xl tw-p-4 ${message.sender === 'user'
                    ? 'tw-bg-gradient-to-br tw-from-gray-800 tw-to-black tw-text-white tw-shadow-md'
                    : 'tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-200 tw-text-gray-800 tw-shadow-sm'
                    } tw-shadow-md tw-transition-all tw-duration-300`}
                >
                  <p className="tw-leading-relaxed">{message.content}</p>
                  <p className={`tw-text-xs tw-mt-2 ${message.sender === 'user' ? 'tw-text-gray-300' : 'tw-text-gray-500'
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Typing Indicator */}
          {isClient && isAiTyping && (
            <div className="tw-flex tw-justify-start tw-p-4">
              <TypingIndicator />
            </div>
          )}
          {/* Input area */}
          <div className="tw-border-t tw-p-4 tw-pb-6 tw-bg-gray-50">
            <div className="tw-flex tw-space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="tw-flex-1 tw-border tw-rounded-xl tw-px-5 tw-py-3 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-800 focus:tw-border-transparent tw-transition-all tw-duration-300 hover:tw-border-gray-600 tw-bg-white"
              />
              <button
                onClick={handleSendMessage}
                className="tw-bg-gradient-to-r tw-from-gray-800 tw-to-black tw-text-white tw-px-6 tw-py-3 tw-rounded-xl hover:tw-opacity-90 tw-transition-all tw-duration-300 tw-shadow-md hover:tw-shadow-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const widgetExports = {
  init: (options: WidgetProps) => {
    const container = document.createElement("div");
    container.id = "widget-container";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<Widget name={options.name} apiKey={options.apiKey} />);
  }
};

export default widgetExports;
