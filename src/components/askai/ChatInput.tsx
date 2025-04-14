import React from 'react';

interface ChatInputProps {
    messageInput: string;
    setMessageInput: (value: string) => void;
    uploadedFileName: string;
    handleSendMessage: () => void;
    handleClearChat: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>; // Allow null
    sendDisabled: boolean;
    showClearButton: boolean;
    placeholder: string;
    showResults: boolean; // To adjust styling based on chat visibility
}

const ChatInput: React.FC<ChatInputProps> = ({
    messageInput,
    setMessageInput,
    uploadedFileName,
    handleSendMessage,
    handleClearChat,
    handleFileChange,
    handleRemoveFile,
    fileInputRef,
    sendDisabled,
    showClearButton,
    placeholder,
    showResults,
}) => {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline on Enter
            if (!sendDisabled) {
                handleSendMessage();
            }
        }
    };

    return (
        <div
            className={`tw-w-full tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-pb-8 tw-pt-4 tw-bg-white tw-transition-all tw-duration-500 tw-ease-out tw-transform tw-z-20 ${showResults
                ? 'md:tw-fixed md:tw-bottom-0 md:tw-left-0 md:tw-right-0 md:tw-pb-8 md:tw-pt-4 md:tw-bg-white md:tw-shadow-lg'
                : 'md:tw-static md:tw-pb-0 md:tw-pt-0 md:tw-bg-transparent md:tw-shadow-none'
                }`}
        >
            <div className="tw-max-w-3xl tw-mx-auto tw-px-4">
                <div className="tw-flex tw-w-full tw-flex-col tw-rounded-3xl tw-border tw-border-gray-200 tw-shadow tw-bg-white">
                    {/* Chat input area (top row) */}
                    <div className="tw-h-[80px] tw-p-3">
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="tw-w-full tw-h-full tw-min-h-[50px] tw-resize-none tw-bg-transparent tw-text-base focus:tw-outline-none tw-border-none tw-scrollbar-hide"
                        />
                    </div>

                    {/* File name display */}
                    {uploadedFileName && (
                        <div className="tw-px-3 tw-py-2 tw-text-sm tw-text-gray-600 tw-border-t tw-border-gray-100">
                            <span>{uploadedFileName}</span>
                        </div>
                    )}

                    {/* Action buttons row (bottom row) */}
                    <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-100 tw-px-3 tw-py-2">
                        {/* Left side: Upload and Delete/Clear buttons */}
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <input
                                type="file"
                                className="tw-hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title="Attach image"
                                className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-gray-600 hover:tw-bg-gray-100 hover:tw-scale-105 tw-transition-all tw-transform"
                            >
                                {/* Attach Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-5 tw-h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                </svg>
                            </button>
                            {showClearButton && (
                                <button
                                    onClick={uploadedFileName ? handleRemoveFile : handleClearChat}
                                    title={uploadedFileName ? 'Remove uploaded file' : 'Clear chat'}
                                    className="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-red-600 hover:tw-bg-red-50 hover:tw-scale-105 tw-transition-all tw-transform"
                                >
                                    {/* Trash Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-5 tw-h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Right side: Send button */}
                        <button
                            disabled={sendDisabled}
                            onClick={handleSendMessage}
                            title="Send message"
                            className={`tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-3xl tw-text-white tw-transition-all tw-transform ${sendDisabled
                                ? 'tw-bg-gray-400 tw-cursor-not-allowed' // Disabled style
                                : 'tw-bg-gray-800 hover:tw-bg-gray-900 hover:tw-scale-105' // Enabled style
                                }`}
                        >
                            {/* Send Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="tw-w-5 tw-h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="tw-text-center tw-text-gray-500 tw-text-sm tw-mt-3">
                    Powered by LAWMA.ai
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
