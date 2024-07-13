import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; // Import the 'jwt' 
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String,
    dob: Date
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sophia2');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

export async function generateJWT(id: string, secret: string) {
    const jwtToken = jwt.sign({ id }, secret , { expiresIn: '7d' }); 
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