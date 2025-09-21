import { useState, useCallback } from 'react';

export const useHistory = <T,>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    const newState = typeof action === 'function' 
        ? (action as (prevState: T) => T)(state) 
        : action;

    if (JSON.stringify(newState) === JSON.stringify(state)) {
        return; // Don't push identical states
    }

    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index, state]);

  const setInitialState = useCallback((newState: T) => {
    setHistory([newState]);
    setIndex(0);
  }, []);

  const undo = useCallback(() => {
    if (canUndo) {
      setIndex(prevIndex => prevIndex - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setIndex(prevIndex => prevIndex + 1);
    }
  }, [canRedo]);

  return { state, setState, setInitialState, undo, redo, canUndo, canRedo };
};
