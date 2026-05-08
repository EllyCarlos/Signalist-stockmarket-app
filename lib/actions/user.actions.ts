'use server';

import {connectToDatabase} from "@/database/mongoose";

type BetterAuthUserDocument = {
    _id?: { toString(): string };
    id?: string;
    email?: string;
    name?: string;
};

export const getAllUsersForNewsEmail = async (): Promise<User[]> => {
   try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("MongoDB connection error");

        const users = await db.collection<BetterAuthUserDocument>('user').find(
            { email: { $type: 'string' } },
            { projection: { _id: 1, id: 1, email: 1, name: 1, country:1 } },
       ).toArray();

        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id || user._id?.toString() || '',
            email: user.email || '',
            name: user.name || '',
        }))
   } catch (e) {
       console.error('Error fetching users for news email', e);
       return [];
   }
}

export const getAllUsersForEmail = getAllUsersForNewsEmail;
