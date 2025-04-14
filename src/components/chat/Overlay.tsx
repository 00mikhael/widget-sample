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
      className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300 ease-out"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

export default Overlay;
