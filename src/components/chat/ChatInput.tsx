import React, { useState, useRef, useCallback } from 'react';
import { MdAttachFile } from "react-icons/md";

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
    <div className="tw-border-t tw-border-gray-100 tw-bg-white tw-p-4 tw-sticky tw-bottom-0">
      <div className="tw-flex tw-flex-col tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white">
        <textarea
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={randomPromoPlaceholder}
          className="tw-w-full tw-p-3 tw-text-gray-800 tw-placeholder-gray-400 tw-bg-transparent tw-border-none tw-resize-none focus:tw-ring-0 focus:tw-outline-none"
          rows={3}
          aria-label="Chat message input"
        />

        {/* File name display */}
        {uploadedFileName && (
          <div className="tw-px-3 tw-py-2 tw-text-sm tw-text-gray-600 tw-border-t tw-border-gray-100 tw-flex tw-justify-between tw-items-center">
            <span className="tw-truncate" title={uploadedFileName}>{uploadedFileName}</span>
            <button
              onClick={handleRemoveFileClick}
              className="tw-text-red-500 hover:tw-text-red-700 tw-ml-2 tw-flex-shrink-0"
              aria-label="Remove attached file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-4 tw-h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-100 tw-p-2">
          {/* Left side actions */}
          <div className="tw-flex tw-items-center tw-gap-2">
            <input
              type="file"
              className="tw-hidden"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={handleAttachClick}
              className="tw-p-2 tw-text-gray-500 hover:tw-text-gray-600 tw-transition-colors"
              aria-label="Attach image file"
            >
              <MdAttachFile className='tw-transform tw-rotate-45' size={20} />
            </button>

            {/* Error message */}
            {error && (
              <div className="tw-text-xs tw-text-red-500">{error}</div>
            )}
          </div>

          {/* Send button - Show only if there's text or a file */}
          {canSend && (
            <button
              onClick={handleSend}
              className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-lg tw-bg-gray-800 tw-text-white hover:tw-bg-gray-700 tw-transition-colors disabled:tw-opacity-50"
              aria-label="Send message"
            // disabled={!canSend} // Button is conditionally rendered instead
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="tw-w-4 tw-h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="tw-text-center tw-text-gray-500 tw-text-sm tw-mt-3">
        Powered by LAWMA.ai {/* Or Mixhers AI? Update as needed */}
      </div>
    </div>
  );
};

export default ChatInput;
