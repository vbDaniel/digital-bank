import { NextRequest, NextResponse } from "next/server";
import { transferirEntreContas } from "services/lancamento";
import { getUserFromToken } from "utils/auth";

export async function POST(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await req.json();
  const { contaOrigemId, contaDestinoId, valor } = data;

  // Validações básicas
  if (!contaOrigemId || !contaDestinoId || !valor) {
    return NextResponse.json(
      { error: "Dados obrigatórios: contaOrigemId, contaDestinoId e valor." },
      { status: 400 }
    );
  }

  try {
    const result = await transferirEntreContas(
      {
        contaOrigemId: Number(contaOrigemId),
        contaDestinoId: Number(contaDestinoId),
        valor,
      },
      user.id
    );

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
