import React from 'react';

type ButtonPosition = 'top-right' | 'center-right' | 'bottom-right' | 'top-left' | 'center-left' | 'bottom-left';

interface ChatToggleButtonProps {
  onClick: () => void;
  position?: ButtonPosition;
  primaryColor?: string;
}

const getPositionClasses = (position: ButtonPosition) => {
  const positions = {
    'top-right': 'tw-top-4 tw-right-0 tw-rounded-l-3xl',
    'center-right': 'tw-top-1/2 tw-right-0 tw-rounded-l-3xl',
    'bottom-right': 'tw-bottom-4 tw-right-0 tw-rounded-l-3xl',
    'top-left': 'tw-top-4 tw-left-0 tw-rounded-r-3xl',
    'center-left': 'tw-top-1/2 tw-left-0 tw-rounded-r-3xl',
    'bottom-left': 'tw-bottom-4 tw-left-0 tw-rounded-r-3xl'
  };
  return positions[position];
};

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick, position = 'center-right' }) => {
  const isLeftPosition = position.endsWith('-left');
  const positionClasses = getPositionClasses(position);

  return (
    <button
      onClick={onClick}
      className={`tw-fixed tw-z-[9999] tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-3 tw-text-white tw-shadow-lg tw-transition-all tw-duration-200 primary-bg hover:primary-darken ${positionClasses} ${isLeftPosition ? 'tw-flex-row-reverse hover:tw-pl-6' : 'hover:tw-pr-6'}`}
      aria-label="Open AI chat assistant"
    >
      {/* SVG Icon */}
      <svg fill="#fff" className="tw-h-6 tw-w-6" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M300 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
      </svg>
      {/* Text */}
      <span className="tw-transition-all tw-duration-200">Ask AI</span>
    </button>
  );
};

export default ChatToggleButton;
