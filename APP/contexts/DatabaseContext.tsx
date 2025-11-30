import React, { createContext, useContext, ReactNode } from 'react';
import { IAudioDatabase, AudioDB } from '../db';

const DatabaseContext = createContext<IAudioDatabase | null>(null);

export const useDatabase = (): IAudioDatabase => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
  database?: IAudioDatabase;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
  database = new AudioDB()
}) => {
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};