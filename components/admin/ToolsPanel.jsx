import React, { useState } from 'react';

// Keyword Checker Tool Component
function KeywordCheckerTool({ tool, loading, result, runTool, textColor }) {
  const [keywords, setKeywords] = useState('');

  const handleRun = () => {
    const value = (keywords || '').trim();
    if (!value) return;
    // จำกัดความยาวเพื่อความปลอดภัยและประสิทธิภาพ
    const limited = value.slice(0, 500);
    runTool(tool.id, tool.endpoint, 'POST', { keywords: limited });
  };

  return (
    <div className="w-full p-4 rounded-lg border-2 transition-all duration-200 text-left bg-white border-gray-300">
      <h4 className={`font-semibold font-prompt text-sm ${textColor}`}>{tool.nameTh}</h4>
      <p className="text-xs text-gray-500 mt-1">{tool.name}</p>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
      <input
        type="text"
        className="form-input mt-2 w-full border-gray-300 focus:border-primary rounded"
        placeholder="คีย์เวิร์ด (คั่นด้วย , หรือ เว้นวรรค)"
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
        disabled={loading}
        maxLength={500}
        aria-label="กรอกคีย์เวิร์ดเพื่อวิเคราะห์"
      />
      <button
        onClick={handleRun}
        disabled={loading || !keywords.trim()}
        aria-busy={loading ? 'true' : 'false'}
        className={`mt-2 px-4 py-1 rounded btn-primary font-prompt text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        ตรวจสอบ
      </button>
      {loading && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          กำลังตรวจสอบ...
        </div>
      )}
      {result && (
        <div
          className={`mt-2 p-3 rounded-lg border ${
            result.success === false || result.error || result.ok === false
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}
        >
          <p
            className={`text-xs font-semibold mb-1 ${
              result.success === false || result.error || result.ok === false
                ? 'text-red-700'
                : 'text-green-700'
            }`}
          >
            {result.success === false || result.error || result.ok === false
              ? '❌ ไม่พบคีย์เวิร์ดหรือเกิดข้อผิดพลาด'
              : '✅ พบคีย์เวิร์ดครบถ้วน'}
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
              ดูรายละเอียด
            </summary>
            <pre className="mt-2 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs max-h-40 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// Result Display Component
function ResultDisplay({ result, toolId }) {
  if (!result) return null;

  const { success, error } = result;

  // Performance Metrics Display
  if (toolId === 'performance-metrics' && result.metrics) {
    const { metrics, status } = result;
    const score = status?.score || 0;

    return (
      <div className="mt-3 space-y-3">
        {/* Score Circle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${(score / 100) * 175.93} 175.93`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{score}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Performance Score</p>
              <p className="text-xs text-gray-500">{status?.overall || 'good'}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">Response Time</p>
            <p className="text-xl font-bold text-blue-700">{metrics.server?.responseTime}ms</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-600 font-medium">Memory Used</p>
            <p className="text-xl font-bold text-green-700">
              {metrics.server?.memoryUsage?.heapUsed}MB
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-medium">Uptime</p>
            <p className="text-xl font-bold text-purple-700">
              {Math.round(metrics.server?.uptime / 60)}m
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-600 font-medium">API Health</p>
            <p className="text-xl font-bold text-orange-700">{metrics.api?.responseTime}ms</p>
          </div>
        </div>
      </div>
    );
  }

  // Lighthouse Score Display
  if (toolId === 'lighthouse-score' && result.lighthouse) {
    const { lighthouse } = result;
    const categories = lighthouse.categories || {};

    return (
      <div className="mt-3 space-y-3">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-4">
          <p className="text-sm font-medium opacity-90">Overall Score</p>
          <p className="text-4xl font-bold">{lighthouse.overallScore}</p>
          <p className="text-xs opacity-80 mt-1">{lighthouse.status}</p>
        </div>

        {/* Category Scores */}
        <div className="space-y-2">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{cat.title}</span>
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(cat.score * 100)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    cat.score >= 0.9
                      ? 'bg-green-500'
                      : cat.score >= 0.7
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${cat.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Security Scan Display
  if (toolId === 'security-scan' && result.scan) {
    const { scan } = result;
    const { summary, checks } = scan;

    return (
      <div className="mt-3 space-y-3">
        {/* Security Score */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{summary?.passed || 0}</p>
            <p className="text-xs text-green-600">Passed</p>
          </div>
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{summary?.failed || 0}</p>
            <p className="text-xs text-red-600">Failed</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{summary?.warnings || 0}</p>
            <p className="text-xs text-yellow-600">Warnings</p>
          </div>
        </div>

        {/* Overall Status */}
        <div
          className={`rounded-lg p-4 ${
            scan.status === 'excellent'
              ? 'bg-green-100 border border-green-300'
              : scan.status === 'good'
                ? 'bg-blue-100 border border-blue-300'
                : scan.status === 'warning'
                  ? 'bg-yellow-100 border border-yellow-300'
                  : 'bg-red-100 border border-red-300'
          }`}
        >
          <p className="font-bold text-lg">Security Score: {scan.score}/100</p>
          <p className="text-sm mt-1">Status: {scan.status}</p>
        </div>

        {/* Security Checks */}
        <div className="space-y-1">
          {checks &&
            checks.map((check, idx) => (
              <div
                key={`${check.id || check.name || check.nameTh || 'check'}-${idx}`}
                className="flex items-center gap-2 bg-gray-50 rounded p-2"
              >
                <span
                  className={`text-lg ${check.status?.passed ? '✅' : check.status?.warning ? '⚠️' : '❌'}`}
                >
                  {check.status?.passed ? '✅' : check.status?.warning ? '⚠️' : '❌'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.nameTh || check.name}</p>
                  <p className="text-xs text-gray-600">{check.status?.message}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Backup Status Display
  if (toolId === 'backup-status' && result.backup) {
    const { backup } = result;

    return (
      <div className="mt-3 space-y-3">
        {/* Status Badge */}
        <div
          className={`rounded-lg p-4 ${
            backup.status === 'good'
              ? 'bg-green-100 border border-green-300'
              : backup.status === 'warning'
                ? 'bg-yellow-100 border border-yellow-300'
                : 'bg-red-100 border border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {backup.status === 'good' ? '✅' : backup.status === 'warning' ? '⚠️' : '❌'}
            </span>
            <div>
              <p className="font-bold text-lg">{backup.message}</p>
              {backup.lastBackup && (
                <p className="text-sm mt-1">Last backup: {backup.lastBackup.age}</p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        {backup.statistics && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600">Total Backups</p>
              <p className="text-2xl font-bold text-blue-700">{backup.statistics.total}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600">Total Size</p>
              <p className="text-2xl font-bold text-purple-700">{backup.statistics.totalSize}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Core Web Vitals Display
  if (toolId === 'core-web-vitals' && result.vitals) {
    const { vitals } = result;
    const metrics = vitals.metrics || {};

    return (
      <div className="mt-3 space-y-3">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4">
          <p className="text-sm font-medium opacity-90">Web Vitals Score</p>
          <p className="text-4xl font-bold">{vitals.overall?.score || 0}</p>
          <p className="text-xs opacity-80 mt-1">{vitals.overall?.status}</p>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          {Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">{metric.nameTh}</p>
                  <p className="text-xs text-gray-500">{metric.name}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    metric.rating === 'good'
                      ? 'bg-green-100 text-green-700'
                      : metric.rating === 'needs-improvement'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {metric.value} {metric.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.rating === 'good'
                        ? 'bg-green-500'
                        : metric.rating === 'needs-improvement'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (metric.value / (metric.threshold?.poor || metric.value * 2)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {metric.rating === 'good' ? '✓' : '!'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Debug Environment Display
  if (toolId === 'debug-env' && result.envVars) {
    return (
      <div className="mt-3 space-y-2">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Environment Variables</p>
          <div className="space-y-1">
            {Object.entries(result.envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-mono">{key}</span>
                <span className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        {result.clientVars && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-700 mb-2">Client Variables</p>
            <div className="space-y-1">
              {Object.entries(result.clientVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-blue-600 font-mono">{key}</span>
                  <span className="text-blue-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Debug Environment (for debug-env-test)
  if (toolId === 'debug-env-test' && result.envVars) {
    return (
      <div className="mt-3 space-y-2">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Environment Variables</p>
          <div className="space-y-1">
            {Object.entries(result.envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-mono">{key}</span>
                <span className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Analytics Display
  if (toolId === 'analytics' && result.metrics) {
    return (
      <div className="mt-3 space-y-2">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-indigo-700 mb-2">Analytics Data</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="text-indigo-700 font-medium">{result.metrics.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">URL:</span>
              <span className="text-indigo-700 font-mono">{result.metrics.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp:</span>
              <span className="text-indigo-700">
                {new Date(result.metrics.timestamp).toLocaleString('th-TH')}
              </span>
            </div>
            {result.metrics.ip && (
              <div className="flex justify-between">
                <span className="text-gray-600">IP:</span>
                <span className="text-indigo-700 font-mono">{result.metrics.ip}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error Logs Display
  if (toolId === 'error-logs' && result.logs) {
    const { logs } = result;
    return (
      <div className="mt-3 space-y-2">
        <div
          className={`rounded-lg p-3 ${
            logs.status === 'healthy'
              ? 'bg-green-50 border border-green-200'
              : logs.status === 'warning'
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Error Status</p>
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                logs.status === 'healthy'
                  ? 'bg-green-100 text-green-700'
                  : logs.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {logs.status}
            </span>
          </div>
          <p className="text-xs text-gray-600">{logs.message}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-gray-700">{logs.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-orange-700">{logs.last24Hours}</p>
            <p className="text-xs text-orange-600">Last 24h</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-purple-700">
              {Object.keys(logs.byType || {}).length}
            </p>
            <p className="text-xs text-purple-600">Types</p>
          </div>
        </div>

        {logs.recentErrors && logs.recentErrors.length > 0 && (
          <details className="bg-white border border-gray-200 rounded-lg p-2">
            <summary className="text-xs font-semibold text-gray-700 cursor-pointer">
              Recent Errors ({logs.recentErrors.length})
            </summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {logs.recentErrors.slice(0, 5).map((err, idx) => (
                <div
                  key={`${err.id || err.timestamp || err.message || 'err'}-${idx}`}
                  className="text-xs bg-gray-50 p-2 rounded"
                >
                  <p className="text-red-600 font-medium">{err.message || err.level}</p>
                  <p className="text-gray-500">{new Date(err.timestamp).toLocaleString('th-TH')}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  }

  // Activity Logs Display
  if (toolId === 'activity-logs' && result.logs) {
    const { logs } = result;
    return (
      <div className="mt-3 space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-700 mb-1">Activity Summary</p>
          <p className="text-xs text-blue-600">{logs.message}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-gray-700">{logs.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-green-700">{logs.last24Hours}</p>
            <p className="text-xs text-green-600">Last 24h</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-purple-700">
              {Object.keys(logs.byType || {}).length}
            </p>
            <p className="text-xs text-purple-600">Actions</p>
          </div>
        </div>

        {logs.byUser && Object.keys(logs.byUser).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-700 mb-2">By User</p>
            <div className="space-y-1">
              {Object.entries(logs.byUser).map(([user, count]) => (
                <div key={user} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{user}</span>
                  <span className="text-blue-700 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {logs.recentActivities && logs.recentActivities.length > 0 && (
          <details className="bg-white border border-gray-200 rounded-lg p-2">
            <summary className="text-xs font-semibold text-gray-700 cursor-pointer">
              Recent Activities ({logs.recentActivities.length})
            </summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {logs.recentActivities.slice(0, 10).map((activity, idx) => (
                <div
                  key={`${activity.id || activity.user || 'activity'}-${activity.timestamp || idx}`}
                  className="text-xs bg-gray-50 p-2 rounded"
                >
                  <p className="text-blue-600 font-medium">{activity.action}</p>
                  <p className="text-gray-500">
                    {activity.user} • {new Date(activity.timestamp).toLocaleString('th-TH')}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  }

  // Default Display for other results
  return (
    <div className="mt-3">
      <div
        className={`rounded-lg p-4 ${
          success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="text-xl">{success ? '✅' : '❌'}</span>
          <div className="flex-1">
            <p className={`font-semibold ${success ? 'text-green-800' : 'text-red-800'}`}>
              {success ? 'Success' : 'Error'}
            </p>
            {result.message && <p className="text-sm text-gray-700 mt-1">{result.message}</p>}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            {result.recommendations && (
              <ul className="mt-2 space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li
                    key={`${String(rec).slice(0, 30)}-${idx}`}
                    className="text-xs text-gray-600 flex items-start gap-1"
                  >
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolsPanel() {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({
    health: true,
    testing: false,
    cache: false,
    seo: false,
    social: false,
    debug: false,
  });

  // อ่าน token ป้องกัน CSRF จาก cookie ถ้ามี
  const getCookie = name => {
    if (typeof document === 'undefined') return '';
    // escape RegExp special chars in name
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  };

  // fetch พร้อม timeout เพื่อกันค้าง
  const fetchWithTimeout = async (resource, options = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(resource, { ...options, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

  const toggleCategory = categoryId => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const runTool = async (toolId, endpoint, method = 'GET', body = null) => {
    setLoading(prev => ({ ...prev, [toolId]: true }));
    setResults(prev => ({ ...prev, [toolId]: null }));

    try {
      const csrfToken = getCookie('__Host-csrfToken') || getCookie('csrfToken');
      const options = {
        method,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
      };

      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }

      const response = await fetchWithTimeout(endpoint, options, 20000);

      // Handle authentication errors
      if (response.status === 401) {
        setResults(prev => ({
          ...prev,
          [toolId]: {
            success: false,
            error: 'Unauthorized',
            message: '🔐 กรุณา login ก่อนใช้งานเครื่องมือนี้',
            needsAuth: true,
          },
        }));
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      // Try to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, [toolId]: data }));
    } catch (error) {
      // จัดการ timeout หรือการยกเลิก
      const isAbort = error?.name === 'AbortError';
      const friendly = isAbort
        ? '⏱️ คำขอหมดเวลา (timeout) กรุณาลองใหม่'
        : error.message.includes('Failed to fetch')
          ? '❌ ไม่สามารถเชื่อมต่อ API ได้ กรุณาตรวจสอบ server'
          : '❌ ไม่สามารถดำเนินการได้';
      setResults(prev => ({
        ...prev,
        [toolId]: {
          success: false,
          error: friendly,
          message: friendly,
          __errorDetails: error.message,
        },
      }));
    } finally {
      setLoading(prev => ({ ...prev, [toolId]: false }));
    }
  };

  // SVG Icons
  const icons = {
    chevronDown: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    health: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    test: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    cache: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
    seo: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    social: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
    debug: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  };

  const revalidateSecret = (process.env.NEXT_PUBLIC_REVALIDATE_SECRET || '').trim();
  const rescrapeSecret = (process.env.NEXT_PUBLIC_RESCRAPE_SECRET || '').trim();

  const toolCategories = [
    {
      id: 'health',
      title: 'System Health',
      titleTh: 'สถานะระบบ',
      icon: icons.health,
      color: 'from-primary to-blue-700',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      textColor: 'text-primary',
      tools: [
        {
          id: 'health-check',
          name: 'Health Check',
          nameTh: 'ตรวจสอบสถานะ',
          description: 'ตรวจสอบสถานะระบบทั้งหมด',
          endpoint: '/api/health',
        },
        {
          id: 'test-shopify-health',
          name: 'Shopify Status',
          nameTh: 'สถานะ Shopify',
          description: 'ตรวจสอบการเชื่อมต่อ Shopify API',
          endpoint: '/api/test-shopify',
        },
        {
          id: 'test-email-health',
          name: 'Email Status',
          nameTh: 'สถานะอีเมล',
          description: 'ตรวจสอบระบบส่งอีเมล',
          endpoint: '/api/test-email',
          method: 'GET',
        },
      ],
    },
    {
      id: 'testing',
      title: 'Testing',
      titleTh: 'ทดสอบระบบ',
      icon: icons.test,
      color: 'from-accent to-orange-600',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/20',
      textColor: 'text-accent',
      tools: [
        {
          id: 'test-shopify',
          name: 'Test Shopify API',
          nameTh: 'ทดสอบ Shopify',
          description: 'ทดสอบการเชื่อมต่อ Shopify GraphQL',
          endpoint: '/api/test-shopify',
        },
        {
          id: 'test-email',
          name: 'Test Email Service',
          nameTh: 'ทดสอบอีเมล',
          description: 'ทดสอบระบบส่งอีเมล EmailJS',
          endpoint: '/api/test-email',
          method: 'GET',
        },
        {
          id: 'debug-env-test',
          name: 'Debug Environment',
          nameTh: 'ตรวจสอบ ENV',
          description: 'ตรวจสอบ Environment Variables',
          endpoint: '/api/debug-env',
        },
      ],
    },
    {
      id: 'cache',
      title: 'Cache Management',
      titleTh: 'จัดการ Cache',
      icon: icons.cache,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      tools: [
        {
          id: 'cache-revalidate',
          name: 'Revalidate All',
          nameTh: 'รีเฟรชทั้งหมด',
          description: 'รีเฟรชหน้าเว็บทั้งหมด',
          endpoint: '/api/revalidate',
          method: 'POST',
          body: {
            ...(revalidateSecret ? { secret: revalidateSecret } : {}),
            paths: ['/', '/all-cars', '/about', '/contact', '/promotion'],
          },
        },
        {
          id: 'cache-home',
          name: 'Revalidate Home',
          nameTh: 'รีเฟรชหน้าแรก',
          description: 'รีเฟรชหน้าแรกเท่านั้น',
          endpoint: '/api/revalidate',
          method: 'POST',
          body: {
            ...(revalidateSecret ? { secret: revalidateSecret } : {}),
            paths: ['/'],
          },
        },
        {
          id: 'cache-cars',
          name: 'Revalidate Cars',
          nameTh: 'รีเฟรชรถทั้งหมด',
          description: 'รีเฟรชหน้ารายการรถ',
          endpoint: '/api/revalidate',
          method: 'POST',
          body: {
            ...(revalidateSecret ? { secret: revalidateSecret } : {}),
            paths: ['/all-cars'],
          },
        },
        {
          id: 'cache-force',
          name: 'Force Revalidate',
          nameTh: 'บังคับรีเฟรช',
          description: 'บังคับรีเฟรชแบบเต็มรูปแบบ',
          endpoint: '/api/revalidate',
          method: 'POST',
          body: {
            ...(revalidateSecret ? { secret: revalidateSecret } : {}),
            paths: ['/', '/all-cars', '/about', '/contact', '/promotion'],
            force: true,
          },
        },
        {
          id: 'cache-no-cache',
          name: 'No Cache Policy',
          nameTh: 'ไม่ Cache',
          description: 'เนื้อหาล่าสุดเสมอ (HTML)',
          endpoint: '/api/cache-control?type=no-cache',
        },
        {
          id: 'cache-static',
          name: 'Static Assets Cache',
          nameTh: 'Cache Static',
          description: 'Cache CSS/JS/Fonts นาน',
          endpoint: '/api/cache-control?type=static&maxAge=31536000',
        },
        {
          id: 'cache-images',
          name: 'Images Cache',
          nameTh: 'Cache รูปภาพ',
          description: 'Cache รูปภาพพร้อม revalidation',
          endpoint: '/api/cache-control?type=images&maxAge=2592000',
        },
      ],
    },
    {
      id: 'seo',
      title: 'SEO & Indexing',
      titleTh: 'SEO และ Indexing',
      icon: icons.seo,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      tools: [
        {
          id: 'indexnow-home',
          name: 'IndexNow: Home',
          nameTh: 'IndexNow: หน้าแรก',
          description: 'ส่งหน้าแรกไป IndexNow',
          endpoint: '/api/indexnow',
          method: 'POST',
          body: { url: 'https://www.chiangmaiusedcar.com/' },
        },
        {
          id: 'indexnow-cars',
          name: 'IndexNow: Cars',
          nameTh: 'IndexNow: รถทั้งหมด',
          description: 'ส่งหน้ารถทั้งหมดไป IndexNow',
          endpoint: '/api/indexnow',
          method: 'POST',
          body: { url: 'https://www.chiangmaiusedcar.com/all-cars' },
        },
        {
          id: 'og-preview-home',
          name: 'OG Preview',
          nameTh: 'ตรวจสอบ OG',
          description: 'ตรวจสอบ Open Graph tags',
          endpoint: '/api/og-preview?url=/',
        },
        {
          id: 'keyword-checker',
          name: 'Keyword Checker',
          nameTh: 'ตรวจสอบคีย์เวิร์ด',
          description: 'ตรวจสอบคีย์เวิร์ดในหน้าแรก',
          endpoint: '/api/seo-keyword-check',
          custom: true,
        },
      ],
    },
    {
      id: 'social',
      title: 'Social Media',
      titleTh: 'โซเชียลมีเดีย',
      icon: icons.social,
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      tools: [
        {
          id: 'facebook-rescrape',
          name: 'Facebook Re-scrape',
          nameTh: 'รีเฟรช Facebook',
          description: 'รีเฟรช Open Graph cache ของ Facebook',
          endpoint:
            '/api/social/rescrape' +
            (rescrapeSecret ? `?secret=${encodeURIComponent(rescrapeSecret)}` : ''),
          method: 'POST',
        },
      ],
    },
    {
      id: 'debug',
      title: 'Debug & Monitor',
      titleTh: 'Debug และ Monitor',
      icon: icons.debug,
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      tools: [
        {
          id: 'debug-env',
          name: 'Environment',
          nameTh: 'ตัวแปร ENV',
          description: 'ตรวจสอบ ENV variables',
          endpoint: '/api/debug-env',
        },
        {
          id: 'analytics',
          name: 'Analytics Test',
          nameTh: 'ทดสอบ Analytics',
          description: 'ทดสอบส่งข้อมูล Analytics',
          endpoint: '/api/analytics',
          method: 'POST',
          body: {
            type: 'test',
            timestamp: new Date().toISOString(),
            url: '/admin/dashboard',
          },
        },
        {
          id: 'error-logs',
          name: 'Error Logs',
          nameTh: 'บันทึกข้อผิดพลาด',
          description: 'ดู Error logs ล่าสุด',
          endpoint: '/api/logs/errors',
        },
        {
          id: 'activity-logs',
          name: 'Activity Logs',
          nameTh: 'บันทึกกิจกรรม',
          description: 'ดูประวัติการใช้งาน',
          endpoint: '/api/logs/activity',
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance',
      titleTh: 'ประสิทธิภาพ',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      tools: [
        {
          id: 'performance-metrics',
          name: 'Performance Metrics',
          nameTh: 'วัดประสิทธิภาพ',
          description: 'ตรวจสอบความเร็วเว็บไซต์',
          endpoint: '/api/performance/metrics',
        },
        {
          id: 'lighthouse-score',
          name: 'Lighthouse Score',
          nameTh: 'คะแนน Lighthouse',
          description: 'ตรวจสอบคะแนน SEO/Performance',
          endpoint: '/api/performance/lighthouse',
        },
        {
          id: 'core-web-vitals',
          name: 'Core Web Vitals',
          nameTh: 'Core Web Vitals',
          description: 'LCP, FID, CLS metrics',
          endpoint: '/api/performance/vitals',
        },
      ],
    },
    {
      id: 'backup',
      title: 'Backup & Security',
      titleTh: 'สำรองข้อมูลและความปลอดภัย',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      tools: [
        {
          id: 'backup-status',
          name: 'Backup Status',
          nameTh: 'สถานะการสำรอง',
          description: 'ตรวจสอบการสำรองข้อมูล',
          endpoint: '/api/backup/status',
        },
        {
          id: 'create-backup',
          name: 'Create Backup',
          nameTh: 'สำรองข้อมูล',
          description: 'สำรองข้อมูลเว็บไซต์',
          endpoint: '/api/backup/create',
          method: 'POST',
          body: { timestamp: new Date().toISOString() },
        },
        {
          id: 'security-scan',
          name: 'Security Scan',
          nameTh: 'สแกนความปลอดภัย',
          description: 'ตรวจสอบช่องโหว่',
          endpoint: '/api/security/scan',
          method: 'POST',
        },
      ],
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      titleTh: 'ปิดปรับปรุง',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      tools: [
        {
          id: 'maintenance-status',
          name: 'Maintenance Mode Status',
          nameTh: 'สถานะปิดปรับปรุง',
          description: 'ตรวจสอบโหมดปิดปรับปรุง',
          endpoint: '/api/maintenance/status',
        },
        {
          id: 'enable-maintenance',
          name: 'Enable Maintenance',
          nameTh: 'เปิดโหมดปิดปรับปรุง',
          description: 'เปิดหน้าปิดปรับปรุงเว็บไซต์',
          endpoint: '/api/maintenance/enable',
          method: 'POST',
        },
        {
          id: 'disable-maintenance',
          name: 'Disable Maintenance',
          nameTh: 'ปิดโหมดปิดปรับปรุง',
          description: 'ปิดหน้าปิดปรับปรุงเว็บไซต์',
          endpoint: '/api/maintenance/disable',
          method: 'POST',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-primary to-blue-700">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-white font-prompt">Admin Tools Dashboard</h2>
              <p className="text-sm text-white/80 mt-0.5">เครื่องมือจัดการระบบทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Categories */}
      {toolCategories.map(category => (
        <div
          key={category.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {/* Category Header - Clickable */}
          <button
            onClick={() => toggleCategory(category.id)}
            className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
              expandedCategories[category.id] ? category.bgColor : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                <div className="text-white">{category.icon}</div>
              </div>
              <div className="text-left">
                <h3 className={`font-bold font-prompt ${category.textColor}`}>
                  {category.titleTh}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{category.title}</p>
              </div>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                {category.tools.length}
              </span>
            </div>
            <div
              className={`transition-transform duration-200 ${expandedCategories[category.id] ? 'rotate-180' : ''}`}
            >
              {icons.chevronDown}
            </div>
          </button>

          {/* Tools Grid - Collapsible */}
          {expandedCategories[category.id] && (
            <div className={`border-t ${category.borderColor}`}>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.tools.map(tool => (
                    <div key={tool.id} className="group">
                      {tool.custom ? (
                        <KeywordCheckerTool
                          tool={tool}
                          loading={loading[tool.id]}
                          result={results[tool.id]}
                          runTool={runTool}
                          textColor={category.textColor}
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => runTool(tool.id, tool.endpoint, tool.method, tool.body)}
                            disabled={loading[tool.id]}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                              loading[tool.id]
                                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                : `${category.borderColor} hover:border-current hover:shadow-md ${category.bgColor}`
                            }`}
                          >
                            <h4
                              className={`font-semibold font-prompt text-sm ${category.textColor}`}
                            >
                              {tool.nameTh}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{tool.name}</p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {tool.description}
                            </p>
                            {loading[tool.id] && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <svg
                                  className="animate-spin h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                กำลังประมวลผล...
                              </div>
                            )}
                          </button>

                          {/* Result Display */}
                          {results[tool.id] && (
                            <ResultDisplay result={results[tool.id]} toolId={tool.id} />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
