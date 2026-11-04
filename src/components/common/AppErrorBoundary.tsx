import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CampusMind page failed to render:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">This page could not be displayed</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your data is safe. Reload this page or return to the dashboard to continue.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button type="button" onClick={this.handleReload} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <button type="button" onClick={() => { window.location.href = '/app/dashboard'; }} className="btn-secondary">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}
