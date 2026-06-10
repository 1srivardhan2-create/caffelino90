import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Clipboard, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside Caffélino:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleCopyError = async () => {
    if (!this.state.error) return;
    const errorDetails = `
Error: ${this.state.error.message}
Stack Trace:
${this.state.error.stack || "N/A"}
Component Stack:
${this.state.errorInfo?.componentStack || "N/A"}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = window.location.origin;
    } catch (e) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center p-4 md:p-6 overflow-y-auto select-none"
          style={{
            backgroundImage: "linear-gradient(135deg, rgb(62, 39, 35) 0%, rgb(93, 64, 55) 50%, rgb(61, 40, 23) 100%)",
            fontFamily: "Inter, Roboto, sans-serif"
          }}
        >
          {/* Decorative Dotted Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div 
            className="w-full max-w-xl rounded-3xl p-6 md:p-8 backdrop-blur-xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)] text-white text-center flex flex-col items-center gap-6 transform transition-all scale-100"
            style={{
              background: "rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Pulsing Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse shadow-[0_0_24px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            {/* Error Message Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                Ouch! Something spilled... ☕
              </h1>
              <p className="text-sm md:text-base text-stone-300 max-w-md mx-auto">
                Caffélino ran into a little runtime hiccup. Don't worry, your coffee is still warm! Let's clean this up.
              </p>
            </div>

            {/* Collapsible Error Code box */}
            <div className="w-full text-left bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-xs md:text-sm max-h-[160px] overflow-y-auto custom-scrollbar select-text text-amber-200/90 shadow-inner">
              <div className="font-bold text-white/50 text-[10px] uppercase tracking-wider mb-2 border-b border-white/5 pb-1">
                ERROR DIAGNOSTICS:
              </div>
              <div className="font-semibold mb-1">
                {this.state.error?.name || "Error"}: {this.state.error?.message || "Unknown error occurred"}
              </div>
              <div className="text-[11px] leading-relaxed text-stone-400/90 whitespace-pre-wrap">
                {this.state.error?.stack || "No callstack available"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={this.handleCopyError}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white w-full sm:w-auto"
              >
                <Clipboard className="w-4 h-4 text-stone-300" />
                <span>{this.state.copied ? "Copied!" : "Copy Diagnostics"}</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl bg-amber-600 hover:bg-amber-500 active:scale-95 transition-all text-white shadow-lg shadow-amber-900/30 w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span>Reload App</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl border border-[#a88968]/30 bg-[#be9d80]/20 hover:bg-[#be9d80]/30 hover:border-[#a88968]/50 active:scale-95 transition-all text-[#f4eae1] w-full sm:w-auto"
              >
                <Home className="w-4 h-4 text-[#f4eae1]" />
                <span>Factory Reset</span>
              </button>
            </div>

            {/* Helpful advice */}
            <div className="text-[11px] text-stone-400 mt-2">
              If reloading does not solve this issue, please copy the diagnostics and contact support.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
