import { NextRequest, NextResponse } from "next/server";
import { getContaById } from "services/conta";
import { getUserFromToken } from "utils/auth";

// GET /api/contas/:id - Detalhes de uma conta específica
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const contaId = Number(params.id);

  if (isNaN(contaId))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const conta = await getContaById(contaId, user.id);
    return NextResponse.json(conta);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
