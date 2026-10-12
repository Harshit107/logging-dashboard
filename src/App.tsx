import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import RecordCard from './components/RecordCard';
import EmptyState from './components/EmptyState';
import StatsBanner from './components/StatsBanner';
import RecentFeed from './components/RecentFeed';
import SchemaViewer from './components/SchemaViewer';
import ApiSimulator from './components/ApiSimulator';
import { checkBackendHealth, searchByMessageId, fetchRecentLogs } from './services/api';
import { UserDataLogRecord, ServiceHealth } from './types';
import {
  FileText,
  Copy,
  Check,
  Database,
  Layers,
  Search,
  Activity,
  Code2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import './App.css';

type ActiveViewTab = 'trace' | 'stream' | 'schemas' | 'simulator';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [records, setRecords] = useState<UserDataLogRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Live feed state
  const [recentLogs, setRecentLogs] = useState<UserDataLogRecord[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('trace');

  // Sync theme attribute with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load health and recent logs on mount
  const loadRecentData = async () => {
    setIsLoadingRecent(true);
    try {
      const logs = await fetchRecentLogs(15);
      setRecentLogs(logs || []);
    } catch (err) {
      console.warn('Could not load recent logs:', err);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  useEffect(() => {
    checkBackendHealth().then((h) => setHealth(h));
    loadRecentData();

    const healthInterval = setInterval(() => {
      checkBackendHealth().then((h) => setHealth(h));
    }, 15000);

    return () => clearInterval(healthInterval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearch = async (messageId: string) => {
    const cleanId = messageId.trim();
    if (!cleanId) return;

    setCurrentQuery(cleanId);
    setIsLoading(true);
    setErrorMessage(null);
    setActiveTab('trace');

    try {
      const response = await searchByMessageId(cleanId);
      setRecords(response.data?.records || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch logs');
      setRecords(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessageId = () => {
    if (currentQuery) {
      navigator.clipboard.writeText(currentQuery);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogCreated = (messageId: string) => {
    loadRecentData();
    handleSearch(messageId);
  };

  return (
    <div className="app-layout">
      <Navbar theme={theme} toggleTheme={toggleTheme} health={health} />

      <main className="main-content container">
        {/* Hero & Search Header */}
        <div className="hero-search-area">
          <div className="hero-badge">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Centralized Log Inspector</span>
          </div>
          <h1 className="hero-title">Trace Any Email by Message ID</h1>
          <p className="hero-subtitle">
            Query across decoupled application services, inspect delivery lifecycles, and audit user-data transactions in real time.
          </p>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            initialValue={currentQuery}
          />
        </div>

        {/* Telemetry Stats Grid */}
        <StatsBanner
          health={health}
          totalLogsCount={recentLogs.length}
        />

        {/* View Navigation Tabs */}
        <div className="view-navigation-tabs">
          <button
            className={`nav-tab-item ${activeTab === 'trace' ? 'active' : ''}`}
            onClick={() => setActiveTab('trace')}
          >
            <Search className="w-4 h-4" />
            <span>Trace Investigation</span>
            {records && (
              <span className="tab-pill">{records.length} records</span>
            )}
          </button>

          <button
            className={`nav-tab-item ${activeTab === 'stream' ? 'active' : ''}`}
            onClick={() => setActiveTab('stream')}
          >
            <Activity className="w-4 h-4" />
            <span>Live Activity Stream</span>
            <span className="tab-pill live">{recentLogs.length} recent</span>
          </button>

          <button
            className={`nav-tab-item ${activeTab === 'schemas' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemas')}
          >
            <Database className="w-4 h-4" />
            <span>Database Schemas</span>
            <span className="tab-pill">3 models</span>
          </button>

          <button
            className={`nav-tab-item ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Code2 className="w-4 h-4" />
            <span>API Simulator</span>
            <span className="tab-pill test">REST Post</span>
          </button>
        </div>

        {/* Tab 1: Trace Investigation View */}
        {activeTab === 'trace' && (
          <section className="results-container">
            {isLoading && (
              <div className="loading-container glass-panel">
                <div className="spinner" />
                <p>Querying Central Logging Service database...</p>
              </div>
            )}

            {!isLoading && errorMessage && (
              <EmptyState type="error" errorMessage={errorMessage} />
            )}

            {/* If user hasn't searched yet, show rich launchpad instead of a barren void */}
            {!isLoading && !errorMessage && records === null && (
              <div className="launchpad-container glass-panel">
                <div className="launchpad-hero">
                  <div className="launchpad-icon">
                    <Database className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3>Audit & Trace Investigation</h3>
                  <p className="launchpad-desc">
                    Enter any transaction Message ID above to view its chronological event history, recipient metadata, and delivery lifecycle.
                  </p>
                </div>

                {recentLogs.length > 0 && (
                  <div className="launchpad-quick-list">
                    <div className="quick-list-header">
                      <div className="quick-list-title">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Ready-to-Inspect Traces in Database:</span>
                      </div>
                      <span className="text-xs text-slate-400">Click any row to trace instantly</span>
                    </div>

                    <div className="quick-cards-grid">
                      {recentLogs.slice(0, 4).map((log) => (
                        <div
                          key={log._id || log.messageId}
                          className="quick-trace-card"
                          onClick={() => handleSearch(log.messageId)}
                        >
                          <div className="quick-card-top">
                            <span className="badge badge-type">{log.type}</span>
                            <span className="badge badge-dispatched">{log.status}</span>
                          </div>
                          <div className="quick-card-id font-mono">{log.messageId}</div>
                          <div className="quick-card-subject">{log.subject || '(No subject)'}</div>
                          <div className="quick-card-footer">
                            <span className="quick-card-app">{log.app}</span>
                            <span className="quick-trace-action">
                              Inspect <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !errorMessage && records !== null && records.length === 0 && (
              <EmptyState type="not-found" searchedId={currentQuery} />
            )}

            {!isLoading && !errorMessage && records !== null && records.length > 0 && (
              <div className="records-view">
                {/* Results Summary Bar */}
                <div className="results-summary glass-panel">
                  <div className="summary-left">
                    <span className="summary-count">
                      Found <strong>{records.length}</strong> record{records.length > 1 ? 's' : ''} for
                    </span>
                    <code className="active-message-id">{currentQuery}</code>
                    <button
                      className="copy-id-btn"
                      onClick={handleCopyMessageId}
                      title="Copy Message ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="summary-right">
                    <span className="badge badge-type">
                      <Database className="w-3 h-3" />
                      <span>user_data_logs</span>
                    </span>
                  </div>
                </div>

                {/* Chronological List of Records */}
                <div className="records-list">
                  {records.map((record, index) => (
                    <RecordCard
                      key={record._id || index}
                      record={record}
                      index={index}
                      totalRecords={records.length}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Live Activity Stream View */}
        {activeTab === 'stream' && (
          <section className="results-container">
            <RecentFeed
              records={recentLogs}
              onSelectMessageId={handleSearch}
              onRefresh={loadRecentData}
              isLoading={isLoadingRecent}
            />
          </section>
        )}

        {/* Tab 3: Database Schemas View */}
        {activeTab === 'schemas' && (
          <section className="results-container">
            <SchemaViewer />
          </section>
        )}

        {/* Tab 4: API Simulator View */}
        {activeTab === 'simulator' && (
          <section className="results-container">
            <ApiSimulator onLogCreated={handleLogCreated} />
          </section>
        )}
      </main>

      <footer className="footer container">
        <p>FreelyEmail Central Logging Platform &bull; Built with TypeScript &bull; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
