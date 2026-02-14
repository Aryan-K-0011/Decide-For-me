import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fix: Use Component explicitly and ensure generic types are passed correctly
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 text-center">
          <div className="glass-panel p-8 rounded-3xl border border-red-500/30 max-w-md w-full animate-fade-in-up">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h1>
            <p className="text-gray-400 mb-6 text-sm">
              We encountered an unexpected error. Don't worry, your decisions are safe.
            </p>
            
            {this.state.error && (
              <div className="bg-black/40 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40 border border-gray-700">
                <code className="text-red-300 text-xs font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                <RefreshCcw size={18} /> Reload App
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                <Home size={18} /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;