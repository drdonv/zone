import { useEffect, useCallback, useState } from 'react';
import type { Session } from '../types/session';
import { Timer } from './Timer';

interface FocusModeProps {
  session: Session;
  onComplete: () => void;
  onStop: () => void;
}

export const FocusMode = ({ session, onComplete, onStop }: FocusModeProps) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Calculate remaining time based on elapsed time since session started
  const calculateRemainingSeconds = (): number => {
    const totalSeconds = session.duration * 60;
    const elapsedMs = Date.now() - session.startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);
    return remaining;
  };

  const [remainingSeconds] = useState(() => calculateRemainingSeconds());

  useEffect(() => {
    // If time has already elapsed, trigger completion immediately
    if (remainingSeconds <= 0) {
      onComplete();
    }
  }, [remainingSeconds, onComplete]);

  const handleTimerComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="focus-mode">
      <div className="focus-content">
        <div className="focus-task">
          <h2>Current Task</h2>
          <p className="task-text">{session.task}</p>
        </div>

        <div className="focus-timer">
          <Timer initialSeconds={remainingSeconds} onComplete={handleTimerComplete} />
        </div>

        <div className="focus-criteria">
          <h3>Completion Criteria</h3>
          <p className="criteria-text">{session.completionCriteria}</p>
        </div>
      </div>
      <button className="stop-button" onClick={onStop} aria-label="Stop session">
        Stop
      </button>
    </div>
  );
};

