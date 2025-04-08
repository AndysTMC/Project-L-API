import { DATE_LANGUAGE, LTimeStamp, TIMESTAMPFORMAT } from "./types";
import { format } from "@formkit/tempo";

export function getCurrentTS(): LTimeStamp {
  const currentDateObj = new Date();
  currentDateObj.setSeconds(0);
  return format(currentDateObj, TIMESTAMPFORMAT, DATE_LANGUAGE) as LTimeStamp;
}

export function generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+=()[]{}|;:,.<>?/';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export function generateSecretKey(): string {
    const secretKey = generateRandomString(64);
    return secretKey;
}


function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return btoa(bytes.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

function base64ToBuffer(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export async function encrypt<T>(
	password: string,
	data: T,
): Promise<string> {
	const encoder = new TextEncoder();

	const jsonString = JSON.stringify(data);
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const iv = crypto.getRandomValues(new Uint8Array(12));

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt"]
	);

	const ciphertext = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoder.encode(jsonString)
	);

	const combined = new Uint8Array([
		...salt,
		...iv,
		...new Uint8Array(ciphertext),
	]);

	return bufferToBase64(combined.buffer);
}

export async function decrypt<T>(
	password: string,
	encryptedData: string
): Promise<T> {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	const combined = base64ToBuffer(encryptedData);

	const salt = combined.slice(0, 16);
	const iv = combined.slice(16, 28);
	const ciphertext = combined.slice(28);

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["decrypt"]
	);

	try {
		const decrypted = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			key,
			ciphertext
		);

		return JSON.parse(decoder.decode(decrypted)) as T;
	} catch (error: unknown) {
		if (!(error instanceof Error)) {
			throw new Error("Unexpected error");
		}
		throw new Error(
			"Decryption failed: Incorrect password or corrupted data"
		);
	}
}


export const authenticateUser = async (firstPartDKey: string, secondPartDKey: string, encryptedUserData: string) => {
	try {
		await decrypt(firstPartDKey + secondPartDKey, encryptedUserData);
		return true;
	} catch (error) {
		return false;
	}
}