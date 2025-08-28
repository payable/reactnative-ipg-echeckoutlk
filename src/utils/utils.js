import * as Application from 'expo-application';
import CryptoJS from 'crypto-js';
export const getCheckValue = (
  merchantKey,
  merchantToken,
  invoiceId,
  amount,
  currencyCode
) => {
  const hash1 = CryptoJS.SHA512(merchantToken)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();
  const hash2 = CryptoJS.SHA512(
    `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${hash1}`
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();
  return hash2;
};
export const getPackageName = async () => {
  return Application.applicationId ?? 'app.pay.com';
};
export const isErrorWithMessage = (error) => {
  return typeof error === 'object' && error !== null && 'message' in error;
};
export const getReturnData = (url) => {
  const parsedUrl = new URL(url);
  const uid = parsedUrl.searchParams.get('uid') || '';
  const statusIndicator = parsedUrl.searchParams.get('statusIndicator') || '';
  const paymentPage = parsedUrl.searchParams.get('paymentPage') || '';
  return {
    status: 'PENDING',
    uid,
    statusIndicator,
    paymentPage,
  };
};
