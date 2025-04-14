import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex flex-col items-start">
            <div className="rounded-lg">
                <div className="flex items-center space-x-1 px-2 py-1">
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0ms' }}
                    />
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '200ms' }}
                    />
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '400ms' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
