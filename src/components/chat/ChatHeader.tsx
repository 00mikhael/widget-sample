import React from 'react';
import { AiOutlineDelete as Delete } from "react-icons/ai";

interface ChatHeaderProps {
  onClose: () => void;
  onClearChat: (event: React.MouseEvent) => void;
  primaryColor?: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  name: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  onClearChat,
  isFullscreen,
  onToggleFullscreen,
  name
}) => {

  return (
    <div className="tw-flex tw-items-center tw-justify-between primary-bg tw-p-4 tw-text-white tw-shadow-md tw-relative tw-z-10 tw-transition-shadow tw-duration-200">
      <h3 id="chat-widget-title" className="tw-font-semibold">{name}</h3>
      <div className="tw-flex tw-gap-2">
        {/* Clear Chat Button */}
        <button
          onClick={onClearChat}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl hover:tw-scale-110 hover:primary-darken tw-transition-all tw-duration-200 tw-transform active:tw-scale-95"
          aria-label="Clear chat history"
        >
          <Delete size={20} className="tw-text-red-500" />
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={onToggleFullscreen}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-gray-300 hover:primary-darken hover:tw-scale-110 tw-transition-all tw-duration-200 tw-transform active:tw-scale-95"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="tw-w-5 tw-h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M15 9V4.5M15 9H19.5M9 15v4.5M9 15H4.5M15 15v4.5M15 15H19.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="tw-w-5 tw-h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-gray-300 hover:primary-darken hover:tw-scale-110 tw-transition-all tw-duration-200 tw-transform active:tw-scale-95"
          aria-label="Close chat widget"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-5 tw-h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
