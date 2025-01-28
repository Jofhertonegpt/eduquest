import { AppError, handleError, validateJSON } from '../errorHandling';
import { toast } from '@/hooks/use-toast';

jest.mock('@/hooks/use-toast');

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('AppError creates custom error with metadata', () => {
    const error = new AppError('Test error', 'TEST_ERROR', { foo: 'bar' });
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.metadata).toEqual({ foo: 'bar' });
  });

  test('handleError shows toast for AppError', () => {
    const error = new AppError('Test error', 'TEST_ERROR');
    handleError(error);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Error: TEST_ERROR',
      description: 'Test error'
    }));
  });

  test('validateJSON returns true for valid JSON', () => {
    expect(validateJSON('{"foo": "bar"}')).toBe(true);
    expect(validateJSON('invalid json')).toBe(false);
  });
});
