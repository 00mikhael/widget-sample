import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="tw-flex tw-items-center tw-space-x-1 tw-h-6 tw-pl-4">
      <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-gray-500 tw-rounded-full typing-dot"></div>
      <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-gray-500 tw-rounded-full typing-dot"></div>
      <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-gray-500 tw-rounded-full typing-dot"></div>
    </div>
  );
};

export default TypingIndicator;
