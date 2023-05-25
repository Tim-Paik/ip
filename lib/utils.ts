import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import IPDB from "./ipdb"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

class Cache {
  data: Buffer | undefined
  getData = async () => {
    if (!(this.data instanceof Buffer)) {
      console.log("requesting...................")
      this.data = Buffer.from(
        await (
          await fetch("https://cdn.jsdelivr.net/npm/qqwry.ipdb/qqwry.ipdb", {
            cache: "force-cache",
          })
        ).arrayBuffer()
      )
    }
    return this.data
  }
}
const cache = new Cache()

export async function ipdata(ipaddr: string) {
  const ipdb = new IPDB(await cache.getData())
  return ipdb.find(ipaddr, "CN")
}
