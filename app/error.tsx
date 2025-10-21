"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Global error page:', error)
        }
    }, [error])
    return (
        <html>
            <body>
                <div className="container py-20 flex flex-col items-center gap-6 text-center">
                    <h1 className="text-2xl font-bold">Algo deu errado</h1>
                    <p className="text-muted-foreground max-w-md">Ocorreu um erro inesperado. Você pode tentar novamente.</p>
                    <div className="flex gap-3">
                        <Button onClick={() => reset()}>Tentar novamente</Button>
                        <Button variant="outline" onClick={() => window.location.href = '/'}>Ir para Home</Button>
                    </div>
                </div>
            </body>
        </html>
    )
}