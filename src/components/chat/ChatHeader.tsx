import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  onClearChat: (event: React.MouseEvent) => void;
  // onNavigateToAskAi?: () => void; // Or handle navigation directly here
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onClearChat }) => {

  const handleNavigateToAskAi = () => {
    // Close the widget *before* navigating
    onClose();
    // Navigate to the full Ask AI page
    // navigate('/askai');
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-bg-gray-800 tw-p-4 tw-text-white">
      <h3 id="chat-widget-title" className="tw-font-semibold">Mixhers AI Assistant</h3>
      <div className="tw-flex tw-gap-2">
        {/* Clear Chat Button */}
        <button
          onClick={onClearChat}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-red-600 hover:tw-bg-red-50 hover:tw-scale-105 tw-transition-all tw-transform"
          aria-label="Clear chat history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-5 tw-h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>

        {/* Navigate to Ask AI Button */}
        <button
          onClick={handleNavigateToAskAi}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-gray-300 hover:tw-bg-gray-700 hover:tw-scale-105 tw-transition-all tw-transform"
          aria-label="Open full Ask AI page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="tw-w-5 tw-h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-gray-300 hover:tw-bg-gray-700 hover:tw-scale-105 tw-transition-all tw-transform"
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
