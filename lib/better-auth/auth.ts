import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import type { Db } from "mongodb";

const createAuth = (db: Db) => {
    const secret = process.env.BETTER_AUTH_SECRET;
    const baseURL = process.env.BETTER_AUTH_URL;

    if (!secret) throw new Error("BETTER_AUTH_SECRET is required within .env");
    if (!baseURL) throw new Error("BETTER_AUTH_URL is required within .env");

    return betterAuth({
        database: mongodbAdapter(db),
        secret,
        baseURL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });
};

let authInstance: ReturnType<typeof createAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection is not found");

    authInstance = createAuth(db);

    return authInstance;
};

export const auth = await getAuth();
