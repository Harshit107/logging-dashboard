import React from 'react';
import { Sun, Moon, Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { ServiceHealth } from '../types';
import { ECOSYSTEM_URLS } from '../constants';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  health: ServiceHealth | null;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, health }) => {
  return (
    <header className="navbar">
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
                  ? 'Service Online'
                  : health.status === 'degraded'
                  ? 'Degraded'
                  : 'Backend Offline'}
              </span>
            </div>
          )}

          <div className="security-tag" title="Protected by server-side x-logging-key proxy">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated</span>
          </div>

          <a
            href={ECOSYSTEM_URLS.SHOWCASE_UI}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-showcase-link"
            title="Open FreelyEmail Showcase Portal (Live Demo)"
          >
            <span className="showcase-pill-dot" />
            <span>Showcase Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
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

