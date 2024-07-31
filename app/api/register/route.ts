import bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST (request : Request){
    const formData = await request.formData();
    const result = await registerUser(formData);
    const res = {message: result};
    return new Response(JSON.stringify(res));
}

async function encrypt(password: string, salts: number): Promise<string> {
    const encryptedPassword = bcrypt.hashSync(password, salts);
    return encryptedPassword;
}
async function registerUser(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password')?.toString?.();
    const dob = formData.get('dob');
    if (!name || !email || !password || !dob) {
        console.error('Invalid form data');
        return "Preencha todos os campos corretamente";
    }
    const salts = 5;
    const encryptedPassword = await encrypt(password, salts);
    const existingUser = await prisma.users.findUnique({
        where: {
            email: email.toString()
        }
    });
    if (existingUser) {
        return "Usuário com este email já existe";
    }
    const uuid = uuidv4();
    // const user = new User({_id: uuid, name, email, password: encryptedPassword, dob});
    const user = await prisma.users.create({
        data: {
            id: uuid,
            name: name.toString(),
            email: email.toString(),
            password: encryptedPassword,
            dob: new Date(dob.toString()),
            v: 0
        }
    });
    console.log(user);
    console.log('User registered successfully');
    return "Usuário registrado com sucesso";
}
