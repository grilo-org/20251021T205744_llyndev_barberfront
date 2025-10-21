"use client"

import { useEffect, useState } from "react"
const STORAGE_KEY = "barbershop_sobre_conteudo"

export default function DynamicTitle({ suffix = "" }: { suffix?: string }) {
  const [nomeBarbearia, setNomeBarbearia] = useState("BarberStyle")

  useEffect(() => {
    const loadBarbershopName = () => {
      try {
        if (typeof window !== "undefined") {
          const savedData = localStorage.getItem(STORAGE_KEY)
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (parsedData.nomeBarbearia) {
              setNomeBarbearia(parsedData.nomeBarbearia)
              document.title = suffix ? `${parsedData.nomeBarbearia} - ${suffix}` : parsedData.nomeBarbearia
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar nome da barbearia:", error)
      }
    }
    loadBarbershopName()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadBarbershopName()
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [suffix])

  return null
}
