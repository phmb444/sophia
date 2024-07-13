"use server"

import { User } from '@/lib/util';
import { connectToMongoDB } from '@/lib/util';
import { generateJWT } from '@/lib/util';
import { decrypt } from '@/lib/util';

export async function loginUser(formData: FormData) {
    const email = formData.get('email')?.toString?.();
    const password = formData.get('password')?.toString?.();
    if (!email || !password) {
        console.error('Invalid form data');
        return "Preencha todos os campos corretamente";
    }
    await connectToMongoDB();
    const user = await User.findOne({ email: email });
    if (!user) {
        console.error('User not found');
        return "Usuário não existente";
    }
    const result = await decrypt(password, user.password);
    if (!result) {
        console.error('Invalid password');
        return "Senha inválida";
    }
    const secret = String(process.env.SECRET);
    console.log(secret)
    if (!secret) {
        console.error('JWT_SECRET is not defined');
        return "Erro interno";
    }
    const jwtToken = await generateJWT(user._id, secret);
    return {token: jwtToken, message: "Sucesso ao realizar login"};
}