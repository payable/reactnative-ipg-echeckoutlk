# PAYable IPG React Native SDK

A comprehensive React Native SDK for integrating Internet Payment Gateway (IPG) functionality into your mobile applications. This SDK supports one-time payments and recurring payments with a secure, user-friendly interface.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [One-Time Payments](#one-time-payments)
- [Recurring Payments](#recurring-payments)
- [Tokenized Payments](#tokenized-payments)
- [API Usage](#api-usage)
- [Merchant Notifications](#merchant-notifications)
- [Error Handling](#error-handling)
- [Security & Compliance](#security--compliance)
- [Testing](#testing)
- [API Reference](#api-reference)
- [FAQs & Troubleshooting](#faqs--troubleshooting)

## Installation

```sh
npm install ipg-reactnative-sdk
```

## Getting Started

1. Import the SDK in your React Native application:
```js
import PayableIPG from 'ipg-reactnative-sdk';
```

2. Initialize the SDK with your merchant credentials:
```js
const data = {
  environment: 'sandbox', // 'sandbox' | 'qa' | 'dev' | 'production'
  logoUrl: 'https://your-logo-url.com/logo.png',
  returnUrl: 'https://your-return-url.com',
  webhookUrl: 'https://your-webhook-url.com',
  merchantKey: 'YOUR_MERCHANT_KEY',
  merchantToken: 'YOUR_MERCHANT_TOKEN',
};
```

## Configuration

### Required Configuration
- `environment`: SDK environment ('sandbox', 'qa', 'dev', or 'production')
- `logoUrl`: Your merchant logo URL
- `returnUrl`: URL to redirect users after payment completion
- `webhookUrl`: URL to receive payment notifications
- `merchantKey`: Your merchant key provided by PAYable
- `merchantToken`: Your merchant token provided by PAYable

## One-Time Payments

### Flow Diagram
1. Initialize payment with required parameters
2. Generate checksum value
3. Present payment screen to user
4. Process payment
5. Handle payment completion/error

### Required Parameters
```js
const paymentData = {
  paymentType: "1", // 1 for one-time payment
  invoiceId: "INV123456", // Unique invoice ID
  amount: "100.00", // Payment amount with 2 decimal places
  currencyCode: "LKR", // Currency code
  orderDescription: "Payment for order #123",
  customerFirstName: "John",
  customerLastName: "Doe",
  customerMobilePhone: "0771234567",
  customerEmail: "john.doe@example.com",
  billingAddressStreet: "123 Main St",
  billingAddressCity: "Colombo",
  billingAddressCountry: "LKA",
  checkValue: "GENERATED_CHECKSUM" // Generated using getCheckValue()
};
```

### Checksum Generation
The checksum is generated using SHA-512 hashing algorithm. Here's the process:

```js
import CryptoJS from 'crypto-js';

const getCheckValue = (
  merchantKey: string,
  merchantToken: string,
  invoiceId: string,
  amount: string,
  currencyCode: string
) => {
  // Step 1: Generate hash from merchant token
  const hash1 = CryptoJS.SHA512(merchantToken)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  // Step 2: Generate final checksum
  const checkValue = CryptoJS.SHA512(
    `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${hash1}`
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return checkValue;
};
```

### Payment Completion Response
```js
{
  merchantKey: "YOUR_MERCHANT_KEY",
  payableOrderId: "oid-XXXXXXXX-XXX-XXXX-XXXX-XXXX",
  payableTransactionId: "XXXXXXXX-XXX-XXXX-XXXX-XXXXXXXXX",
  payableAmount: "100.00",
  payableCurrency: "LKR",
  invoiceNo: "INV123456",
  statusCode: 1,
  statusMessage: "SUCCESS",
  paymentType: 1,
  paymentMethod: 1,
  paymentScheme: "MASTERCARD",
  custom1: "optional data",
  custom2: "optional data",
  cardHolderName: "John Doe",
  cardNumber: "512345xxxxxx0008",
  checkValue: "GENERATED_CHECKSUM"
}
```

## Recurring Payments

### Flow Overview
1. Initialize recurring payment with required parameters
2. Generate checksum value
3. Present payment screen to user
4. Process initial payment
5. Set up recurring schedule
6. Handle recurring payments

### Required Parameters
```js
const recurringPaymentData = {
  paymentType: "2", // 2 for recurring payment
  invoiceId: "INV123456",
  amount: "100.00",
  currencyCode: "LKR",
  orderDescription: "Monthly subscription",
  customerFirstName: "John",
  customerLastName: "Doe",
  customerMobilePhone: "0771234567",
  customerEmail: "john.doe@example.com",
  billingAddressStreet: "123 Main St",
  billingAddressCity: "Colombo",
  billingAddressCountry: "LKA",
  startDate: "2024-01-01",
  endDate: "2024-12-31", // or "FOREVER"
  recurringAmount: "100.00",
  interval: "MONTHLY", // or "ANNUALLY"
  isRetry: "1", // 1 for true, 0 for false
  retryAttempts: "3",
  doFirstPayment: "1", // 1 for true, 0 for false
  checkValue: "GENERATED_CHECKSUM"
};
```

### Checksum Generation for Recurring Payments
```js
const getRecurringCheckValue = (
  merchantKey: string,
  merchantToken: string,
  invoiceId: string,
  amount: string,
  currencyCode: string,
  customerRefNo: string
) => {
  const hash1 = CryptoJS.SHA512(merchantToken)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  const checkValue = CryptoJS.SHA512(
    `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${customerRefNo}|${hash1}`
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return checkValue;
};
```

## Tokenized Payments

### Overview
Tokenized payments allow merchants to securely store customer payment information for future use. This feature enhances the customer experience by eliminating the need to re-enter payment details for subsequent transactions while maintaining the highest security standards.

#### Benefits
- Improved customer experience with faster checkout
- Reduced cart abandonment rates
- Enhanced security through tokenization
- PCI-DSS compliance maintained

#### Security Considerations
- Tokens are stored securely in PAYable's vault
- Original card data is never stored on merchant systems
- Each token is unique to the merchant and customer
- Tokens can be revoked or expired as needed

### Token Creation Flow
1. Customer makes initial payment and opts to save card
2. System generates a unique token for the card
3. Token is securely stored in PAYable's vault
4. Token ID is returned to merchant for future use

### Required Parameters for Token Creation
```js
const tokenPaymentData = {
  paymentType: "3", // 3 for tokenized payment
  invoiceId: "INV123456",
  amount: "100.00",
  currencyCode: "LKR",
  orderDescription: "Token creation payment",
  customerFirstName: "John",
  customerLastName: "Doe",
  customerMobilePhone: "0771234567",
  customerEmail: "john.doe@example.com",
  billingAddressStreet: "123 Main St",
  billingAddressCity: "Colombo",
  billingAddressCountry: "LKA",
  isSaveCard: "1", // 1 to save card for future use
  customerRefNo: "CUST123456", // Unique customer reference
  checkValue: "GENERATED_CHECKSUM"
};
```

### Token Usage Flow
1. Merchant retrieves stored token for customer
2. System processes payment using token
3. Transaction is completed without card details
4. Response is returned with transaction status

### Required Parameters for Token Usage
```js
const tokenUsageData = {
  paymentType: "4", // 4 for token usage
  invoiceId: "INV123456",
  amount: "100.00",
  currencyCode: "LKR",
  orderDescription: "Payment using saved token",
  customerFirstName: "John",
  customerLastName: "Doe",
  customerMobilePhone: "0771234567",
  customerEmail: "john.doe@example.com",
  tokenId: "TOKEN123456", // Retrieved token ID
  customerRefNo: "CUST123456",
  checkValue: "GENERATED_CHECKSUM"
};
```

### Checksum Generation for Token Payments
```js
const getTokenCheckValue = (
  merchantKey: string,
  merchantToken: string,
  invoiceId: string,
  amount: string,
  currencyCode: string,
  customerRefNo: string,
  tokenId?: string
) => {
  const hash1 = CryptoJS.SHA512(merchantToken)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  const checkValue = CryptoJS.SHA512(
    `${merchantKey}|${invoiceId}|${amount}|${currencyCode}|${customerRefNo}|${tokenId || ''}|${hash1}`
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return checkValue;
};
```

### Token Management
- Store token IDs securely in your system
- Implement proper access controls for token retrieval
- Monitor token usage and expiration
- Provide customers with ability to manage saved cards

### Security Considerations
- Implement proper access controls for token storage
- Use encryption for token storage in your system
- Implement secure transmission protocols
- Regularly audit token usage and access

## API Usage

### Authentication
All API requests require proper authentication using your merchant credentials:

#### API Key Requirements
- Valid merchant key and token
- Proper environment configuration
- Secure transmission of credentials

#### Authentication Headers
```js
{
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json',
  'X-Merchant-Key': 'YOUR_MERCHANT_KEY'
}
```

### API Endpoints

#### Token Creation
```js
POST /api/v1/tokens
Content-Type: application/json

Request Body:
{
  "merchantKey": "YOUR_MERCHANT_KEY",
  "invoiceId": "INV123456",
  "amount": "100.00",
  "currencyCode": "LKR",
  "customerRefNo": "CUST123456",
  "checkValue": "GENERATED_CHECKSUM"
}

Response:
{
  "status": "SUCCESS",
  "tokenId": "TOKEN123456",
  "expiryDate": "2025-12-31"
}
```

#### Token Usage
```js
POST /api/v1/payments/token
Content-Type: application/json

Request Body:
{
  "merchantKey": "YOUR_MERCHANT_KEY",
  "invoiceId": "INV123456",
  "amount": "100.00",
  "currencyCode": "LKR",
  "tokenId": "TOKEN123456",
  "customerRefNo": "CUST123456",
  "checkValue": "GENERATED_CHECKSUM"
}

Response:
{
  "status": "SUCCESS",
  "transactionId": "TXN123456",
  "amount": "100.00",
  "currency": "LKR"
}
```

#### Token Management
```js
GET /api/v1/tokens/{tokenId}
DELETE /api/v1/tokens/{tokenId}
```

## Merchant Notifications

### Webhook Setup
1. Configure your webhook endpoint in the SDK initialization
2. Implement webhook handler to process notifications
3. Validate incoming notifications using checksum

### Webhook Payload Structure
```js
{
  merchantKey: "YOUR_MERCHANT_KEY",
  payableOrderId: "oid-XXXXXXXX-XXX-XXXX-XXXX-XXXX",
  payableTransactionId: "XXXXXXXX-XXX-XXXX-XXXX-XXXXXXXXX",
  payableAmount: "100.00",
  payableCurrency: "LKR",
  invoiceNo: "INV123456",
  statusCode: 1,
  statusMessage: "SUCCESS",
  paymentType: 1,
  paymentMethod: 1,
  paymentScheme: "MASTERCARD",
  custom1: "optional data",
  custom2: "optional data",
  cardHolderName: "John Doe",
  cardNumber: "512345xxxxxx0008",
  checkValue: "GENERATED_CHECKSUM"
}
```

### Webhook Response
```js
{
  "Status": 200
}
```

## Error Handling

### Common Error Codes
- 3009: Field validation error
- 400: Bad request
- 500: Server error

### Error Response Format
```js
{
  status: 3009,
  success: false,
  error: {
    fieldName: ["Error message"]
  }
}
```

## Security & Compliance

### PCI-DSS Compliance
- The SDK handles sensitive card data securely
- Card data is never stored on merchant systems
- All transactions are encrypted using industry-standard protocols

### HTTPS Requirements
- All API endpoints must use HTTPS
- Webhook URLs must be HTTPS
- Return URLs must be HTTPS

## Testing

### Sandbox Environment
- Use the sandbox environment for testing
- Test cards are available for different scenarios
- Test webhook notifications using a public URL

### Test Cards
- VISA: 4111 1111 1111 1111
- Mastercard: 5123 4512 3451 2345
- Expiry: Any future date
- CVV: Any 3 digits

## API Reference

### PayableIPG Component
```js
<PayableIPG
  PAYableIPGClient={data}
  packageName={packageName}
  paymentType={paymentType}
  invoiceId={invoiceId}
  amount={amount}
  currencyCode={currencyCode}
  orderDescription={orderDescription}
  // ... other props
  onPaymentStarted={handlePaymentStarted}
  onPaymentCompleted={handlePaymentCompleted}
  onPaymentError={handlePaymentError}
  onPaymentCancelled={handlePaymentCancelled}
/>
```

### Event Handlers
- `onPaymentStarted`: Called when payment process begins
- `onPaymentCompleted`: Called when payment is successful
- `onPaymentError`: Called when payment fails
- `onPaymentCancelled`: Called when user cancels payment

## FAQs & Troubleshooting

### Common Issues
1. **Invalid Checksum**
   - Verify merchant token
   - Check parameter order in checksum generation
   - Ensure all values are properly formatted

2. **Webhook Notifications**
   - Verify webhook URL is publicly accessible
   - Check server logs for incoming requests
   - Validate checksum of incoming notifications

3. **Payment Failures**
   - Check card details
   - Verify sufficient funds
   - Ensure proper error handling

### Support
For additional support, contact PAYable support team at support@payable.com

