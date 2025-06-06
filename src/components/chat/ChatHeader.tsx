import React from 'react';
import { useInternetStatus } from '../../hooks/useInternetStatus';
import { AiOutlineDelete as Delete } from "react-icons/ai";

const MAX_NAME_LENGTH = 25
interface ChatHeaderProps {
  onClose: () => void;
  onClearChat: (event: React.MouseEvent) => void;
  primaryColor?: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  name: string;
  logo_url?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  onClearChat,
  isFullscreen,
  onToggleFullscreen,
  name,
  logo_url
}) => {
  const isOnline = useInternetStatus();

  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-bg-gradient-to-r tw-from-[var(--chat-primary-color)] tw-to-[var(--chat-primary-darker)] tw-p-4 tw-text-white tw-shadow-md tw-relative tw-z-10">
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center">
          {/* <div
            className={`tw-w-2 tw-h-2 tw-rounded-full ${isOnline ? 'tw-bg-green-400' : 'tw-bg-red-500'
              } tw-animate-pulse tw-mr-2`}
            title={isOnline ? 'Online' : 'Offline'}
          ></div> */}
          {logo_url && (
            <div className='tw-w-8 tw-h-8 tw-rounded-full tw-overflow-hidden tw-shrink-0 tw-mr-2'>
              <img
                src={logo_url}
                className='tw-w-8 tw-h-8 tw-rounded-full tw-object-cover tw-shrink-0'
                alt="logo"
              />
            </div>
          )}
          <h3 id="chat-widget-title" className="tw-font-semibold tw-text-sm">{name?.length > MAX_NAME_LENGTH ? name.slice(0, MAX_NAME_LENGTH) + '...' : name}</h3>
        </div>
      </div>
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
