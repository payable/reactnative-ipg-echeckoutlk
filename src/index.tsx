export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

// Export the default component (assuming PayableIPG is the default export from PayableIPG.ts file)
import PayableIPG from './PayableIPG';
export default PayableIPG;

// Export types from models
export type { PAYableIPGClient } from './models/PAYableIPGClient';
export type { PaymentRequest } from './models/PaymentRequest';
export type { PaymentData } from './models/PaymentData';
export type { ReturnData } from './models/ReturnData';
export { getEndpoint } from './utils/environment';
