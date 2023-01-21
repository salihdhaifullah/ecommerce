import type { NextApiRequest, NextApiResponse } from 'next'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ISingUp } from '../../../types/user';
import prisma from '../../../libs/prisma/index';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        try {
            const { password, email, firstName, lastName }: ISingUp = req.body;

            const user = await prisma.user.findFirst({where: { email: email }, select: { email: true } });

            if (!(password.length > 6) && !(lastName.length > 3) && !(firstName.length > 3) && !(email.length > 8)) return res.status(400).json({ error: 'unValid Fields' })

            if (user?.email) return res.status(400).json({ massage: "user already exist try login", user })


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

            const fullYear = 1000 * 60 * 60 * 24 * 365;

            const token = jwt.sign({ id: UserData.id, role: UserData.role }, process.env.SECRET_KEY!, { expiresIn: fullYear })

            res.setHeader('Set-Cookie', [
                `token=${token}; HttpOnly; SameSite=strict Expires=${new Date(Date.now() + fullYear)}; Path=/; Max-Age=${fullYear}; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
            ]);

            const data = {
                id: UserData.id,
                createdAt: UserData.createdAt,
                email: UserData.email,
                lastName: UserData.lastName,
                firstName: UserData.firstName,
                role: UserData.role
            }

            return res.status(200).json({ data, massage: "sing up success" })

        } catch (error) {
            return res.status(500).json({ massage: 'server error' })
        }

    }
}

export default handler;
