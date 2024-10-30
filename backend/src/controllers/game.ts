import { prisma } from "../database";

interface RegisterMatchDto {
  score: number;
}

export class GameController {
  static async registerMatch(req, res) {
    const { score }: RegisterMatchDto = req.body;
    const user = req.user;

    if (!score || score <= 0) {
      return res.status(400).json({ error: "Score valido deve ser informado" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { totalScore: { increment: score } },
    });

    return res.status(200).send();
  }

  static async getLeaderboard(req, res) {
    const users = await prisma.user.findMany({
      orderBy: { totalScore: "desc" },
      select: { name: true, totalScore: true },
    });

    return res.status(200).send(users);
  }

  static async getRanking(req, res) {
    const user = req.user;

    const users = await prisma.user.findMany({
      orderBy: { totalScore: "desc" },
      select: { id: true, name: true, totalScore: true },
    });

    const raking = users.findIndex((a) => a.id === user.id) + 1;

    return res.status(200).send(raking);
  }
}
