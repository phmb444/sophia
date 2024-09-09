import jwt from 'jsonwebtoken'; // Import the 'jwt' 
import bcrypt from 'bcrypt';

export async function generateJWT(id: string, secret: string) {
    const jwtToken = jwt.sign({ id }, secret);
    return jwtToken;
}

export async function verifyJWT(jwtToken: string, secret: string) {
    const decoded = jwt.verify(jwtToken, secret);
    return decoded;
}

export async function decrypt(password: string, encryptedPassword: string): Promise<boolean> {
    const result = bcrypt.compareSync(password, encryptedPassword);
    return result;
}

