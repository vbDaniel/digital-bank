import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface RegisterType {
  nome: string;
  cpf: string;
  telefone: string;
  senha: string;
}

export async function registerCliente({
  nome,
  cpf,
  telefone,
  senha,
}: RegisterType) {
  const existing = await prisma.cliente.findUnique({ where: { cpf } });
  if (existing) throw new Error("CPF já cadastrado.");
  const hashed = await bcrypt.hash(senha, 10);
  const cliente = await prisma.cliente.create({
    data: { nome, cpf, telefone, senha: hashed },
  });

  return {
    id: cliente.id,
    nome: cliente.nome,
    cpf: cliente.cpf,
    telefone: cliente.telefone,
  };
}

export async function loginCliente({ cpf, senha }: RegisterType) {
  const cliente = await prisma.cliente.findUnique({ where: { cpf } });

  if (!cliente) throw new Error("CPF ou senha inválidos.");

  const valid = await bcrypt.compare(senha, cliente.senha);

  if (!valid) throw new Error("CPF ou senha inválidos.");

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign(
    { id: cliente.id, cpf: cliente.cpf },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    cliente: { id: cliente.id, nome: cliente.nome, cpf: cliente.cpf },
    token,
  };
}

export async function getClienteById(id: number) {
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    select: { id: true, nome: true, cpf: true, telefone: true },
  });
  if (!cliente) throw new Error("Usuário não encontrado.");
  return cliente;
}
