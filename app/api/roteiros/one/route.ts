import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    const token = req.headers.get("Token");
    if (!token) {
        return new Response("Token não encontrado");
    }
    const secret = process.env.SECRET;
    if (!secret) {
        return new Response("Erro interno do servidor");
    }
    let decoded = await verifyJWT(token, secret);
    if (typeof decoded === "object") {
        const roteiro = await prisma.roteiros.findUnique({
            where: {
                id: data.id,
                authorId: decoded.id,
            },
        });
        return new Response(JSON.stringify(roteiro));
    }
}