import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { API_BASE, getAuthHeaders } from '../services/api';

interface ApiSimulatorProps {
  onLogCreated: (messageId: string) => void;
}

export const ApiSimulator: React.FC<ApiSimulatorProps> = ({ onLogCreated }) => {
  const [app, setApp] = useState('FreelyEmail-Client');
  const [recipient, setRecipient] = useState('developer@test.io');
  const [type, setType] = useState<'otp' | 'notification' | 'link'>('otp');
  const [customMessageId, setCustomMessageId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastResult(null);

    const payload: any = {
      app,
      recipient,
      type,
      subject: type === 'otp' ? 'Your Security Pin: 492104' : type === 'link' ? 'Verify your new account' : 'Weekly Project Update',
      status: 'dispatched',
      metadata: {
        simulatedFrom: 'Logging Dashboard',
        browserAgent: navigator.userAgent.slice(0, 30),
      },
    };

    if (customMessageId.trim()) {
      payload.messageId = customMessageId.trim();
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/logs/user-data`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLastResult(data);
      if (data.success && data.data?.messageId) {
        onLogCreated(data.data.messageId);
      }
    } catch (err: any) {
      setLastResult({ success: false, error: { message: err.message } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="simulator-container glass-panel">
      <div className="simulator-header">
        <div className="simulator-header-left">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <div>
            <h3>Interactive Log Ingestion Simulator</h3>
            <p className="text-sm text-slate-400">
              Submit a live test event to <code>POST /api/v1/logs/user-data</code> to test the Central Logging Service end-to-end.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSimulate} className="simulator-form">
        <div className="simulator-fields-grid">
          <div className="field-group">
            <label>Originating App</label>
            <input
              type="text"
              value={app}
              onChange={(e) => setApp(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label>Recipient Email</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label>Log Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="otp">OTP Code</option>
              <option value="notification">General Notification</option>
              <option value="link">Verification Link</option>
            </select>
          </div>

          <div className="field-group">
            <label>Custom Message ID (optional)</label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate msg_..."
              value={customMessageId}
              onChange={(e) => setCustomMessageId(e.target.value)}
            />
          </div>
        </div>

        <div className="simulator-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Log...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Live Log Entry</span>
              </>
            )}
          </button>
        </div>
      </form>

      {lastResult && (
        <div className={`simulator-result ${lastResult.success ? 'success' : 'error'}`}>
          {lastResult.success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Log recorded successfully! Generated/Preserved Message ID: <code>{lastResult.data?.messageId}</code>
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Error: {lastResult.error?.message || 'Failed to submit log'}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiSimulator;
