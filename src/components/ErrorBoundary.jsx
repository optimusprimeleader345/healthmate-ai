import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (and could send to logging service)
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">
                    Something went wrong
                  </h1>
                  <p className="text-gray-600 text-sm">
                    We encountered an unexpected error. This has been logged and we're working to fix it.
                  </p>
                </div>

                {/* Error details (only in development) */}
                {import.meta.env.DEV && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                      Error Details
                    </summary>
                    <div className="bg-gray-100 p-3 rounded text-xs text-gray-800 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={this.handleReset}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>

                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    Reload App
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-4">
                  If this problem persists, please contact support or try clearing your browser cache.
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
