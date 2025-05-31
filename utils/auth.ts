import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getUserFromToken(
  req: NextRequest
): { id: number; cpf: string } | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      cpf: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
