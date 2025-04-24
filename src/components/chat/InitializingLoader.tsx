import React from 'react';

const InitializingLoader: React.FC = () => {
  return (
    <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center">
      <div className="tw-p-4 tw-rounded-lg">
        <div className="tw-flex tw-items-center tw-gap-1">
          <div className="tw-flex tw-flex-row tw-gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400 animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitializingLoader;
