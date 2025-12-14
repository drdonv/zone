import type { Session } from '../types/session';

const STORAGE_KEY = 'focus_sessions';

export const saveSession = (session: Session): void => {
  try {
    const sessions = getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const getSessions = (): Session[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Session[];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
};

export const getActiveSession = (): Session | null => {
  try {
    const sessions = getSessions();
    return sessions.find(s => s.status === 'active') || null;
  } catch (error) {
    console.error('Failed to get active session:', error);
    return null;
  }
};

