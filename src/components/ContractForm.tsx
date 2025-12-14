import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '../types/session';
import { saveSession } from '../utils/storage';

interface ContractFormProps {
  onStartSession: (session: Session) => void;
}

export const ContractForm = ({ onStartSession }: ContractFormProps) => {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState('');
  const [completionCriteria, setCompletionCriteria] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const durationNum = parseInt(duration, 10);
    if (!task.trim() || !durationNum || durationNum <= 0 || !completionCriteria.trim()) {
      return;
    }

    const session: Session = {
      id: crypto.randomUUID(),
      task: task.trim(),
      duration: durationNum,
      completionCriteria: completionCriteria.trim(),
      startTime: Date.now(),
      status: 'active',
    };

    saveSession(session);
    onStartSession(session);
  };

  return (
    <div className="contract-form-container">
      <h1>Focus Contract</h1>
      <p className="subtitle">Define your task and commit to deep work</p>
      
      <form onSubmit={handleSubmit} className="contract-form">
        <div className="form-group">
          <label htmlFor="task">What will you work on?</label>
          <textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe your task..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 25"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="criteria">Completion Criteria</label>
          <textarea
            id="criteria"
            value={completionCriteria}
            onChange={(e) => setCompletionCriteria(e.target.value)}
            placeholder="How will you know you're done?"
            rows={3}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Start Focus Session
        </button>
      </form>
    </div>
  );
};

