import { Router } from 'express';
import { z } from 'zod';
import { sendContactFormEmail } from '../utils/emailService.js';

const router = Router();

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

router.post('/', async (req, res) => {
  try {
    const data = contactFormSchema.parse(req.body);
    await sendContactFormEmail(data.name, data.email, data.message);
    res.status(200).json({ message: 'Message sent successfully. Thank you!' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('[Contact API Error]', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

export default router;
