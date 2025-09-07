import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
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
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-red-500 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 font-prompt">เกิดข้อผิดพลาด</h2>

              <p className="mt-2 text-gray-600 font-prompt">
                ขออภัย เกิดข้อผิดพลาดบางอย่างขึ้น กรุณาลองใหม่อีกครั้ง
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-red-600 font-semibold">
                    รายละเอียดข้อผิดพลาด (Development Mode)
                  </summary>
                  <pre className="mt-2 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800 overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.reset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-prompt"
                >
                  ลองใหม่
                </button>

                <button
                  onClick={() => (window.location.href = '/')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-prompt"
                >
                  กลับหน้าหลัก
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-500 font-prompt">
                หากปัญหายังคงเกิดขึ้น กรุณาติดต่อ{' '}
                <a href="tel:0940649018" className="text-primary hover:text-primary-700">
                  094-064-9018
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
