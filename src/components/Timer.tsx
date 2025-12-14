import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  initialSeconds: number;
  onComplete: () => void;
}

export const Timer = ({ initialSeconds, onComplete }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onCompleteRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="timer">
      {hours > 0 ? (
        <span className="timer-display">
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </span>
      ) : (
        <span className="timer-display">
          {formatTime(minutes)}:{formatTime(seconds)}
        </span>
      )}
    </div>
  );
};

