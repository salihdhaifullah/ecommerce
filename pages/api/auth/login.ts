import prisma from '../../../src/libs/prisma/index';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { ILogin } from '../../../src/types/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { email, password } = req.body as ILogin;
        const UserData = await prisma.user.findUnique({ where: { email: email } });
        try {

            if (!UserData) return res.status(400).json({ error: `user with this email ${email} dose not exist` })

            if (!(password.length > 6) && !UserData.password && !(email.length > 8))
            return res.status(400).json({ error: 'unValid Fields' });

            const isMatch = compareSync(password, UserData.password)

            if (!isMatch) return res.status(400).json({ error: `password is incorrect` })

            const fullYear = 1000 * 60 * 60 * 24 * 365;

            const token = jwt.sign({ id: UserData.id, role: UserData.role }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

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

            return res.status(200).json({ data, massage: "login success" })

        } catch (error) {
            return res.status(500).json({ massage: 'server error', error });
        }

    };
}

export default handler;
