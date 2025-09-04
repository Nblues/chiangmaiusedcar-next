import React from 'react';

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log client errors for debugging during dev
		if (typeof window !== 'undefined') {
			// eslint-disable-next-line no-console
			console.error('UI runtime error:', error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-6 m-4 rounded-md border border-red-200 bg-red-50 text-red-800 font-prompt">
					<h2 className="font-bold mb-2">เกิดข้อผิดพลาดในการแสดงผล</h2>
					<p className="mb-3">โปรดลองรีเฟรชหน้า หรือกลับไปหน้าแรกชั่วคราว</p>
					<div className="flex gap-3">
						<button className="btn-primary px-4 py-2 rounded" onClick={() => window.location.reload()}>
							รีเฟรชหน้า
						</button>
						<a href="/" className="btn-secondary px-4 py-2 rounded border">ไปหน้าแรก</a>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
