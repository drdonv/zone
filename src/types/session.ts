export type SessionStatus = 'pending' | 'active' | 'completed';

export interface Reflection {
  completed: boolean;
  accomplishments: string;
}

export interface Session {
  id: string;
  task: string;
  duration: number; // in minutes
  completionCriteria: string;
  startTime: number; // timestamp
  endTime?: number; // timestamp
  status: SessionStatus;
  reflection?: Reflection;
}

