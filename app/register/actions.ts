"use server"

import bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import { User } from '@/lib/util';
import { connectToMongoDB } from '@/lib/util';
import { v4 as uuidv4 } from 'uuid';

async function encrypt(password: string, salts: number): Promise<string> {
    const encryptedPassword = bcrypt.hashSync(password, salts);
    return encryptedPassword;
}

export async function registerUser(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password')?.toString?.();
    const dob = formData.get('dob');
    if (!name || !email || !password || !dob) {
        console.error('Invalid form data');
        return "Preencha todos os campos corretamente";
    }
    await connectToMongoDB();
    const salts = 5;
    const encryptedPassword = await encrypt(password, salts);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.error('User with this email already exists');
        return "Usuário com este email já existe";
    }
    const uuid = uuidv4();
    const user = new User({_id: uuid, name, email, password: encryptedPassword, dob});
    await user.save();
    console.log('User registered successfully');
    redirect("/login");
}
