import { vi } from 'vitest';

export const mockHash = vi.fn();
export const mockCompare = vi.fn();

export default {
  hash: mockHash,
  compare: mockCompare,
};
