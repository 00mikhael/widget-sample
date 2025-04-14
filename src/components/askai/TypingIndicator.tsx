import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="tw-flex tw-flex-col tw-items-start">
            <div className="tw-rounded-lg">
                <div className="tw-flex tw-items-center tw-space-x-1 tw-px-2 tw-py-1">
                    <div
                        className="tw-h-2 tw-w-2 tw-animate-bounce tw-rounded-full tw-bg-gray-400"
                        style={{ animationDelay: '0ms' }}
                    />
                    <div
                        className="tw-h-2 tw-w-2 tw-animate-bounce tw-rounded-full tw-bg-gray-400"
                        style={{ animationDelay: '200ms' }}
                    />
                    <div
                        className="tw-h-2 tw-w-2 tw-animate-bounce tw-rounded-full tw-bg-gray-400"
                        style={{ animationDelay: '400ms' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
