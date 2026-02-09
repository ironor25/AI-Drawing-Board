import React, { useState } from 'react';

/**
 * LiveButton.tsx
 * "Go Live" button for sharing canvas session
 */

interface LiveButtonProps {
  onLiveStart?: () => void;
  onLiveStop?: () => void;
}

export const LiveButton: React.FC<LiveButtonProps> = ({ onLiveStart, onLiveStop }) => {
  const [isLive, setIsLive] = useState(false);

  const handleClick = () => {
    if (isLive) {
      onLiveStop?.();
      setIsLive(false);
    } else {
      onLiveStart?.();
      setIsLive(true);
    }
  };

  return (
    <button
      className={`live-button ${isLive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {isLive ? '🔴 Stop Live' : '⚪ Go Live'}
    </button>
  );
};
