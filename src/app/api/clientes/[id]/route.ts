// app/api/clientes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

  const { id } = params;

  const numericId = Number(id);

  if (!id) {
    return NextResponse.json({ error: "ID não informado." }, { status: 400 });
  }

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const { nome, telefone } = await req.json();

  if (!nome || !telefone) {
    return NextResponse.json(
      { error: "Nome e telefone são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const cliente = await prisma.cliente.update({
      where: { id: numericId },
      data: { nome, telefone },
      select: { id: true, nome: true, telefone: true, cpf: true },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar cliente." },
      { status: 500 }
    );
  }
}
