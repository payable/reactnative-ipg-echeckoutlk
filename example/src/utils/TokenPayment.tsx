// utils/authUtils.ts
import CryptoJS from 'crypto-js';

/**
 * Generate Auth Value for Auth API
 * @param merchantId - The merchant ID
 * @param merchantToken - The merchant token
 * @returns Base64 encoded auth value
 */
export const getAuthValueForAuthAPI = (merchantId: string, merchantToken: string): string => {
    const val = `${merchantId}:${merchantToken}`;
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(val));
};

/**
 * Generate Check Value for List Card API
 * @param merchantId - The merchant ID
 * @param customerId - The customer ID
 * @param merchantToken - The merchant token
 * @returns SHA-512 hashed check value
 */
export const getCheckValueForListCardAPI = (merchantId: string, customerId: string, merchantToken: string): string => {
    const mToken = CryptoJS.SHA512(merchantToken).toString().toUpperCase();
    const val = `${merchantId}|${customerId}|${mToken}`;
    return CryptoJS.SHA512(val).toString().toUpperCase();
};

/**
 * Generate Check Value for Token Payment API
 * @param merchantId - The merchant ID
 * @param invoiceId - The invoice ID
 * @param amount - The amount of the transaction
 * @param currencyCode - The currency code
 * @param customerId - The customer ID
 * @param tokenId - The token ID
 * @param merchantToken - The merchant token
 * @returns SHA-512 hashed check value
 */
export const getCheckValueForTokenPay = (
    merchantId: string,
    invoiceId: string,
    amount: string,
    currencyCode: string,
    customerId: string,
    tokenId: string,
    merchantToken: string
): string => {
    const mToken = CryptoJS.SHA512(merchantToken).toString().toUpperCase();
    const val = `${merchantId}|${invoiceId}|${amount}|${currencyCode}|${customerId}|${tokenId}|${mToken}`;
    return CryptoJS.SHA512(val).toString().toUpperCase();
};

/**
 * Generate Check Value for Add Card Payment API
 * @param merchantId - The merchant ID
 * @param customerId - The customer ID
 * @param merchantToken - The merchant token
 * @returns SHA-512 hashed check value
 */
export const getCheckValueForAddCardPay = (merchantId: string, customerId: string, merchantToken: string): string => {
    const mToken = CryptoJS.SHA512(merchantToken).toString().toUpperCase();
    const val = `${merchantId}|${customerId}|${mToken}`;
    return CryptoJS.SHA512(val).toString().toUpperCase();
};

/**
 * Generate Check Value for Delete Card Payment API
 * @param merchantId - The merchant ID
 * @param customerId - The customer ID
 * @param tokenId - The token ID to delete
 * @param merchantToken - The merchant token
 * @returns SHA-512 hashed check value
 */
export const getCheckValueForDeleteCard = (merchantId: string, customerId: string, tokenId: string, merchantToken: string): string => {
    const mToken = CryptoJS.SHA512(merchantToken).toString().toUpperCase();
    const val = `${merchantId}|${customerId}|${tokenId}|${mToken}`;
    return CryptoJS.SHA512(val).toString().toUpperCase();
};