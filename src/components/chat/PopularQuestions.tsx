import React from 'react';

interface PopularQuestionsProps {
  questions: string[];
  handleSendMessage: (messageText: string) => Promise<void>;
  title?: string;
  variant?: 'primary' | 'follow-up';
}

const PopularQuestions: React.FC<PopularQuestionsProps> = ({
  questions,
  handleSendMessage,
  title = "Popular Questions",
  variant = 'primary'
}) => {
  const isFollowUp = variant === 'follow-up';

  return (
    <div className={`
      tw-mt-4 tw-space-y-2 tw-divide-y tw-divide-gray-100
      ${isFollowUp ? 'tw-mt-2' : ''}
    `}>
      <div className='tw-flex tw-items-center tw-gap-2'>
        <img
          width={20}
          height={20}
          src={isFollowUp ? '/public/arrow-follow-up.svg' : '/public/suggestions.svg'}
          alt=''
        />
        <div className={`
          tw-w-full tw-text-gray-900
          ${isFollowUp ? 'tw-text-base' : 'tw-text-lg'}
        `}>{title}</div>
      </div>
      <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-3 tw-pt-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(question)}
            className={`
              tw-px-4 tw-py-2 tw-bg-[#F7F9FB] tw-text-[#5D636E] tw-rounded-md
              tw-text-xs tw-w-full tw-max-w-[21.5rem] tw-text-left
              tw-flex tw-justify-between tw-items-center tw-gap-4
              ${isFollowUp ? 'tw-bg-white tw-border tw-border-gray-100' : ''}
            `}
          >
            <span>{question}</span>
            <img
              width={20}
              height={20}
              src={'/public/arrow.svg'}
              alt=''
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularQuestions;
