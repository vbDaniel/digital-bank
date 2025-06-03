import { NextRequest, NextResponse } from "next/server";
import { criarLancamento } from "services/lancamento";
import { getUserFromToken } from "utils/auth";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const user = getUserFromToken(req);

  if (!user)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { updatedAccount, transaction } = await criarLancamento(
      data,
      user.id
    );
    return NextResponse.json({ updatedAccount, transaction }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
