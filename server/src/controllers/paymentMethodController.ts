import { Request, Response } from 'express';
import * as paymentMethodService from '../services/paymentMethodService.js';
import { uploadSettingsImage } from '../utils/cloudinary.js';

export const getEnabledMethods = async (_req: Request, res: Response) => {
  try {
    const methods = await paymentMethodService.getEnabledPaymentMethods();
    res.json(methods);
  } catch (error) {
    console.error('[paymentMethodController.getEnabledMethods]', error);
    res.status(500).json({ message: 'Failed to fetch enabled payment methods.' });
  }
};

export const getAllMethods = async (_req: Request, res: Response) => {
  try {
    const methods = await paymentMethodService.getAllPaymentMethods();
    res.json(methods);
  } catch (error) {
    console.error('[paymentMethodController.getAllMethods]', error);
    res.status(500).json({ message: 'Failed to fetch all payment methods.' });
  }
};

export const updateMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isEnabled, config } = req.body;

    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({ message: 'isEnabled must be a boolean.' });
    }

    const updated = await paymentMethodService.updatePaymentMethod(
      id as string,
      isEnabled,
      config || {}
    );
    res.json(updated);
  } catch (error: any) {
    if (error.message === 'INSTAPAY_VAL_REQUIRED') {
      return res.status(400).json({
        message: 'At least one of the following must be provided: Instapay Email, Phone Number, or Payment Link.',
      });
    }
    console.error('[paymentMethodController.updateMethod]', error);
    res.status(500).json({ message: 'Failed to update payment method.' });
  }
};

export const uploadQrCode = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No QR Code image provided.' });
  }

  try {
    const url = await uploadSettingsImage(file.buffer, 'instapay_qr');
    res.json({ qrCodeUrl: url });
  } catch (error: any) {
    console.error('[paymentMethodController.uploadQrCode]', error);
    if (error.message === 'CLOUDINARY_NOT_CONFIGURED') {
      return res.status(503).json({ message: 'Image upload is not configured.' });
    }
    res.status(500).json({ message: 'Failed to upload QR Code.' });
  }
};
