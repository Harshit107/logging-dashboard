import React from 'react';
import { Sun, Moon, Database, Activity, ShieldCheck } from 'lucide-react';
import { ServiceHealth } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  health: ServiceHealth | null;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, health }) => {
  return (
    <header className="navbar glass-panel">
      <div className="container nav-content">
        <div className="nav-brand">
          <div className="brand-icon">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="brand-text">
            <span className="brand-title">FreelyEmail</span>
            <span className="brand-subtitle">Central Logging Platform</span>
          </div>
        </div>

        <div className="nav-actions">
          {health && (
            <div className={`health-indicator ${health.status}`}>
              <span className="indicator-dot" />
              <span className="indicator-label">
                {health.status === 'healthy'
                  ? 'Service Online (:5001)'
                  : health.status === 'degraded'
                  ? 'Degraded'
                  : 'Backend Offline'}
              </span>
            </div>
          )}

          <div className="security-tag" title="Protected by server-side x-logging-key proxy">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated Proxy</span>
          </div>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px', textDecoration: 'none' }}
            title="Open FreelyEmail Showcase Portal"
          >
            <span>Showcase (:5173)</span>
          </a>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
