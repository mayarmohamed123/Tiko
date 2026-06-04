import prisma from '../config/db.js';

export interface InstapayConfig {
  qrCodeUrl?: string;
  email?: string;
  phone?: string;
  paymentLink?: string;
}

export const seedDefaultConfigs = async (): Promise<void> => {
  try {
    const count = await prisma.paymentMethodConfig.count();
    if (count > 0) return;

    // Seed default methods
    await prisma.paymentMethodConfig.createMany({
      data: [
        {
          id: 'CASH',
          name: 'Cash on Delivery',
          isEnabled: true,
          config: {},
        },
        {
          id: 'INSTAPAY',
          name: 'Instapay Transfer',
          isEnabled: true,
          config: {
            email: 'mayar201500@instapay',
            phone: '01025350571',
            paymentLink: 'https://ipn.eg/S/mayar201500/instapay/5CZr0y',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fipn.eg%2FS%2Fmayar201500%2Finstapay%2F5CZr0y',
          },
        },
      ],
    });
    console.log('✅ Payment methods seeded successfully.');
  } catch (error) {
    console.error('❌ Failed to seed payment methods:', error);
  }
};

export const getEnabledPaymentMethods = async () => {
  return prisma.paymentMethodConfig.findMany({
    where: { isEnabled: true },
    orderBy: { id: 'asc' },
  });
};

export const getAllPaymentMethods = async () => {
  return prisma.paymentMethodConfig.findMany({
    orderBy: { id: 'asc' },
  });
};

export const updatePaymentMethod = async (
  id: string,
  isEnabled: boolean,
  config: Record<string, any>
) => {
  // Enforce validation for Instapay
  if (id === 'INSTAPAY' && isEnabled) {
    const { email, phone, paymentLink } = config;
    if (
      (!email || !email.trim()) &&
      (!phone || !phone.trim()) &&
      (!paymentLink || !paymentLink.trim())
    ) {
      throw new Error('INSTAPAY_VAL_REQUIRED');
    }
  }

  return prisma.paymentMethodConfig.update({
    where: { id },
    data: {
      isEnabled,
      config,
    },
  });
};
