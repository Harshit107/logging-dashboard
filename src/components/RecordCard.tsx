import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Clock,
  Send,
  User,
  Mail,
  AppWindow,
  Tag,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileCode,
  Layers,
} from 'lucide-react';
import { UserDataLogRecord } from '../types';

interface RecordCardProps {
  record: UserDataLogRecord;
  index: number;
  totalRecords: number;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, index, totalRecords }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'json'>('details');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const dateObj = new Date(record.timestamp || record.createdAt);
  const formattedDate = dateObj.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dispatched':
        return (
          <span className="badge badge-dispatched">
            <CheckCircle2 className="w-3 h-3" />
            <span>Dispatched</span>
          </span>
        );
      case 'acknowledged':
        return (
          <span className="badge badge-acknowledged">
            <CheckCircle2 className="w-3 h-3" />
            <span>Acknowledged</span>
          </span>
        );
      case 'queued':
        return (
          <span className="badge badge-queued">
            <Clock3 className="w-3 h-3" />
            <span>Queued</span>
          </span>
        );
      case 'failed':
        return (
          <span className="badge badge-failed">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return <span className="badge badge-type">{status}</span>;
    }
  };

  return (
    <div className="record-card glass-panel">
      {/* Card Header */}
      <div className="record-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <div className="timeline-node">
            <span>#{index + 1}</span>
          </div>
          <div className="record-meta-main">
            <div className="meta-badges">
              {getStatusBadge(record.status)}
              <span className="badge badge-type">
                <Tag className="w-3 h-3" />
                <span>{record.type}</span>
              </span>
              <span className="record-app-name">
                <AppWindow className="w-3.5 h-3.5 text-slate-400" />
                <strong>{record.app}</strong>
              </span>
            </div>
            <div className="record-subject">
              {record.subject || '(No subject provided)'}
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="record-time">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
          <button className="expand-btn" aria-label="Toggle details">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      {isExpanded && (
        <div className="record-body">
          {/* Card Sub-Navigation */}
          <div className="card-subnav">
            <button
              className={`subnav-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Structured Attributes</span>
            </button>
            <button
              className={`subnav-btn ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw JSON Document</span>
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="details-grid-pane">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">
                    <User className="w-3.5 h-3.5" /> Sender
                  </span>
                  <span className="detail-value">{record.sender || 'FreelyEmail'}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Mail className="w-3.5 h-3.5" /> Recipient
                  </span>
                  <span className="detail-value font-mono text-indigo-300">
                    {record.recipient || '(Not specified)'}
                  </span>
                </div>

                {record.replyTo && (
                  <div className="detail-item">
                    <span className="detail-label">
                      <Send className="w-3.5 h-3.5" /> Reply-To
                    </span>
                    <span className="detail-value">{record.replyTo}</span>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Mongo Document ID</span>
                  <span className="detail-value font-mono text-xs text-slate-400">{record._id}</span>
                </div>
              </div>

              {record.metadata && Object.keys(record.metadata).length > 0 && (
                <div className="metadata-box">
                  <div className="metadata-title">Contextual Metadata</div>
                  <div className="metadata-tags">
                    {Object.entries(record.metadata).map(([k, v]) => (
                      <div key={k} className="meta-tag-pill">
                        <span className="meta-key">{k}:</span>
                        <span className="meta-val">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="json-inspector">
              <div className="json-header">
                <span className="json-title">Database JSON Document</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopy(JSON.stringify(record, null, 2), `raw_${record._id}`)}
                >
                  {copiedKey === `raw_${record._id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="json-code-block">
                <code>{JSON.stringify(record, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordCard;
