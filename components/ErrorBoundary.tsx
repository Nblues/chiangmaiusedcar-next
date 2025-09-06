import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: React.ErrorInfo | undefined;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error | undefined; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // ส่งข้อมูลข้อผิดพลาดไปยัง analytics (ถ้าต้องการ)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // สามารถส่งไป Vercel Analytics หรือ Google Analytics
      console.error('Error logged for analytics:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-prompt font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-6">
              ขออภัย เกิดข้อผิดพลาดขณะแสดงหน้านี้ กรุณาลองใหม่อีกครั้ง
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 bg-red-50 border border-red-200 rounded p-3">
                <summary className="font-medium text-red-800 cursor-pointer">
                  รายละเอียดข้อผิดพลาด (Development)
                </summary>
                <pre className="text-xs mt-2 text-red-700 whitespace-pre-wrap overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.reset}
                className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                ลองใหม่
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                กลับหน้าหลัก
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
