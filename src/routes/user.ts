
import express from 'express';
import { body } from 'express-validator';
import { getUserData, recoverSecretKey, signup, updateEmail, updateUserData, verifyEmail, verifyEmailUpdate } from '../controllers/user';

const router = express.Router();

router.post('/signup', body('email').isEmail().withMessage('Invalid email'), signup);

router.post('/verify', body(['email', 'otp', 'type']).notEmpty().withMessage('Email, OTP and Verification type are required'), verifyEmail);

router.post('/update-email', body(['email', 'newEmail']).notEmpty().withMessage('Both previous and new emails are required'), updateEmail);

router.post('/verify-email-update', body(['previousEmail', 'newEmail', 'otp']).notEmpty().withMessage('Previous email, new email and OTP are required'), verifyEmailUpdate);

router.post('/update-user-data', body(['email', 'name', 'avatar', 'theme', 'encryptedUserData']).notEmpty().withMessage('Email, name, avatar, theme and encryptedUserData are required'), updateUserData);

router.post('/get-user-data', body(['email']).notEmpty().withMessage('Email is required'), getUserData);

router.post('/recover-secret-key', body(['email']).notEmpty().withMessage('Emailis required'), recoverSecretKey);

export { router as userRoutes };
