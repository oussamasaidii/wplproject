import { SessionData } from 'express-session';
import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    password: string;
    comparePassword: (candidatePassword: string, cb: any) => void;
}

declare module 'express-session' {
    interface SessionData {
        user?: User; 
    }
}
