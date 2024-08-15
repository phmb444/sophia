import { generateJWT } from '@/lib/util';
import { decrypt } from '@/lib/util';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function POST (request : Request){
    const formData = await request.formData();
    const result = await loginUser(formData);
    if (typeof result === 'string') {
        return new Response(result);
    }
    return new Response(JSON.stringify(result))
}


async function loginUser(formData: FormData) {
    const email = formData.get('email')?.toString?.();
    const password = formData.get('password')?.toString?.();
    if (!email || !password) {

        return "Preencha todos os campos corretamente";
    }
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    });
    if (!user) {

        return "Usuário não existente";
    }
    const result = await decrypt(password, user.password);
    if (!result) {

        return "Senha inválida";
    }
    const secret = String(process.env.SECRET);

    if (!secret) {

        return "Erro interno";
    }
    const jwtToken = await generateJWT(user.id, secret);
    return {token: jwtToken, message: "Sucesso ao realizar login"};
}