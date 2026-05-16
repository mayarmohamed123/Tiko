import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
