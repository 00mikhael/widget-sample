import React from 'react';

interface OverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClick }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-[9998] tw-transition-opacity tw-duration-300 tw-ease-out"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

export default Overlay;
