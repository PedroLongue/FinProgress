import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie.utils";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";

interface IAuthRequest extends Request {
  userId?: string;
}

const signToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definido");

  return jwt.sign({ id: userId }, secret, { expiresIn: "4d" });
};

const signResetToken = (userId: string) => {
  // token para recuperação de senha
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definido");

  return jwt.sign({ id: userId, purpose: "reset" }, secret, {
    expiresIn: "15m",
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(422).json({ errors: ["As senhas não coincidem."] });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const exists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (exists) return res.status(409).json({ errors: ["Email já cadastrado"] });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      isActive: true,
    },
  });

  const token = signToken(user.id);
  setAuthCookie(res, token);
  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) return res.status(401).json({ errors: ["Credenciais inválidas"] });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ errors: ["Senha inválida"] });

  const token = signToken(user.id);

  setAuthCookie(res, token);

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailNotificationsEnabled: user.emailNotificationsEnabled,
      notificationsEnabled: user.notificationsEnabled,
      telegramNotificationsEnabled: user.telegramNotificationsEnabled,
      billReminderDays: user.billReminderDays,
    },
  });
};

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.status(204).send();
};

export const getCurrentUser = async (req: IAuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      isActive: true,
      billReminderDays: true,
      emailNotificationsEnabled: true,
      notificationsEnabled: true,
      telegramNotificationsEnabled: true,
      telegramChatId: true,
    },
  });

  if (!user)
    return res.status(404).json({ errors: ["Usuário não encontrado"] });
  return res.json({ user });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      isActive: true,
    },
  });

  if (!user)
    return res.status(404).json({ errors: ["Usuário não encontrado"] });

  return res.json({ user });
};

export const updateUserPhone = async (req: IAuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });
  const { phone } = req.body;

  const normalizedPhone =
    phone === null || phone === undefined ? null : String(phone).trim();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { phone: normalizedPhone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      isActive: true,
    },
  });

  return res.json({ user: updatedUser });
};

export const updateUserPassword = async (req: IAuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword === currentPassword) {
    return res
      .status(422)
      .json({ errors: ["A nova senha deve ser diferente da atual."] });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user)
    return res.status(404).json({ errors: ["Usuário não encontrado."] });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(401).json({ errors: ["Senha atual inválida."] });

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });

  return res.status(200).json({ message: "Senha atualizada com sucesso." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ errors: ["Preencha o campo email"] });
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return res.json({
      message:
        "Use o email cadastrado para receber instruções de redefinição de senha.",
    });
  }

  const token = signResetToken(user.id);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: normalizedEmail,
    subject: "Redefinição de senha",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.45; color: #111;">
      <h2 style="margin:0 0 12px 0;">Olá ${user.name},</h2>
      <p style="margin:0 0 12px 0;">Você solicitou redefinição de senha.</p>
      <p style="margin:0 0 12px 0;">Clique no link abaixo:</p>
      <a href="${resetLink}" target="_blank">Redefinir senha</a>
      <p style="margin:16px 0 0 0; color:#666; font-size:12px;">Este link expira em 15 minutos.</p>
      <p style="margin:16px 0 0 0; color:#666; font-size:12px;">Se você não solicitou, ignore este e-mail.</p>
      </div>
    `,
    text: `Redefina sua senha acessando: ${resetLink}`,
  });

  return res.json({
    message: "Instruções de redefinição de senha enviadas.",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (!token) {
    return res.status(400).json({ errors: ["Token obrigatório."] });
  }

  if (!newPassword || !confirmNewPassword) {
    return res.status(400).json({ errors: ["Senha obrigatória."] });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(422).json({ errors: ["As senhas não coincidem."] });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não definido");

    const payload = jwt.verify(token, secret) as {
      id: string;
      purpose?: string;
    };

    if (payload.purpose !== "reset") {
      return res.status(400).json({ errors: ["Token inválido."] });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.id },
      data: { password: passwordHash },
    });

    return res.status(200).json({
      message: "Senha redefinida com sucesso.",
    });
  } catch {
    return res.status(400).json({
      errors: ["Token inválido ou expirado."],
    });
  }
};
