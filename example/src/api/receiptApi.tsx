/**
 * Receipt Status API Service
 * Fetches invoice data after payment completion
 */

export interface InvoiceData {
  transactionId?: string;
  orderId?: string;
  invoiceNo?: string;
  amount?: string;
  paymentStatus?: string;
  paymentScheme?: string;
  cardHolder?: string;
  cardNumber?: string;
  // Add more fields as needed based on API response
  [key: string]: any;
}

export const fetchReceiptStatus = async (
  uid: string,
  statusIndicator: string
): Promise<InvoiceData | null> => {
  try {
    const requestUrl = 'https://ipgqanotifyapi.payable.lk/receiptstatus-echeckout';
    const requestParams = {
      uid: uid,
      statusIndicator: statusIndicator,
    };
    
    console.log('📧 Fetching receipt status...', { uid, statusIndicator });
    console.log('🔗 Request URL:', requestUrl);
    console.log('📋 Request params:', requestParams);
    console.log('📝 Request body:', JSON.stringify(requestParams));
    
    // Try GET method with query parameters
    const queryParams = new URLSearchParams(requestParams);
    const getUrl = `${requestUrl}?${queryParams}`;
    
    console.log('🔗 GET Request URL with params:', getUrl);
    
    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response status text:', response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('Receipt API error:', response.status, response.statusText);
      
      // Try to log response body even for errors
      try {
        const errorText = await response.text();
        console.error('📡 Error response body:', errorText);
      } catch (bodyError) {
        console.error('📡 Could not read error response body:', bodyError);
      }
      
      return null;
    }

    const data = await response.json();
    console.log('📧 Receipt data received:', data);
    console.log('📧 Receipt data (stringified):', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Failed to fetch receipt status:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return null;
  }
};

export const fetchReceiptStatusWithRetry = async (
  uid: string,
  statusIndicator: string,
  maxRetries: number = 5,
  delayMs: number = 2000,
  onRetry?: (attempt: number, maxRetries: number) => void
): Promise<InvoiceData | null> => {
  console.log(`🔄 Starting receipt fetch with retry logic (max ${maxRetries} attempts)...`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Attempt ${attempt}/${maxRetries} - Fetching receipt...`);
      
      if (onRetry) {
        onRetry(attempt, maxRetries);
      }
      
      const invoiceData = await fetchReceiptStatus(uid, statusIndicator);
      
      if (invoiceData && Array.isArray(invoiceData) && invoiceData.length > 0) {
        console.log(`✅ Receipt data found on attempt ${attempt}!`);
        return invoiceData;
      } else if (invoiceData && !Array.isArray(invoiceData)) {
        console.log(`✅ Receipt data found on attempt ${attempt}!`);
        return invoiceData;
      }
      
      console.log(`⏳ Attempt ${attempt}/${maxRetries} - No data found, retrying in ${delayMs}ms...`);
      
      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  console.error(`💥 Failed to fetch receipt after ${maxRetries} attempts`);
  return null;
};
