import { sendReminderAndRankEmail } from "./mailer";
import cron, { ScheduledTask } from "node-cron";
import { prisma } from "../database";

const cronUpdateLeaderboard: ScheduledTask = cron.schedule(
  "0 6 * * *",
  async () => {
    console.log("Updating leaderboard...");

    try {
      const users = await prisma.user.findMany({
        orderBy: { totalScore: "desc" },
      });

      console.log(users);

      users.forEach((user, index) => {
        sendReminderAndRankEmail({
          email: user.email,
          name: user.name,
          score: user.totalScore,
          rank: index + 1,
        });
      });
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  },
  { scheduled: true }
);

export { cronUpdateLeaderboard };
