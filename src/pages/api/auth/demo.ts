import type { NextApiRequest, NextApiResponse } from 'next'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../libs/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {

        try {
            const fullYear = 1000 * 60 * 60 * 24 * 365;

            const demo = {
                email: "demo@gmail.com",
                firstName: "demo",
                lastName: "demo",
                password: "demo",
            }

            const user = await prisma.user.findFirst({
                where: { email: demo.email },
                select: {
                    id: true,
                    createdAt: true,
                    email: true,
                    lastName: true,
                    firstName: true,
                    role: true
                }
            });


            if (!user) {
                const salt = genSaltSync(10);
                const hashPassword = hashSync(demo.password, salt);

                const UserData = await prisma.user.create({
                    data: {
                        firstName: demo.firstName,
                        lastName: demo.lastName,
                        email: demo.email,
                        password: hashPassword,
                        role: "ADMIN"
                    }
                })

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

                return res.status(200).json({ data, massage: "login success as demo" })

            } else {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY!, { expiresIn: fullYear })

                res.setHeader('Set-Cookie', [
                    `token=${token}; HttpOnly; SameSite=strict Expires=${new Date(Date.now() + fullYear)}; Path=/; Max-Age=${fullYear}; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
                ]);

                const data = {
                    id: user.id,
                    createdAt: user.createdAt,
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    role: user.role
                }

                return res.status(200).json({ data: data, massage: "login success as demo" })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}

export default handler;
