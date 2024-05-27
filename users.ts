import { Collection, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import { connect, userCollection } from "./database";
import { User } from "./types";

export async function createUser(username: string, email: string, password: string, role: "ADMIN" | "USER", game: string) {
    try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            throw new Error("Gebruiker bestaat al!");
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Aantal salt rounds
        const newUser: User = {
            username,
            email,
            password: hashedPassword,
            role,
            game
        };
        await userCollection.insertOne(newUser);
        console.log("Gebruiker succesvol aangemaakt!");
    } catch (error) {
        console.error("Fout bij het aanmaken van gebruiker:", error);
        throw error;
    }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
    try {
        const user = await userCollection.findOne({ email }) as User;
        if (!user) {
            throw new Error("Gebruiker niet gevonden, maak een account aan.");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Wachtwoord incorrect");
        }
        console.log("Gebruiker succesvol ingelogd!");
        return user;
    } catch (error) {
        console.error("Fout bij inloggen:", error);
        throw error;
    }
}
