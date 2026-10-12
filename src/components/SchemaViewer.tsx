import React, { useState } from 'react';
import { Database, AlertTriangle, Info, UserCheck, Copy, Check } from 'lucide-react';

export const SchemaViewer: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<'error' | 'info' | 'user'>('user');
  const [copied, setCopied] = useState(false);

  const schemas = {
    user: {
      name: 'Schema C: User-Data Logs',
      collection: 'user_data_logs',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      description: 'Dedicated collection for email events, transactional notifications, OTP codes, and verification links indexed by Message ID.',
      fields: [
        { name: 'messageId', type: 'String (Indexed)', required: true, desc: 'Unique collision-resistant trace ID (msg_...)' },
        { name: 'sender', type: 'String', required: false, desc: 'Sender address or service label' },
        { name: 'recipient', type: 'String (Indexed)', required: false, desc: 'Target user email address' },
        { name: 'replyTo', type: 'String', required: false, desc: 'Optional reply-to override' },
        { name: 'app', type: 'String (Indexed)', required: true, desc: 'Originating client application name' },
        { name: 'subject', type: 'String', required: false, desc: 'Email subject or event heading' },
        { name: 'type', type: "'notification' | 'otp' | 'link' | 'custom'", required: true, desc: 'Categorical event classification' },
        { name: 'status', type: "'queued' | 'dispatched' | 'failed' | 'acknowledged'", required: true, desc: 'Delivery state machine lifecycle' },
        { name: 'metadata', type: 'Mixed (Object)', required: false, desc: 'Sanitized contextual key-value payload' },
        { name: 'timestamp', type: 'Date', required: true, desc: 'Event occurrence timestamp' },
      ],
      sample: {
        messageId: "msg_ts_1791827549687",
        sender: "auth@freelyemail.com",
        recipient: "dev@example.com",
        app: "MobileApp",
        subject: "Security Verification Code",
        type: "otp",
        status: "dispatched",
        metadata: { attempts: 1, channel: "brevo-relay" },
        timestamp: "2026-10-12T17:52:29.687Z"
      }
    },
    error: {
      name: 'Schema A: Error Logs',
      collection: 'error_logs',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      description: 'Application exceptions, crashes, HTTP errors, stack traces, and correlation markers.',
      fields: [
        { name: 'serviceName', type: 'String (Indexed)', required: true, desc: 'Name of the microservice reporting the error' },
        { name: 'environment', type: 'String', required: true, desc: 'production | staging | development' },
        { name: 'level', type: "'error' | 'fatal'", required: true, desc: 'Severity level' },
        { name: 'message', type: 'String', required: true, desc: 'Descriptive human-readable error summary' },
        { name: 'errorCode', type: 'String (Indexed)', required: false, desc: 'Standardized machine-readable error token' },
        { name: 'stackTrace', type: 'String', required: false, desc: 'Raw stack trace if exception was thrown' },
        { name: 'correlationId', type: 'String (Indexed)', required: false, desc: 'Trace ID spanning distributed calls' },
        { name: 'metadata', type: 'Mixed (Object)', required: false, desc: 'Sanitized context (passwords redacted)' },
      ],
      sample: {
        serviceName: "FreelyEmail-API",
        environment: "production",
        level: "error",
        message: "SMTP connection timeout during handshake",
        errorCode: "SMTP_TIMEOUT",
        correlationId: "corr_ts_001",
        metadata: { port: 587, host: "smtp-relay.brevo.com" },
        timestamp: "2026-10-12T17:52:28.120Z"
      }
    },
    info: {
      name: 'Schema B: Informational Logs',
      collection: 'info_logs',
      icon: <Info className="w-4 h-4 text-cyan-400" />,
      description: 'General operational events, lifecycle heartbeats, and audit checkpoints.',
      fields: [
        { name: 'serviceName', type: 'String (Indexed)', required: true, desc: 'Reporting application name' },
        { name: 'environment', type: 'String', required: true, desc: 'Target deployment environment' },
        { name: 'level', type: "'info' | 'debug' | 'warn'", required: true, desc: 'Log level' },
        { name: 'eventName', type: 'String (Indexed)', required: true, desc: 'Semantic identifier (e.g. EMAIL_SENT)' },
        { name: 'message', type: 'String', required: true, desc: 'Summary of the event' },
        { name: 'correlationId', type: 'String (Indexed)', required: false, desc: 'Distributed correlation marker' },
        { name: 'metadata', type: 'Mixed (Object)', required: false, desc: 'Event-specific structured attributes' },
      ],
      sample: {
        serviceName: "FreelyEmail-API",
        environment: "production",
        level: "info",
        eventName: "TRANSACTIONAL_EMAIL_SENT",
        message: "Email dispatched via Brevo REST API",
        correlationId: "corr_ts_001",
        metadata: { template: "otpVerification", app: "MobileApp" },
        timestamp: "2026-10-12T17:52:29.001Z"
      }
    }
  };

  const current = schemas[activeSchema];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(current.sample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="schema-viewer-container glass-panel">
      <div className="schema-nav-tabs">
        <button
          className={`schema-tab-btn ${activeSchema === 'user' ? 'active' : ''}`}
          onClick={() => setActiveSchema('user')}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>User-Data Logs</span>
          <span className="collection-pill">user_data_logs</span>
        </button>
        <button
          className={`schema-tab-btn ${activeSchema === 'error' ? 'active' : ''}`}
          onClick={() => setActiveSchema('error')}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Error Logs</span>
          <span className="collection-pill">error_logs</span>
        </button>
        <button
          className={`schema-tab-btn ${activeSchema === 'info' ? 'active' : ''}`}
          onClick={() => setActiveSchema('info')}
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Informational Logs</span>
          <span className="collection-pill">info_logs</span>
        </button>
      </div>

      <div className="schema-content-pane">
        <div className="schema-intro">
          <div className="schema-intro-left">
            <h3>{current.name}</h3>
            <p>{current.description}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Sample Payload'}</span>
          </button>
        </div>

        <div className="schema-grid">
          <div className="fields-table-wrapper">
            <table className="fields-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {current.fields.map((f, i) => (
                  <tr key={i}>
                    <td><code>{f.name}</code></td>
                    <td><span className="type-badge">{f.type}</span></td>
                    <td>{f.required ? <span className="req-pill">Yes</span> : <span className="opt-pill">Optional</span>}</td>
                    <td>{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sample-json-panel">
            <div className="sample-json-header">Sample Ingestion JSON</div>
            <pre className="sample-json-body">
              <code>{JSON.stringify(current.sample, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaViewer;
