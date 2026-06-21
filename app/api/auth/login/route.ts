import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  if (!username || !password || !expectedUsername || !expectedHash) {
    return NextResponse.json({ ok: false, error: "Login yoki parol xato" }, { status: 401 });
  }

  const actualHash = createHash("sha256").update(password).digest("hex");
  const usernameMatches = username === expectedUsername;
  const passwordMatches =
    actualHash.length === expectedHash.length &&
    timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ ok: false, error: "Login yoki parol xato" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
