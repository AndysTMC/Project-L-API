import { Request, Response } from 'express';
import User from '../models/User';
import { encrypt, generateSecretKey, generateRandomString } from '../utils';
import UserVerification from '../models/UserCreateVerification';
import UserCreateVerification from '../models/UserCreateVerification';
import EmailUpdateVerification from '../models/EmailUpdateVerification';


export async function signup(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': email });
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    
    const existingVerification = await UserCreateVerification.findOne({ email });
    // we should not resend otp within 2 minutes of the last sent otp
    if (existingVerification && existingVerification.requestedAt.getTime() < (Date.now() - 120000)) {
        res.status(400).json({ message: 'Try again after 2 minutes' });
        return;
    }
    // Send OTP to user's email (mocked for now)
    
    const OTP = '123456'; // Mock OTP

    const newVerification = new UserVerification({
        email,
        password,
        otp: OTP,
    });
    await newVerification.save();

    res.status(201).json({ message: 'User created successfully' });
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400).json({ message: 'Email and OTP are required' });
        return;
    }
    // Mock OTP verification
    if (otp !== '123456') {
        res.status(400).json({ message: 'Invalid OTP' });
        return;
    }
    const secretKey = generateSecretKey();
    const recoveryKey = generateRandomString(256);
    const encryptedSecretKey = await encrypt(recoveryKey, secretKey);
    const existingVerification = await UserCreateVerification.findOne({ email });
    if (!existingVerification) {
        res.status(404).json({ message: 'Please try again later' });
        return;
    }
    const newUser = new User({
        profile: {
            name: email.split('@')[0],
            email,
            password: existingVerification.get("password"),
        },
        encryptedData: '',
        encryptedSecretKey, 
        isVerified: false,
    });
    await newUser.save();
    await existingVerification.deleteOne();
    res.status(200).json({ secretKey, recoveryKey });
}

export async function updateEmail(req: Request, res: Response): Promise<void> {
    const { previousEmail, newEmail } = req.body;
    if (!previousEmail || !newEmail) {
        res.status(400).json({ message: 'Both previous and new emails are required' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': newEmail });
    if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
    }
    const existingVerification = await EmailUpdateVerification.findOne({ previousEmail, newEmail });
    if (existingVerification && existingVerification.requestedAt.getTime() < (Date.now() - 120000)) {
        res.status(400).json({ message: 'Try again after 2 minutes' });
        return;
    }
    // Send OTP to user's new email (mocked for now)
    const OTP = '123456'; // Mock OTP
    const newVerification = new EmailUpdateVerification({
        previousEmail,
        newEmail,
        otp: OTP,
    });
    await newVerification.save();
    res.status(200).json({ message: 'Email update OTP sent successfully' });
}

export async function verifyEmailUpdate(req: Request, res: Response): Promise<void> {
    const { previousEmail, newEmail, otp } = req.body;
    if (!previousEmail || !newEmail || !otp) {
        res.status(400).json({ message: 'Previous email, new email and OTP are required' });
        return;
    }
    // Mock OTP verification
    if (otp !== '123456') {
        res.status(400).json({ message: 'Invalid OTP' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': previousEmail });
    if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    existingUser.profile.email = newEmail;
    existingUser.profile.name = newEmail.split('@')[0];
    await existingUser.save();
    await EmailUpdateVerification.deleteOne({ previousEmail, newEmail });
    res.status(200).json({ message: 'Email updated successfully' });
}

export async function updateUserData(req: Request, res: Response) {
    const { email, name, avatar, theme, encryptedUserData } = req.body;
    if (!email || !encryptedUserData) {
        res.status(400).json({ message: 'Email, userData and firstPartDKey are required' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': email });
    if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    existingUser.profile.name = name || existingUser.profile.name;
    existingUser.profile.avatar = avatar || existingUser.profile.avatar;
    existingUser.profile.theme = theme || existingUser.profile.theme;
    existingUser.encryptedData = encryptedUserData;
    await existingUser.save();
    res.status(200).json({ message: 'User data updated successfully' });
}

export async function getUserData(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email and firstPartDKey are required' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': email });
    if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const { name, avatar, theme } = existingUser.profile;
    res.status(200).json({ name, avatar, theme, encryptedUserData: existingUser.encryptedData });
}

export async function recoverSecretKey(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email and recovery key are required' });
        return;
    }
    const existingUser = await User.findOne({ 'profile.email': email });
    if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.status(200).json({ encryptedSecretKey: existingUser.encryptedSecretKey }); 
}