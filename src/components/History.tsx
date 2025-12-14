import { useState, useEffect } from 'react';
import type { Session } from '../types/session';
import { getSessions } from '../utils/storage';

interface HistoryProps {
  onStartNew: () => void;
}

export const History = ({ onStartNew }: HistoryProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const allSessions = getSessions()
      .filter(s => s.status === 'completed')
      .sort((a, b) => (b.endTime || b.startTime) - (a.endTime || a.startTime));
    setSessions(allSessions);
  }, []);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Session History</h1>
        <button onClick={onStartNew} className="new-session-button">
          Start New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>No completed sessions yet.</p>
          <p>Start your first focus session to see it here!</p>
        </div>
      ) : (
        <div className="history-content">
          <div className="sessions-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`session-card ${selectedSession?.id === session.id ? 'selected' : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="session-card-header">
                  <h3 className="session-task-preview">
                    {session.task.length > 50
                      ? `${session.task.substring(0, 50)}...`
                      : session.task}
                  </h3>
                  <span className={`status-badge ${session.reflection?.completed ? 'completed' : 'incomplete'}`}>
                    {session.reflection?.completed ? '✓ Completed' : '○ Incomplete'}
                  </span>
                </div>
                <div className="session-card-meta">
                  <span>{formatDate(session.endTime || session.startTime)}</span>
                  <span>{formatDuration(session.duration)}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedSession && (
            <div className="session-details">
              <button
                className="close-details"
                onClick={() => setSelectedSession(null)}
                aria-label="Close details"
              >
                ×
              </button>
              <h2>Session Details</h2>
              <div className="detail-section">
                <h3>Task</h3>
                <p>{selectedSession.task}</p>
              </div>
              <div className="detail-section">
                <h3>Completion Criteria</h3>
                <p>{selectedSession.completionCriteria}</p>
              </div>
              <div className="detail-section">
                <h3>Duration</h3>
                <p>{formatDuration(selectedSession.duration)}</p>
              </div>
              <div className="detail-section">
                <h3>Started</h3>
                <p>{formatDate(selectedSession.startTime)}</p>
              </div>
              {selectedSession.endTime && (
                <div className="detail-section">
                  <h3>Ended</h3>
                  <p>{formatDate(selectedSession.endTime)}</p>
                </div>
              )}
              {selectedSession.reflection && (
                <>
                  <div className="detail-section">
                    <h3>Completed</h3>
                    <p>{selectedSession.reflection.completed ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="detail-section">
                    <h3>Accomplishments</h3>
                    <p>{selectedSession.reflection.accomplishments}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

