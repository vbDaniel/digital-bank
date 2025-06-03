import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

  const { cpf, senha } = await req.json();
  const cliente = await prisma.cliente.findUnique({
    where: { cpf },
    include: { contas: true },
  });

  if (!cliente || !(await bcrypt.compare(senha, cliente.senha))) {
    return NextResponse.json(
      { error: "CPF ou senha inválidos." },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: cliente.id, cpf: cliente.cpf },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return NextResponse.json({
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      contas: cliente.contas,
    },
    token,
  });
}
