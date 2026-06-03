import { Router } from 'express';
import {
  initiateRegister,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPasswordHandler,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { avatarUpload } from '../middleware/uploadMiddleware.js';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & account management
 */

// ─── POST /api/auth/register ──────────────────────────────────────────────────
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Initiate registration — sends verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, confirmPassword]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "mysecret1"
 *               confirmPassword:
 *                 type: string
 *                 example: "mysecret1"
 *               phone:
 *                 type: string
 *                 example: "+1 555 0100"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post('/register', initiateRegister);

// ─── GET /api/auth/verify-email?token=xxx ────────────────────────────────────
/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify email using the token from the verification link
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token from the email link
 *     responses:
 *       200:
 *         description: Email verified, account activated
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-email', verifyEmail);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login — sets httpOnly auth_token cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "mysecret1"
 *     responses:
 *       200:
 *         description: Login successful — auth_token cookie set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified or account disabled
 */
router.post('/login', login);

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout — clears the auth_token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout);

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: Reset email sent (always, to prevent enumeration)
 */
router.post('/forgot-password', forgotPassword);

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using the token from the reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token, or validation error
 */
router.post('/reset-password', resetPasswordHandler);

// ─── GET /api/auth/me  (protected) ───────────────────────────────────────────
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN]
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authMiddleware, getMe);
router.patch('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);
router.patch('/avatar', authMiddleware, avatarUpload.single('avatar'), uploadAvatar);

export default router;
