"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PracticeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="max-w-lg mx-auto mt-20 text-center">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h2 className="text-2xl font-black text-deep-forest mb-3">Something went wrong</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">
            An unexpected error occurred during your practice session. Your progress has been saved.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
