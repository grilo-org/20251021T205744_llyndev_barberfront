"use client"
import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: any }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, info: any) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Boundary error:', error, info)
    }
  }
  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    if (typeof window !== 'undefined') window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-20 flex flex-col items-center gap-6 text-center">
          <h1 className="text-2xl font-bold">Ocorreu um erro</h1>
          <p className="text-muted-foreground max-w-md">Tente recarregar a página ou voltar mais tarde.</p>
          <Button onClick={this.handleReset}>Recarregar</Button>
        </div>
      )
    }
    return this.props.children
  }
}
