export const isErrorWithMessage = (
  error: any
): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};
