import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  Send,
  Sparkles,
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { updateLogByMessageId } from '../services/api';

interface LogUpdaterProps {
  initialMessageId?: string;
  onUpdated?: (messageId: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'dispatched', label: 'Dispatched', color: 'indigo' },
  { value: 'delivered', label: 'Delivered', color: 'emerald' },
  { value: 'acknowledged', label: 'Acknowledged', color: 'cyan' },
  { value: 'opened', label: 'Opened', color: 'purple' },
  { value: 'queued', label: 'Queued', color: 'amber' },
  { value: 'failed', label: 'Failed', color: 'rose' },
  { value: 'bounced', label: 'Bounced', color: 'red' },
];

export const LogUpdater: React.FC<LogUpdaterProps> = ({ initialMessageId = '', onUpdated }) => {
  const [messageId, setMessageId] = useState(initialMessageId);
  const [status, setStatus] = useState<string>('delivered');
  const [recipient, setRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [app, setApp] = useState<string>('');
  const [metadataJson, setMetadataJson] = useState<string>(
    JSON.stringify({ updatedVia: 'Dashboard UI', deliveryAttempt: 1 }, null, 2)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if initialMessageId changes
  useEffect(() => {
    if (initialMessageId) {
      setMessageId(initialMessageId);
    }
  }, [initialMessageId]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setMessageId(text.trim());
    } catch (e) {
      // ignore clipboard error
    }
  };

  const handleQuickPreset = (presetStatus: string, presetMeta: Record<string, any>) => {
    setStatus(presetStatus);
    setMetadataJson(JSON.stringify(presetMeta, null, 2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageId.trim()) {
      setErrorMessage('Please enter a valid Message ID to update.');
      return;
    }

    let parsedMeta: Record<string, any> | undefined = undefined;
    if (metadataJson.trim()) {
      try {
        parsedMeta = JSON.parse(metadataJson.trim());
      } catch (err: any) {
        setErrorMessage('Invalid Metadata JSON: ' + err.message);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setResult(null);

    const payload: any = {
      status,
    };
    if (recipient.trim()) payload.recipient = recipient.trim();
    if (subject.trim()) payload.subject = subject.trim();
    if (app.trim()) payload.app = app.trim();
    if (parsedMeta) payload.metadata = parsedMeta;

    try {
      const res = await updateLogByMessageId(messageId.trim(), payload);
      setResult(res);
      if (onUpdated) {
        onUpdated(messageId.trim());
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="simulator-container glass-panel">
      {/* Header */}
      <div className="simulator-header">
        <div className="simulator-header-left">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="simulator-title">Update Message Status & Parameters</h3>
            <p className="simulator-subtitle">
              Modify lifecycle status and telemetry parameters for an existing message in MongoDB Atlas via{' '}
              <code>PATCH /api/v1/logs/user-data/:messageId</code>.
            </p>
          </div>
        </div>
        <div className="auth-badge">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected Route</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="updater-presets-bar">
        <span className="presets-label">Quick Actions:</span>
        <button
          type="button"
          className="preset-btn emerald"
          onClick={() =>
            handleQuickPreset('delivered', {
              event: 'smtp_delivered',
              deliveryTime: new Date().toISOString(),
            })
          }
        >
          Mark Delivered
        </button>
        <button
          type="button"
          className="preset-btn cyan"
          onClick={() =>
            handleQuickPreset('acknowledged', {
              event: 'client_ack',
              ackedAt: new Date().toISOString(),
            })
          }
        >
          Mark Acknowledged
        </button>
        <button
          type="button"
          className="preset-btn purple"
          onClick={() =>
            handleQuickPreset('opened', {
              event: 'user_opened',
              device: 'Mobile WebKit',
            })
          }
        >
          Mark Opened
        </button>
        <button
          type="button"
          className="preset-btn rose"
          onClick={() =>
            handleQuickPreset('failed', {
              event: 'delivery_error',
              reason: 'Recipient mailbox unavailable',
            })
          }
        >
          Mark Failed
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="simulator-form">
        <div className="form-grid">
          {/* Message ID */}
          <div className="form-group full-width">
            <div className="input-label-row">
              <label htmlFor="update-message-id" className="form-label">
                Target Message ID <span className="required-star">*</span>
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="paste-link-btn"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Paste</span>
              </button>
            </div>
            <input
              id="update-message-id"
              type="text"
              className="form-input mono"
              placeholder="e.g. msg_1728839281902_abc123"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
              required
            />
          </div>

          {/* Status selector */}
          <div className="form-group full-width">
            <label className="form-label">
              New Lifecycle Status <span className="required-star">*</span>
            </label>
            <div className="status-selector-pills">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`status-pill-btn ${opt.color} ${status === opt.value ? 'selected' : ''}`}
                  onClick={() => setStatus(opt.value)}
                >
                  <span className="dot" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Recipient */}
          <div className="form-group">
            <label htmlFor="update-recipient" className="form-label">
              Recipient Email (Optional)
            </label>
            <input
              id="update-recipient"
              type="email"
              className="form-input"
              placeholder="Leave blank to keep existing"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* Optional Subject */}
          <div className="form-group">
            <label htmlFor="update-subject" className="form-label">
              Subject Line (Optional)
            </label>
            <input
              id="update-subject"
              type="text"
              className="form-input"
              placeholder="Leave blank to keep existing"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Optional App */}
          <div className="form-group">
            <label htmlFor="update-app" className="form-label">
              Application Name (Optional)
            </label>
            <input
              id="update-app"
              type="text"
              className="form-input"
              placeholder="Leave blank to keep existing"
              value={app}
              onChange={(e) => setApp(e.target.value)}
            />
          </div>

          {/* Metadata JSON */}
          <div className="form-group full-width">
            <label htmlFor="update-metadata" className="form-label">
              Additional Metadata (JSON Format)
            </label>
            <textarea
              id="update-metadata"
              className="form-input mono"
              rows={3}
              value={metadataJson}
              onChange={(e) => setMetadataJson(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="simulator-error-banner">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !messageId.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Record...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Submit Status Update</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result feedback */}
      {result && (
        <div className="simulator-result-box">
          <div className="result-header success">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div className="result-header-text">
              <span className="result-title">Record Updated Successfully!</span>
              <span className="result-subtitle">
                Matched: {result.data?.matchedCount || 1} &bull; Modified: {result.data?.modifiedCount || 1}
              </span>
            </div>
            {onUpdated && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => onUpdated(messageId.trim())}
                style={{ marginLeft: 'auto', fontSize: '11px' }}
              >
                <span>View in Trace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <pre className="result-code-block">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LogUpdater;
