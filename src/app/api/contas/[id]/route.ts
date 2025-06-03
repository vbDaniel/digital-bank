import { NextRequest, NextResponse } from "next/server";
import { deletarContaById, getContaById } from "services/conta";
import { getUserFromToken } from "utils/auth";

// GET /api/contas/:id - Detalhes de uma conta específica
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

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

// DELETE /api/contas?id=123 - Deletar conta do usuário
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = getUserFromToken(req);

  if (!user)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  if (!id)
    return NextResponse.json(
      { error: "ID da conta é obrigatório" },
      { status: 400 }
    );

  try {
    await deletarContaById(Number(id), user.id);
    return NextResponse.json({ message: "Conta deletada com sucesso" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
