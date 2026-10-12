import React from 'react';
import { ArrowRight, Tag, Mail, AppWindow, Clock, CheckCircle2, Clock3, AlertCircle, RefreshCw } from 'lucide-react';
import { UserDataLogRecord } from '../types';

interface RecentFeedProps {
  records: UserDataLogRecord[];
  onSelectMessageId: (id: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const RecentFeed: React.FC<RecentFeedProps> = ({
  records,
  onSelectMessageId,
  onRefresh,
  isLoading,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dispatched':
        return <span className="badge badge-dispatched"><CheckCircle2 className="w-3 h-3" /> Dispatched</span>;
      case 'acknowledged':
        return <span className="badge badge-acknowledged"><CheckCircle2 className="w-3 h-3" /> Acknowledged</span>;
      case 'queued':
        return <span className="badge badge-queued"><Clock3 className="w-3 h-3" /> Queued</span>;
      case 'failed':
        return <span className="badge badge-failed"><AlertCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="badge badge-type">{status}</span>;
    }
  };

  return (
    <div className="recent-feed-container glass-panel">
      <div className="feed-header">
        <div className="feed-header-left">
          <div className="live-pulse-dot" />
          <h3 className="feed-title">Live Ingested User-Data Logs</h3>
          <span className="badge badge-type">{records.length} recent entries</span>
        </div>
        <button
          onClick={onRefresh}
          className="btn btn-secondary btn-sm"
          disabled={isLoading}
          title="Refresh recent logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      <div className="feed-table-wrapper">
        <table className="feed-table">
          <thead>
            <tr>
              <th>Message ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>App</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-cell">
                  No logs ingested yet. Use the API simulator or FreelyEmail-API to send events.
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr key={r._id || i} className="feed-row" onClick={() => onSelectMessageId(r.messageId)}>
                  <td className="font-mono text-xs text-indigo-400">
                    <code>{r.messageId}</code>
                  </td>
                  <td>
                    <span className="badge badge-type">{r.type}</span>
                  </td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    <span className="feed-app-name">
                      <AppWindow className="w-3 h-3 text-slate-400" />
                      {r.app}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-slate-300">
                    {r.recipient || '-'}
                  </td>
                  <td className="feed-subject-cell" title={r.subject}>
                    {r.subject || '(no subject)'}
                  </td>
                  <td className="text-xs text-slate-400">
                    {new Date(r.timestamp || r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMessageId(r.messageId);
                      }}
                    >
                      <span>Trace</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentFeed;
