import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Session, Reflection } from '../types/session';
import { saveSession } from '../utils/storage';

interface ReflectionFormProps {
  session: Session;
  onComplete: () => void;
}

export const ReflectionForm = ({ session, onComplete }: ReflectionFormProps) => {
  const [completed, setCompleted] = useState(false);
  const [accomplishments, setAccomplishments] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!accomplishments.trim()) {
      return;
    }

    const reflection: Reflection = {
      completed,
      accomplishments: accomplishments.trim(),
    };

    const updatedSession: Session = {
      ...session,
      endTime: Date.now(),
      status: 'completed',
      reflection,
    };

    saveSession(updatedSession);
    onComplete();
  };

  return (
    <div className="reflection-form-container">
      <h1>Session Reflection</h1>
      <p className="subtitle">How did your focus session go?</p>

      <form onSubmit={handleSubmit} className="reflection-form">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>I completed my task</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="accomplishments">What did you accomplish?</label>
          <textarea
            id="accomplishments"
            value={accomplishments}
            onChange={(e) => setAccomplishments(e.target.value)}
            placeholder="Describe what you achieved during this session..."
            rows={6}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Complete Reflection
        </button>
      </form>
    </div>
  );
};

