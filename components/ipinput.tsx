"use client"

import { useRouter } from "next/navigation"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function IpInput() {
  const router = useRouter()
  const goto = () => {
    let ipaddr = (document.getElementById("ipaddr") as HTMLInputElement).value
    if (ipaddr !== "") {
      router.push("/" + ipaddr)
    }
  }
  return (
    <>
      <Input id="ipaddr" type="text" placeholder="0.0.0.0" onSubmit={goto} />
      <Button onClick={goto} variant="outline" type="submit">
        CheckIP
      </Button>
    </>
  )
}
