
// Fix for: Cannot find type definition file for 'vite/client'
// Replacing the reference with explicit process declaration

declare const process: {
  env: {
    [key: string]: string | undefined;
    API_KEY?: string;
  }
};
