import { Component, type ErrorInfo, type ReactNode } from "react";
// for learning only, no actual use in this app
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    // Chunks that fail to load often benefit from a full page reload 
    // to clear the module loader's state.
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="page-container" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>This usually happens when your internet connection is unstable while loading a new page.</p>
          <button 
            onClick={this.handleRetry}
            style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
          >
            Retry Loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;