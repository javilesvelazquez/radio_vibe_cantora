import * as React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any)<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-3xl max-w-md w-full">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-white">Algo salió mal</h2>
            <p className="text-white/60 mb-8">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Recargar Página
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-black/40 rounded-xl text-left text-xs text-red-400 overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
