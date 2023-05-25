import "@/styles/globals.css"
import { Metadata } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import IpInput from "@/components/ipinput"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: "GeoIP",
    template: `%s - GeoIP`,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="zh" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <section className="flex justify-center items-center container pb-8 pt-6 md:py-10">
                <div className="max-w-[500px] flex-col items-start">
                  <Card>
                    <CardHeader className="p-2">
                    </CardHeader>
                    <CardContent>{children}</CardContent>
                    <CardFooter className="flex gap-2">
                      <IpInput />
                    </CardFooter>
                  </Card>
                </div>
              </section>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
