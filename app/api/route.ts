import { NextRequest } from "next/server"

import { ipdata } from "@/lib/utils"

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(ipdata(request.ip || "awdad")))
}
