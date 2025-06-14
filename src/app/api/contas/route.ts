import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { criarConta, listarContas } from "services/conta";

import { getUserFromToken } from "utils/auth";

// POST /api/contas - Criar nova conta
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

  const user = getUserFromToken(req);

  if (!user)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome } = await req.json();
  if (!nome)
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

  try {
    const conta = await criarConta(user.id, nome);
    return NextResponse.json(conta, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// GET /api/contas - Listar contas do usuário ou todas
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

  const user = getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const getAll = url.searchParams.get("all") === "true";

  try {
    if (getAll) {
      const contas = await prisma.conta.findMany({
        include: {
          cliente: {
            select: {
              nome: true,
              cpf: true,
              telefone: true,
            },
          },
        },
      });

      return NextResponse.json(contas);
    } else {
      const contas = await listarContas(user.id);
      return NextResponse.json(contas);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
