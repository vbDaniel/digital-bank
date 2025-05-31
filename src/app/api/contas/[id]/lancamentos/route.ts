import { NextRequest, NextResponse } from "next/server";
import { getLancamentosConta } from "services/lancamento";

import { getUserFromToken } from "utils/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const extrato = await getLancamentosConta(Number(params.id), user.id);
    return NextResponse.json(extrato);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
