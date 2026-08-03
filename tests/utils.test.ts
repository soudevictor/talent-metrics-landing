import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn helper', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500', { 'text-white': true, 'hidden': false });
    expect(result).toBe('px-2 py-1 bg-red-500 text-white');
  });

  it('should resolve tailwind conflicts', () => {
    const result = cn('px-2 px-4', 'bg-red-500 bg-blue-500');
    expect(result).toBe('px-4 bg-blue-500');
  });
});
