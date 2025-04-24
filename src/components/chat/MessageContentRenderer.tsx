import React from 'react';
import { parseMessage } from './utils';

interface MessageContentRendererProps {
  contentType?: string;
  content: string;
  mediaUrl?: string;
  options?: string[];
  imageUrl?: string;
  onSendMessage: (message: string) => void;
  isStreaming?: boolean;
  isUser?: boolean;
  typedElementRef?: React.RefObject<HTMLSpanElement | null>;
}

const MessageContentRenderer: React.FC<MessageContentRendererProps> = ({
  contentType = 'text',
  content,
  mediaUrl,
  options,
  imageUrl,
  onSendMessage,
  isStreaming = false,
  isUser = false,
  typedElementRef
}) => {
  const handleOptionSelect = (option: string) => {
    onSendMessage(option);
  };

  // Render the appropriate content based on type
  switch (contentType) {
    case 'question':
      return <QuestionContent content={content} options={options} onSelect={handleOptionSelect} />;
    case 'image':
      return <ImageContent content={content} mediaUrl={mediaUrl} />;
    case 'video':
      return <VideoContent content={content} mediaUrl={mediaUrl} />;
    case 'document':
      return <DocumentContent content={content} mediaUrl={mediaUrl} />;
    case 'text_image':
      return <TextImageContent content={content} imageUrl={imageUrl} />;
    case 'text':
    default:
      return <TextContent
        content={content}
        isStreaming={isStreaming}
        isUser={isUser}
        typedElementRef={typedElementRef}
      />;
  }
};

interface TextContentProps {
  content: string;
  isStreaming?: boolean;
  isUser?: boolean;
  typedElementRef?: React.RefObject<HTMLSpanElement | null>;
}

const TextContent: React.FC<TextContentProps> = ({ content, isStreaming, isUser, typedElementRef }) => {
  if (!isUser && isStreaming && typedElementRef) {
    return <span ref={typedElementRef} />;
  }
  return <div dangerouslySetInnerHTML={{ __html: parseMessage(content) }}></div>;
};

interface QuestionContentProps {
  content: string;
  options?: string[];
  onSelect: (option: string) => void;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ content, options, onSelect }) => {
  if (!options?.length) return <TextContent content={content} />;

  return (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-bg-[#e0e8e8] tw-rounded-2xl tw-p-4">
      <div className="tw-font-medium tw-text-gray-900" dangerouslySetInnerHTML={{ __html: parseMessage(content) }}></div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className="tw-w-full tw-text-center tw-py-3 tw-px-4 tw-bg-white tw-rounded-full tw-shadow-sm hover:tw-shadow-md tw-transition-shadow"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

interface MediaContentProps {
  content: string;
  mediaUrl?: string;
}

const ImageContent: React.FC<MediaContentProps> = ({ content, mediaUrl }) => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      {/* Caption text */}
      {content && (
        <div
          className="tw-text-gray-800 tw-font-medium"
          dangerouslySetInnerHTML={{ __html: parseMessage(content) }}
        />
      )}

      {/* Image with shadow and rounded corners */}
      {mediaUrl && (
        <div className="tw-rounded-lg tw-overflow-hidden tw-shadow-lg">
          <img
            src={mediaUrl}
            alt="Image"
            className="tw-w-full tw-h-auto tw-rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

const VideoContent: React.FC<MediaContentProps> = ({ content, mediaUrl }) => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      {/* Caption text */}
      {content && (
        <div
          className="tw-text-gray-800 tw-font-medium"
          dangerouslySetInnerHTML={{ __html: parseMessage(content) }}
        />
      )}

      {/* Video with native controls */}
      {mediaUrl && (
        <div className="tw-rounded-lg tw-overflow-hidden tw-shadow-lg">
          <video
            controls
            preload="metadata"
            className="tw-w-full tw-h-auto tw-rounded-lg"
            controlsList="nodownload"
            playsInline
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

const DocumentContent: React.FC<MediaContentProps> = ({ content, mediaUrl }) => {
  if (!mediaUrl) return <TextContent content={content} />;

  // Extract filename from URL or use generic name
  const fileName = mediaUrl.split('/').pop() || "Document";

  // We'll assume fileSize isn't available through the mediaUrl alone
  // In a real implementation, this could come from metadata
  const fileSize = "200 KB";

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      {/* Caption text */}
      {content && (
        <div
          className="tw-text-gray-800"
          dangerouslySetInnerHTML={{ __html: parseMessage(content) }}
        />
      )}

      {/* Document preview card */}
      <div className="tw-flex tw-flex-col tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-bg-gray-100 tw-shadow-sm">
        {/* Preview area (gray background with centered view button) */}
        <div className="tw-relative tw-bg-gray-200 tw-h-[200px] tw-flex tw-items-center tw-justify-center">
          {/* Document preview (could be replaced with actual thumbnail if available) */}
          <div className="tw-absolute tw-inset-0 tw-opacity-50">
            {/* This would ideally be a real document thumbnail */}
            <div className="tw-h-full tw-w-full tw-bg-gray-300"></div>
          </div>

          {/* View button */}
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tw-z-10 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-text-gray-600 hover:tw-text-gray-800"
          >
            <div className="tw-bg-white tw-p-2 tw-rounded-full tw-shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-8 tw-h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <span className="tw-text-lg tw-font-medium">View</span>
          </a>
        </div>

        {/* Document info footer */}
        <div className="tw-p-3 tw-bg-white tw-flex tw-items-start tw-gap-3">
          <div className="tw-text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="tw-w-6 tw-h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="tw-flex tw-flex-col tw-flex-1">
            <div className="tw-font-medium tw-text-gray-800 tw-truncate">{fileName}</div>
            <div className="tw-text-sm tw-text-gray-500">{fileSize}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TextImageContentProps {
  content: string;
  imageUrl?: string;
}

const TextImageContent: React.FC<TextImageContentProps> = ({ content, imageUrl }) => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      {content && <div dangerouslySetInnerHTML={{ __html: parseMessage(content) }}></div>}
      {imageUrl && (
        <div className="tw-max-w-[150px] tw-rounded-lg tw-overflow-hidden tw-relative">
          <img src={imageUrl} alt="Attached" className="tw-w-full tw-h-auto tw-rounded-lg" loading="lazy" />
        </div>
      )}
    </div>
  );
};

export default MessageContentRenderer;
