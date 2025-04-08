
import { Document } from 'mongoose';

export enum LTheme {
    LIGHT = 'little-light',
    DARK = 'little-dark',
}

export type LTimeStamp =
	`${number}-${number}-${number}T${number}:${number}:${number}+${number}:${number}`;

export const TIMESTAMPFORMAT = "YYYY-MM-DDTHH:mm:ssZ";

export const DATE_LANGUAGE = "en";

export interface IUser extends Document {
    profile: {
        name: string,
        email: string;
        avatar: string | null,
        theme: LTheme,
    },
    encryptedData: string,
    encryptedSecretKey: string,
}

export interface IUserCreateVerification extends Document {
	email: string;
	otp: string;
	requestedAt: Date;
}

export interface IEmailUpdateVerification extends Document {
	previousEmail: string;
	newEmail: string;
	requestedAt: Date;
}


export enum AIProviders {
	OPENAI = "OpenAI",
	GEMINI = "Gemini",
	DEEPSEEK = "DeepSeek",
	ANTHROPIC = "Anthropic",
	QWEN = "Qwen",
	GROQ = "Groq",
	OPENROUTER = "OpenRouter",
	TOGETHERAI = "TogetherAI",
}

export type AISettings = {
	provider: AIProviders | null;
	apiKey: string | null;
};

export interface UserSettings {
	gettingStarted: {
		isFirstTimeUser: boolean;
	};
	ai: AISettings;
}

export enum ReminderType {
	NORMAL = "normal",
	ESCALATING = "escalating",
}

export const MAX_REMINDER_MESSAGE_LENGTH = 256;

export interface Reminder {
	id: string;
	message: string;
	targetTS: LTimeStamp;
	type: ReminderType;
	lastNotifiedTS: LTimeStamp;
}

export const SAVE_NOTE_LENGTH = 256;

export interface Note {
	id: string;
	content: string;
	lastModifiedTS: LTimeStamp;
}

export interface Save {
	id: string;
	url: string;
	domain: string;
	name: string;
	preview: string;
	lastSeen: LTimeStamp;
}

export enum TaskPriority {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
}

export enum MERIDEUM {
	AM = "AM",
	PM = "PM",
}

export type LTime = `${number}:${number}:${number}+${number}:${number}`;

export enum RecurringType {
	DAILY = "daily",
	WEEKLY = "weekly",
	MONTHLY = "monthly",
	YEARLY = "yearly",
}

export enum WEEKDAYNAMES {
	SUNDAY = "sunday",
	MONDAY = "monday",
	TUESDAY = "tuesday",
	WEDNESDAY = "wednesday",
	THURSDAY = "thursday",
	FRIDAY = "friday",
	SATURDAY = "saturday",
}

export interface RecurringInfo {
	type: RecurringType;
	time: LTime;
	weekDay: number | null;
	day: number | null;
	month: number | null;
}

export interface DeadlineInfo {
	deadlineTS: LTimeStamp;
	lastNotifiedTS: LTimeStamp;
}

export enum TaskType {
	ADHOC = "ad-hoc",
	RECURRING = "recurring",
	DUE = "due",
}

export interface Task {
	id: string;
	information: string;
	label: string;
	priority: TaskPriority;
	type: TaskType;
	recurringInfo: RecurringInfo | null;
	deadlineInfo: DeadlineInfo | null;
	isFinished: boolean;
}

export type SaveTaskIn = {
	taskId: string;
	saveId: string;
};

export type TaskReminderIn = {
	taskId: string;
	reminderId: string;
};

export type ReminderSaveIn = {
	reminderId: string;
	saveId: string;
};

export type SaveNoteIn = {
	saveId: string;
	noteId: string;
};

export interface LittleNotification {
	id: string;
	message: string;
	data: {
		reminderId: string;
		taskId?: string;
		saveId?: string;
	};
	timestamp: LTimeStamp;
}

export interface UserData {
	notes: Array<Note>;
	saves: Array<Save>;
	reminders: Array<Reminder>;
	notifications: Array<LittleNotification>;
	tasks: Array<Task>;
	integrations: {
		saveTaskIn: Array<SaveTaskIn>;
		taskReminderIn: Array<TaskReminderIn>;
		reminderSaveIn: Array<ReminderSaveIn>;
		saveNoteIn: Array<SaveNoteIn>;
	};
	settings: UserSettings;
}