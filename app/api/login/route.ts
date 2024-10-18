import { generateJWT, decrypt } from '@/lib/util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ERROR_MESSAGES = {
    MISSING_FIELDS: "Preencha todos os campos corretamente",
    USER_NOT_FOUND: "Usuário não existente",
    INVALID_PASSWORD: "Senha inválida",
    INTERNAL_ERROR: "Erro interno",
    SECRET_NOT_DEFINED: "Erro: variável de ambiente SECRET não definida",
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await loginUser(formData);
        return new Response(JSON.stringify(result), { status: result.success ? 200 : 400 });
    } catch (error) {
        return new Response(ERROR_MESSAGES.INTERNAL_ERROR, { status: 500 });
    }
}

async function loginUser(formData: FormData) {
    const { email, password } = extractCredentials(formData);
    if (!email || !password) {
        return { success: false, message: ERROR_MESSAGES.MISSING_FIELDS };
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND };
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
        return { success: false, message: ERROR_MESSAGES.INVALID_PASSWORD };
    }

    const secret = process.env.SECRET;
    if (!secret) {
        return { success: false, message: ERROR_MESSAGES.SECRET_NOT_DEFINED };
    }

    const jwtToken = await generateJWT(user.id, secret);
    return { success: true, token: jwtToken, message: "Sucesso ao realizar login" };
}

function extractCredentials(formData: FormData) {
    return {
        email: formData.get('email')?.toString(),
        password: formData.get('password')?.toString(),
    };
}

async function findUserByEmail(email: string) {
    return await prisma.users.findUnique({ where: { email } });
}

async function validatePassword(password: string, hashedPassword: string) {
    return await decrypt(password, hashedPassword);
}
