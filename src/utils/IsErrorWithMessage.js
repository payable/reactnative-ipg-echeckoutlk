export const isErrorWithMessage = (error) => {
  return typeof error === 'object' && error !== null && 'message' in error;
};
