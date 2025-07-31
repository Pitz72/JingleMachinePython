// Mock implementations for Tauri API when running in development without backend

export const isTauriEnvironment = () => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

// Mock invoke function
const mockInvoke = async <T>(command: string, args?: any): Promise<T> => {
  console.log(`Mock invoke called: ${command}`, args);
  
  switch (command) {
    case 'load_profile_command':
      // Return empty array for first launch
      return [] as T;
    
    case 'play_audio_command':
    case 'stop_button_command':
    case 'stop_all_command':
    case 'clear_queue_command':
      // Return success for playback commands
      console.log(`Mock: ${command} executed successfully`);
      return { success: true } as T;
    
    default:
      console.warn(`Unhandled mock command: ${command}`);
      return {} as T;
  }
};

// Mock listen function
const mockListen = async <T>(event: string, handler: (event: { payload: T }) => void) => {
  console.log(`Mock listen registered for event: ${event}`);
  
  // Return a mock unlisten function
  return () => {
    console.log(`Mock unlisten called for event: ${event}`);
  };
};

// Safe invoke function that uses mock when Tauri is not available
export const safeInvoke = async <T>(command: string, args?: any): Promise<T> => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return invoke<T>(command, args);
    } catch (error) {
      console.warn('Tauri invoke failed, falling back to mock:', error);
      return mockInvoke<T>(command, args);
    }
  } else {
    return mockInvoke<T>(command, args);
  }
};

// Safe listen function that uses mock when Tauri is not available
export const safeListen = async <T>(event: string, handler: (event: { payload: T }) => void) => {
  if (isTauriEnvironment()) {
    try {
      const { listen } = await import('@tauri-apps/api/event');
      return listen<T>(event, handler);
    } catch (error) {
      console.warn('Tauri listen failed, falling back to mock:', error);
      return mockListen<T>(event, handler);
    }
  } else {
    return mockListen<T>(event, handler);
  }
};