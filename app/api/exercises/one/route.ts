import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    const token = data.token;
    if (!token) {
        return new Response("Token não encontrado");
    }
    const secret = process.env.SECRET;
    if (!secret) {
        return new Response("Erro interno do servidor");
    }
    let decoded = await verifyJWT(token, secret);
    if (typeof decoded === "object") {
        const exercise = await prisma.exercises.findUnique({
            where: {
                id: data.id,
            },
        });
        return new Response(JSON.stringify(exercise));
    }
}