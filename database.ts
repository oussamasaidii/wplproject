import { MongoClient, ObjectId } from "mongodb";
import { User } from "./types";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
export const client = new MongoClient(MONGODB_URI);

export const userCollection = client.db().collection<User>("users");

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
        await createInitialUser(); // Voeg de initiële gebruiker toe bij het verbinden met de database
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
}

const saltRounds: number = 10; // Definieer het aantal salt rounds voor het hashen van wachtwoorden

async function createInitialUser() {
    try {
        if (await userCollection.countDocuments() > 0) {
            return;
        }
        const email: string | undefined = process.env.ADMIN_EMAIL;
        const password: string | undefined = process.env.ADMIN_PASSWORD;
        if (email === undefined || password === undefined) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
        }
        await userCollection.insertOne({
            username: "admin",
            email: email,
            password: await bcrypt.hash(password, saltRounds),
            role: "ADMIN",
            game: "Fortnite"
        });
    } catch (error) {
        console.error("Error creating initial user:", error);
        throw error;
    }
}

export async function register(username: string, email: string, password: string, game: string) {
    try {
        if (!username || !email || !password || game !== 'fortnite') {
            throw new Error("Gebruikersnaam, email, wachtwoord en game zijn vereist, enkel Fortnite is mogelijk!");
        }
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            throw new Error("Gebruiker bestaat al!");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await userCollection.insertOne({ username, email, password: hashedPassword , role: "USER", game});
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}


export async function login(email: string, password: string): Promise<User | undefined> {
    try {
        if (email === "" || password === "") {
            throw new Error("Email en wachtwoord zijn vereist!");
        }
        const user = await userCollection.findOne({ email }) as User | null;
        if (!user) {
            throw new Error("Gebruiker niet gevonden, maak een account aan.");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Wachtwoord verkeerd");
        }
        return user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}
