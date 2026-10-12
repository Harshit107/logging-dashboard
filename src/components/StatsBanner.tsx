import React from 'react';
import { Database, Activity, ShieldCheck, Zap } from 'lucide-react';
import { ServiceHealth } from '../types';

interface StatsBannerProps {
  health: ServiceHealth | null;
  totalLogsCount: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ health, totalLogsCount }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel">
        <div className="stat-header">
          <span className="stat-title">Logging Microservice</span>
          <div className="stat-icon-wrapper indigo">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div className="stat-value">
          <span className={`status-indicator-dot ${health?.status || 'offline'}`} />
          {health?.status === 'healthy' ? 'Online (:5001)' : 'Offline'}
        </div>
        <div className="stat-caption">MongoDB Atlas &bull; Uptime: {Math.round(health?.uptime || 0)}s</div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-header">
          <span className="stat-title">Database Schemas</span>
          <div className="stat-icon-wrapper cyan">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="stat-value">3 Collections</div>
        <div className="stat-caption">error_logs &bull; info_logs &bull; user_data_logs</div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-header">
          <span className="stat-title">Indexed Records</span>
          <div className="stat-icon-wrapper emerald">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="stat-value">{totalLogsCount > 0 ? `${totalLogsCount}+ Logs` : 'Live Stream'}</div>
        <div className="stat-caption">Query Index: <code>messageId: 1, createdAt: 1</code></div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-header">
          <span className="stat-title">Proxy Handshake</span>
          <div className="stat-icon-wrapper purple">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <div className="stat-value text-emerald-400">Authenticated</div>
        <div className="stat-caption">Server-side <code>x-logging-key</code> injection</div>
      </div>
    </div>
  );
};

export default StatsBanner;
