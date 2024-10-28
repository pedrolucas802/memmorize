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
  }

  static async getLeaderboard() {
    const users = await prisma.user.findMany({
      orderBy: { totalScore: "desc" },
      select: { name: true, totalScore: true },
    });

    return users;
  }
}
