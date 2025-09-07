import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isFB = ua.includes("facebookexternalhit") || 
               ua.includes("facebot") || 
               ua.includes("whatsapp") ||
               ua.includes("twitterbot") ||
               ua.includes("telegrambot");
  
  // ถ้าเป็นบอท FB/Social ให้ปล่อยผ่านหน้า public ทั้งหมด ห้าม redirect ไปหน้าอื่น
  if (isFB) {
    return NextResponse.next();
  }

  // *** ใส่ logic redirect เดิมของโปรเจคหลังจากนี้ ***
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|assets|favicon.ico|robots.txt|sitemap.xml).*)"],
};
