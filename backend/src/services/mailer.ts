import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

export interface ISendReminderAndRankEmail {
  email: string;
  name: string;
  score: number;
  rank: number;
}

export const sendReminderAndRankEmail = async ({
  email,
  name,
  score,
  rank,
}: ISendReminderAndRankEmail): Promise<void> => {
  transporter.sendMail({
    to: email,
    subject: "Lembrete para jogar",
    text: `Ola ${name}, não se esqueça de continuar jogando!\nSua pontuação atual é ${score} e seu rank é ${rank}.\nPara jogar, basta clicar no link abaixo:\n\n${process.env.FRONTEND_URL}`,
  });
};
