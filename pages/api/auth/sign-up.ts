import type { NextApiRequest, NextApiResponse } from 'next'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { ISingUp } from '../../../types/user';
import prisma from '../../../libs/prisma/index';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { password, email, firstName, lastName }: ISingUp = req.body
        const user = await prisma.user.findUnique({ where: { email: email } })
        try {

            if (!user) {
              
                if (password && lastName && firstName && email) {

                  const isAdmin = (password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL)
                    const salt = genSaltSync(10);
                    const hashPassword = hashSync(password, salt)
                    const UserData = await prisma.user.create({
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hashPassword,
                            role: isAdmin ? "ADMIN" : "USER"
                        }
                    })

                    const token = jwt.sign({ id: UserData.id, role: UserData.role }, process.env.SECRET_KEY as string, { expiresIn: '2h' })
                    
                    const fullYear = 1000 * 60 * 60 * 24 * 365;
                    
                    const refreshToken = jwt.sign({ id: UserData.id, role: UserData.role }, process.env.SECRET_KEY as string, { expiresIn: fullYear })


                    setCookie("refresh-token", refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: fullYear, // full year
                        expires: new Date(Date.now() + fullYear),
                        path: "/",
                        req,
                        res
                    })
                    const data = { 
                        id: UserData.id, 
                        createdAt: UserData.createdAt, 
                        email: UserData.email, 
                        lastName: UserData.lastName, 
                        firstName: UserData.firstName, 
                        token,
                        role: UserData.role
                     } 

                    return res.status(200).json({ data, massage: "sing up success" })
                }
                else return res.status(400).json({ error: 'you must fill all fields' })
            }
            else return res.status(400).json({ error: "user already exist try login" })
        } catch (error) {
            return res.status(500).json({ massage: 'server error' })
        }
    }
    else return res.status(404).json({ massage: `this method ${req.method} is not allowed` })
}

export default handler;