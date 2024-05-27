import { User } from './types';
import session, { MemoryStore } from 'express-session';
import mongoDbSession from 'connect-mongodb-session';
import { MONGODB_URI } from './database';

const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    databaseName: 'login-express',
});

declare module 'express-session' {
    export interface SessionData {
        user?: User; 
    }
}


export default session({
    secret: process.env.SESSION_SECRET ?? 'TiltedTowers',
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
});
