import CryptoJS from 'crypto-js';

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
    } else{
        // Generate check value for normal scenario
        checkValue = CryptoJS.SHA512(
          `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${hash1}`
        )
          .toString(CryptoJS.enc.Hex)
          .toUpperCase();
      }

    return checkValue;
}