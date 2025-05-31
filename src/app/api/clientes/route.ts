// app/api/clientes/route.ts (Next 13+)
import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { nome, cpf, telefone, senha } = await req.json();

  const existing = await prisma.cliente.findUnique({ where: { cpf } });

  if (existing) {
    return NextResponse.json({ error: "CPF já cadastrado." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(senha, 10);

  const cliente = await prisma.cliente.create({
    data: { nome, cpf, telefone, senha: hashed },
  });
  return NextResponse.json({ id: cliente.id, nome, cpf, telefone });
}
