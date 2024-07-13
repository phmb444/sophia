'use server'

import { User } from '@/lib/util';
import { connectToMongoDB } from '@/lib/util';
import { verifyJWT } from '@/lib/util';
import { decrypt } from '@/lib/util';

type UserData = {
    name: string
    email: string;
    dob: string;
    password: string;
};

export async function getUserData(token: string){
    connectToMongoDB();
    let secret = String(process.env.SECRET);
    let decryptedToken: any = await verifyJWT(token, secret)
    let user_id = decryptedToken.id;
    let user = await User.findOne({_id : user_id})
    let response: UserData = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        password: user.password
    };
    console.log(response)
    return response;
}