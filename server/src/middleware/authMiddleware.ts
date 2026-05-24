import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────
// Reads the httpOnly 'auth_token' cookie, verifies the JWT,
// and attaches { userId, role } to req.user for downstream handlers.
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

// ─── Admin Middleware ─────────────────────────────────────────────────────────
// Chains after authMiddleware — additionally enforces ADMIN role.
// Usage: router.get('/admin-route', adminMiddleware, handler)
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // First run the standard auth check
  authMiddleware(req, res, () => {
    const role = (req as any).user?.role;
    if (role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  });
};
