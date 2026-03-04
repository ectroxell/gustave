/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
