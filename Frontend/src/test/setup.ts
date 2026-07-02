// frontend/src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clear out the virtual DOM tree between individual evaluation runs to prevent leaks
afterEach(() => {
  cleanup();
});