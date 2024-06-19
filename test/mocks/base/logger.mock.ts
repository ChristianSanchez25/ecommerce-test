import { ILogger } from '../../../src/common';

export function createMockLogger(): ILogger {
  return {
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    verbose: jest.fn(),
  };
}
