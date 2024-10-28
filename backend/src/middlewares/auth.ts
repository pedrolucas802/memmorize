import jwt from "jsonwebtoken";
import { prisma } from "../database";
import { LoggedUser } from "../controllers/auth";

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!authorization || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const data: LoggedUser = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as LoggedUser;

    if (!data) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: { id: data.id },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
