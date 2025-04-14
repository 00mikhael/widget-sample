import React, { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  error: string;
  uploadedFileName?: string;
  onSendMessage: (messageText: string) => void;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  error,
  uploadedFileName,
  onSendMessage,
  onFileUpload,
  onRemoveFile,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(event.target.value);
  };

  const handleSend = useCallback(() => {
    // Check if there's text input OR an uploaded file to send
    if (messageInput.trim() || uploadedFileName) {
      onSendMessage(messageInput);
      setMessageInput(''); // Clear input after sending
      // Note: File removal is handled by the parent (ChatWidget) after successful send
    }
  }, [messageInput, onSendMessage, uploadedFileName]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter key press, unless Shift is also pressed
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (new line)
      handleSend();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset file input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFileClick = () => {
      onRemoveFile();
      // Also reset the file input ref's value
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const canSend = messageInput.trim().length > 0 || !!uploadedFileName;

  // Placeholder logic from Laravel example
  const promotionalMessages = [
    "Did you know Hertime PMS is eligible for HSA reimbursement?",
    "Subscribe for 15% off plus a FREE Starter Kit!",
    "Hertime PMS is available in 7 delicious flavors.",
    "Ask AI about Mixhers' hormone support..."
  ];
  // Select a random placeholder - consider moving this logic up if needed globally
  const randomPromoPlaceholder = promotionalMessages[Math.floor(Math.random() * promotionalMessages.length)];


  return (
    <div className="border-t border-gray-100 bg-white p-4 sticky bottom-0">
      <div className="flex flex-col rounded-xl border border-gray-200 bg-white">
        <textarea
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={randomPromoPlaceholder}
          className="w-full p-3 text-gray-800 placeholder-gray-400 bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
          rows={3}
          aria-label="Chat message input"
        />

        {/* File name display */}
        {uploadedFileName && (
          <div className="px-3 py-2 text-sm text-gray-600 border-t border-gray-100 flex justify-between items-center">
            <span className="truncate" title={uploadedFileName}>{uploadedFileName}</span>
            <button
              onClick={handleRemoveFileClick}
              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
              aria-label="Remove attached file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 p-2">
          {/* Left side actions */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={handleAttachClick}
              className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
              aria-label="Attach image file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </button>

            {/* Error message */}
            {error && (
              <div className="text-xs text-red-500">{error}</div>
            )}
          </div>

          {/* Send button - Show only if there's text or a file */}
          {canSend && (
            <button
              onClick={handleSend}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Send message"
              // disabled={!canSend} // Button is conditionally rendered instead
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-3">
        Powered by LAWMA.ai {/* Or Mixhers AI? Update as needed */}
      </div>
    </div>
  );
};

export default ChatInput;
