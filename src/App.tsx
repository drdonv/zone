import { useState } from "react";
import type { Session } from "./types/session";
import { getActiveSession, getSessions, saveSession } from "./utils/storage";
import { ContractForm } from "./components/ContractForm";
import { FocusMode } from "./components/FocusMode";
import { ReflectionForm } from "./components/ReflectionForm";
import { History } from "./components/History";
import "./App.css";

type ViewState = "contract" | "focus" | "reflection" | "history";

function App() {
  // Initialize state based on localStorage
  const initializeState = (): {
    viewState: ViewState;
    session: Session | null;
  } => {
    const activeSession = getActiveSession();
    if (activeSession) {
      return { viewState: "focus", session: activeSession };
    }
    const sessions = getSessions();
    if (sessions.length > 0) {
      return { viewState: "history", session: null };
    }
    return { viewState: "contract", session: null };
  };

  const initialState = initializeState();
  const [viewState, setViewState] = useState<ViewState>(initialState.viewState);
  const [currentSession, setCurrentSession] = useState<Session | null>(
    initialState.session
  );

  const handleStartSession = (session: Session) => {
    setCurrentSession(session);
    setViewState("focus");
  };

  const handleFocusComplete = () => {
    if (currentSession) {
      setViewState("reflection");
    }
  };

  const handleFocusStop = () => {
    // Clear the active session and return to contract view
    if (currentSession) {
      // Update session status to pending (effectively removing it as active)
      const updatedSession: Session = {
        ...currentSession,
        status: "pending",
      };
      saveSession(updatedSession);
    }
    setCurrentSession(null);
    setViewState("contract");
  };

  const handleReflectionComplete = () => {
    setCurrentSession(null);
    setViewState("history");
  };

  const handleStartNew = () => {
    setCurrentSession(null);
    setViewState("contract");
  };

  return (
    <div className="app">
      {viewState === "contract" && (
        <ContractForm onStartSession={handleStartSession} />
      )}
      {viewState === "focus" && currentSession && (
        <FocusMode
          session={currentSession}
          onComplete={handleFocusComplete}
          onStop={handleFocusStop}
        />
      )}
      {viewState === "reflection" && currentSession && (
        <ReflectionForm
          session={currentSession}
          onComplete={handleReflectionComplete}
        />
      )}
      {viewState === "history" && <History onStartNew={handleStartNew} />}
    </div>
  );
}

export default App;
