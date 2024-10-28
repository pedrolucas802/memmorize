import bcrypt from "bcryptjs";
import { prisma } from "../database";
import jwt from "jsonwebtoken";

export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  totalScore: number;
}

interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export class AuthController {
  static async login(req, res) {
    const { email, password }: LoginDto = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha invalidos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Email ou senha invalidos" });
    }

    delete user.password;
    const token: string = jwt.sign(user, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    return res.send({ token });
  }

  static async register(req, res) {
    const { email, name, password }: RegisterDto = req.body;

    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "Esse email ja esta em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return res.send(user);
  }
}
