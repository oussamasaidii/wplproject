import mongoose from 'mongoose';

export const MONGODB_URI = 'mongodb://localhost:27017/login-express';

mongoose.connect(MONGODB_URI);

import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb+srv://oussdii:Hamza0603.@cluster0.8m4ltjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

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
    } catch (error) {
        console.error(error);
    }
}