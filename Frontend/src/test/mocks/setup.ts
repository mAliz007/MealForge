// frontend/src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
// @ts-ignore - Let Vitest handle the relative module resolution at runtime
import { server } from './mocks/server';

// Establish network interception hooks before all test cycles start
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  // Clear any structural request overrides dynamically declared during separate testing iterations
  server.resetHandlers();
});

// Nuke clean up operations once the file parsing thread completely closes down
afterAll(() => server.close());