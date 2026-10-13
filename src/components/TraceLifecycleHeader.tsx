import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Send,
  Mail,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  AppWindow,
  Tag,
  Eye,
  Inbox,
  FileCode,
} from 'lucide-react';
import { UserDataLogRecord } from '../types';

interface TraceLifecycleHeaderProps {
  messageId: string;
  records: UserDataLogRecord[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const LIFECYCLE_STAGES = [
  { id: 'queued', label: 'Queued', icon: Clock },
  { id: 'dispatched', label: 'Dispatched', icon: Send },
  { id: 'delivered', label: 'Delivered', icon: Inbox },
  { id: 'acknowledged', label: 'Acknowledged', icon: CheckCircle2 },
];

export const TraceLifecycleHeader: React.FC<TraceLifecycleHeaderProps> = ({
  messageId,
  records,
  onRefresh,
  isLoading = false,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!records || records.length === 0) return null;

  const latestRecord = records[records.length - 1];
  const firstRecord = records[0];

  const statusesPresent = new Set(records.map((r) => (r.status || '').toLowerCase()));
  const isFailed = statusesPresent.has('failed') || statusesPresent.has('bounced');
  const isOpened = statusesPresent.has('opened');

  const handleCopyId = () => {
    navigator.clipboard.writeText(messageId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyAllJson = () => {
    navigator.clipboard.writeText(JSON.stringify(records, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Determine active stage index
  const stageOrder = ['queued', 'dispatched', 'delivered', 'acknowledged'];
  let currentStageIndex = 0;
  for (let i = 0; i < stageOrder.length; i++) {
    if (statusesPresent.has(stageOrder[i])) {
      currentStageIndex = i;
    }
  }

  const firstDate = new Date(firstRecord.timestamp || firstRecord.createdAt || Date.now());
  const latestDate = new Date(latestRecord.timestamp || latestRecord.createdAt || Date.now());
  const elapsedMs = Math.max(0, latestDate.getTime() - firstDate.getTime());
  const elapsedFormatted =
    elapsedMs > 1000 ? `${(elapsedMs / 1000).toFixed(1)}s elapsed` : 'Instant';

  return (
    <div className="trace-lifecycle-panel glass-panel">
      {/* Top Bar: Message Identity & Quick Actions */}
      <div className="trace-top-bar">
        <div className="trace-identity">
          <div className="trace-status-pill-badge">
            <span className={`status-indicator-dot ${latestRecord.status}`} />
            <span className="status-name">
              {latestRecord.status.toUpperCase()}
            </span>
          </div>
          <div className="trace-id-group">
            <span className="trace-label">Message ID:</span>
            <code className="trace-message-id" title={messageId}>
              {messageId}
            </code>
            <button
              type="button"
              className="trace-copy-btn"
              onClick={handleCopyId}
              title="Copy Message ID"
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="trace-actions">
          <button
            type="button"
            className="trace-btn-action"
            onClick={handleCopyAllJson}
            title="Copy entire trace history as JSON"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Trace</span>
              </>
            ) : (
              <>
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy Full JSON</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="trace-btn-action"
            onClick={onRefresh}
            disabled={isLoading}
            title="Re-query central logging backend for latest status events"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Visual Lifecycle Stepper Pipeline */}
      <div className="lifecycle-stepper-container">
        <div className="stepper-track">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx <= currentStageIndex && !isFailed;
            const isCurrent = idx === currentStageIndex && !isFailed;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`stepper-step ${isCompleted ? 'completed' : ''} ${
                    isCurrent ? 'current' : ''
                  }`}
                >
                  <div className="step-circle">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="step-label">{stage.label}</span>
                </div>
                {idx < LIFECYCLE_STAGES.length - 1 && (
                  <div
                    className={`stepper-connector ${
                      idx < currentStageIndex && !isFailed ? 'filled' : ''
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* If failed / bounced, show terminal failure step */}
          {isFailed && (
            <>
              <div className="stepper-connector filled failure" />
              <div className="stepper-step failure current">
                <div className="step-circle">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="step-label">Failed / Bounced</span>
              </div>
            </>
          )}

          {/* If opened, show opened step */}
          {isOpened && (
            <>
              <div className="stepper-connector filled" />
              <div className="stepper-step completed">
                <div className="step-circle">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="step-label">Opened</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Summary Metadata Strip */}
      <div className="trace-summary-strip">
        <div className="summary-pill">
          <AppWindow className="w-3.5 h-3.5 text-indigo-400" />
          <span className="pill-label">App:</span>
          <span className="pill-value">{latestRecord.app}</span>
        </div>

        <div className="summary-pill">
          <Mail className="w-3.5 h-3.5 text-sky-400" />
          <span className="pill-label">To:</span>
          <span className="pill-value font-mono text-sky-300">
            {latestRecord.recipient || '(Unspecified)'}
          </span>
        </div>

        <div className="summary-pill">
          <Tag className="w-3.5 h-3.5 text-purple-400" />
          <span className="pill-label">Type:</span>
          <span className="pill-value">{latestRecord.type}</span>
        </div>

        <div className="summary-pill">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="pill-label">Trace Events:</span>
          <span className="pill-value">{records.length} record{records.length > 1 ? 's' : ''} ({elapsedFormatted})</span>
        </div>
      </div>
    </div>
  );
};

export default TraceLifecycleHeader;
