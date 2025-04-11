import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AiOutlineRobot } from "react-icons/ai";
import '../styles/widget.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import TypewriterText from './components/TypewriterText';

// Sample prompts component
const SamplePrompts = ({ onPromptClick: sendMessage }: { onPromptClick: (prompt: string) => void }) => (
  <div className="tw-flex tw-items-center tw-justify-center tw-h-full">
    <div className="tw-text-[28px] tw-text-[#6B7280] tw-font-light tw-text-center tw-max-w-[80%]">
      Ask AI about Mixhers' hormone support...
    </div>
  </div>
);

// Typing indicator component
const TypingIndicator = () => (
  <div className="tw-flex tw-space-x-2 tw-p-3.5 tw-bg-gray-100 tw-rounded-lg tw-max-w-[80%]">
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

interface WidgetProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  apiKey: string;
  primaryColor?: string;
};

const DEFAULT_PRIMARY_COLOR = '#1e2530';

const Widget = ({ name, apiKey, primaryColor = DEFAULT_PRIMARY_COLOR, style, ...otherProps }: WidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
  }, []);

  useEffect(() => {
    if (!isExpanded) setIsFullscreen(false)
  }, [isExpanded]);

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
          style={{ backgroundColor: primaryColor }}
          className="hamburger-button tw-rounded-l-full tw-rounded-r-none hover:tw-opacity-90 tw-text-white tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-500 hover:tw-shadow-xl tw-gap-2 tw-p-4"
        >
          <AiOutlineRobot size={24} />
          <div>Ask AI</div>
        </button>
      )}
      {/* Slide Pane */}
      <div
        className={`tw-fixed tw-bg-white tw-shadow-xl tw-transform tw-isolate
          ${isFullscreen ? 'tw-transition-all tw-duration-500 tw-ease-out' : 'tw-transition-transform tw-duration-500 tw-ease-in-out'}
          ${isFullscreen ? 'tw-inset-0 tw-h-screen tw-z-50' : 'tw-top-0 tw-right-0 tw-h-full tw-w-[500px]'}
          ${isExpanded ? 'tw-translate-x-0' : 'tw-translate-x-full'}`}
      >
        <div style={{ backgroundColor: primaryColor }} className={`tw-px-4 tw-py-3 tw-flex tw-justify-between tw-items-center tw-text-white
          ${isFullscreen ? 'tw-transition-all tw-duration-1000 tw-ease-out' : 'tw-transition-transform tw-duration-500 tw-ease-in-out'}
          ${isFullscreen ? 'tw-w-full' : ''}`}>
          <h2 className="tw-text-xl">{name}</h2>
          <div className="tw-flex tw-items-center tw-gap-4">
            <button className="tw-p-2 tw-text-[#ff4d4d] hover:tw-opacity-80">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="tw-p-2 hover:tw-text-gray-300"
            >
              {isFullscreen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 21H21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 3L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="tw-p-2 hover:tw-text-gray-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className={`tw-flex tw-flex-col ${isFullscreen ? 'tw-transition-all tw-duration-1000 tw-ease-out' : 'tw-transition-transform tw-duration-500 tw-ease-in-out'} ${isFullscreen ? 'tw-h-[calc(100vh-64px)]' : 'tw-h-[calc(100%-64px)]'}`}>
          {/* Messages container */}
          <div className={`tw-flex-1 tw-overflow-y-auto tw-p-6 tw-space-y-6 tw-relative tw-bg-white ${isFullscreen ? 'tw-transition-all tw-duration-1000 tw-ease-out' : 'tw-transition-transform tw-duration-500 tw-ease-in-out'} ${isFullscreen ? 'tw-w-full' : ''}`}>
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
                  style={message.sender === 'user' ? { backgroundColor: `#F8F8F8` } : undefined}
                  className={`tw-max-w-[80%] ${message.sender === 'user'
                    ? 'tw-bg-[#1e2530] tw-text-gray-800 tw-px-4 tw-py-2 tw-rounded-2xl'
                    : 'tw-text-gray-800 tw-pl-1'
                    }`}
                >
                  <p className="tw-leading-relaxed">
                    {message.sender === 'ai' ? (
                      <TypewriterText text={message.content} />
                    ) : (
                      message.content
                    )}
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
          <div className={`tw-border-t tw-p-4 tw-pb-6 tw-bg-white ${isFullscreen ? 'tw-w-full' : ''}`}>
            <div className={`tw-flex tw-space-x-3 ${isFullscreen ? 'tw-max-w-full' : 'tw-max-w-3xl tw-mx-auto'}`}>
              <div className="tw-flex-1 tw-relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI about Mixhers' hormone support..."
                  className="tw-w-full tw-pr-10 tw-pl-4 tw-py-3 tw-border tw-border-gray-200 tw-rounded-2xl focus:tw-outline-none focus:tw-border-gray-400 tw-transition-all tw-duration-500"
                />
                <button className="tw-absolute tw-right-4 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400 hover:tw-text-gray-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80943 14.7185 1.38777 15.78 1.38777C16.8415 1.38777 17.8594 1.80943 18.61 2.56C19.3606 3.31057 19.7822 4.32855 19.7822 5.39C19.7822 6.45145 19.3606 7.46943 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="tw-text-center tw-text-sm tw-text-gray-500 tw-mt-4">
              Powered by LAWMA.ai
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
    root.render(<Widget {...options} />);
  }
};

export default widgetExports;
