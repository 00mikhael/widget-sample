import React from 'react';

interface TypingIndicatorProps {
  statusMessage?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusMessage = "Gathering your information"
}) => {
  return (
    <div className="tw-flex tw-items-center tw-bg-[rgb(224,232,232)] tw-border tw-border-[#486966] tw-rounded-xl tw-p-4 tw-mb-2">
      <div className="tw-grid tw-grid-cols-2 tw-gap-1 tw-mr-3 tw-transform tw-rotate-45 tw-shrink-0">
        <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-[#486966] tw-rounded-full tw-typing-dot-new"></div>
        <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-[#486966] tw-rounded-full tw-typing-dot-new"></div>
        <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-[#486966] tw-rounded-full tw-typing-dot-new"></div>
        <div className="tw-w-[0.3rem] tw-h-[0.3rem] tw-bg-[#486966] tw-rounded-full tw-typing-dot-new"></div>
      </div>
      <div className="tw-font-medium tw-text-gray-800">{statusMessage}</div>
    </div>
  );
};

export default TypingIndicator;
