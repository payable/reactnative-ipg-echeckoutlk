import * as Application from 'expo-application';
import CryptoJS from 'crypto-js';
import type { ReturnData } from '../models/ReturnData';

export const getCheckValue = (
  isSaveCard: string,
  merchantKey: string,
  merchantToken: string,
  invoiceId: string,
  amount: string,
  currencyCode: string,
  customerRefNo: string // Added customerRefNo as a parameter
): string => {
  // Step 1: Generate the first hash from the merchant token
  const hash1 = CryptoJS.SHA512(merchantToken)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  let checkValue;

  if (isSaveCard === '1') {
    // Generate check value for save card scenario
    checkValue = CryptoJS.SHA512(
      `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${customerRefNo}|${hash1}`
    )
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();
  } else {
    // Generate check value for normal scenario
    checkValue = CryptoJS.SHA512(
      `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${hash1}`
    )
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();
  }

  return checkValue;
};

export const getPackageName = async (): Promise<string> => {
  return Application.applicationId ?? '';
};

export const isErrorWithMessage = (
  error: any
): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

export const getReturnData = (url: string): ReturnData => {
  const parsedUrl = new URL(url);
  console.log('***parsedUrl', parsedUrl);
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
