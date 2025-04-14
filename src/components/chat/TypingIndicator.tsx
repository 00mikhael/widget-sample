import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="tw-flex tw-items-center tw-space-x-2 tw-h-8 tw-pl-4">
      <div className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full typing-dot"></div>
      <div className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full typing-dot"></div>
      <div className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full typing-dot"></div>
    </div>
  );
};

export default TypingIndicator;
