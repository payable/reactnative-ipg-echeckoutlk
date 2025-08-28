import React, { createContext, useState, useContext } from 'react';

interface FormData {
  amount: string;
  currency: string;
  orderDescription?: string;
  custom1?: string;
  custom2?: string;
  billingFirstName: string;
  billingLastName: string;
  billingMobile: string;
  billingPhone?: string;
  billingEmail: string;
  billingCompanyName?: string;
  billingStreetAddress1: string;
  billingStreetAddress2?: string;
  billingTownCity: string;
  billingProvince?: string;
  billingCountry: string;
  billingPostcode: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingMobile?: string;
  shippingPhone?: string;
  shippingEmail?: string;
  shippingCompanyName?: string;
  shippingStreetAddress1?: string;
  shippingStreetAddress2?: string;
  shippingTownCity?: string;
  shippingProvince?: string;
  shippingCountry?: string;
  shippingPostcode?: string;
  paymentType: string;
  startDate?: string;
  endDate?: string;
  recurringAmount: string;
  interval?: string;
  isRetry: string;
  retryAttempts?: string;
  doFirstPayment: string;
  isCardSaved?: string;
  merchantId?: string;
  customerId?: string;
  tokenId?: string;
}

interface FormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const initialFormData: FormData = {
  amount: '',
  currency: '',
  billingStreetAddress1: '',
  billingStreetAddress2: '',
  billingCompanyName: '',
  billingTownCity: '',
  billingCountry: '',
  billingPostcode: '',
  paymentType: '1',
  recurringAmount: '0',
  isRetry: '0',
  doFirstPayment: '0',
  shippingCompanyName: '',
  shippingStreetAddress1: '',
  shippingStreetAddress2: '',
  shippingPhone: '',
  billingFirstName: '',
  billingLastName: '',
  billingMobile: '',
  billingEmail: '',
  isCardSaved: '0',

};
const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
