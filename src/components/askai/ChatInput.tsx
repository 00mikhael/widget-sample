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
            className={`w-full fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-white transition-all duration-500 ease-out transform z-20 ${
                showResults
                    ? 'md:fixed md:bottom-0 md:left-0 md:right-0 md:pb-8 md:pt-4 md:bg-white md:shadow-lg'
                    : 'md:static md:pb-0 md:pt-0 md:bg-transparent md:shadow-none'
            }`}
        >
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex w-full flex-col rounded-3xl border border-gray-200 shadow bg-white">
                    {/* Chat input area (top row) */}
                    <div className="h-[80px] p-3">
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full h-full min-h-[50px] resize-none bg-transparent text-base focus:outline-none border-none scrollbar-hide"
                        />
                    </div>

                    {/* File name display */}
                    {uploadedFileName && (
                        <div className="px-3 py-2 text-sm text-gray-600 border-t border-gray-100">
                            <span>{uploadedFileName}</span>
                        </div>
                    )}

                    {/* Action buttons row (bottom row) */}
                    <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
                        {/* Left side: Upload and Delete/Clear buttons */}
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title="Attach image"
                                className="flex items-center justify-center w-9 h-9 rounded-3xl text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all transform"
                            >
                                {/* Attach Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                </svg>
                            </button>
                            {showClearButton && (
                                <button
                                    onClick={uploadedFileName ? handleRemoveFile : handleClearChat}
                                    title={uploadedFileName ? 'Remove uploaded file' : 'Clear chat'}
                                    className="flex items-center justify-center w-9 h-9 rounded-3xl text-red-600 hover:bg-red-50 hover:scale-105 transition-all transform"
                                >
                                    {/* Trash Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
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
                            className={`flex items-center justify-center w-9 h-9 rounded-3xl text-white transition-all transform ${
                                sendDisabled
                                    ? 'bg-gray-400 cursor-not-allowed' // Disabled style
                                    : 'bg-gray-800 hover:bg-gray-900 hover:scale-105' // Enabled style
                            }`}
                        >
                            {/* Send Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-sm mt-3">
                    Powered by LAWMA.ai
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
