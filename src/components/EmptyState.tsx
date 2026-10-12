import React from 'react';
import { Search, Database, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'initial' | 'not-found' | 'error';
  searchedId?: string;
  errorMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, searchedId, errorMessage }) => {
  if (type === 'error') {
    return (
      <div className="empty-state glass-panel">
        <div className="empty-icon error">
          <AlertCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h3>Failed to Retrieve Logs</h3>
        <p className="empty-description">
          {errorMessage || 'An error occurred while connecting to the central logging service.'}
        </p>
      </div>
    );
  }

  if (type === 'not-found') {
    return (
      <div className="empty-state glass-panel">
        <div className="empty-icon not-found">
          <Search className="w-8 h-8 text-amber-400" />
        </div>
        <h3>No Records Found</h3>
        <p className="empty-description">
          No audit log entries matched Message ID: <code>{searchedId}</code>
        </p>
        <span className="empty-hint">
          Verify that the Message ID was dispatched and recorded in the Central Logging Service database.
        </span>
      </div>
    );
  }

  return (
    <div className="empty-state glass-panel">
      <div className="empty-icon initial">
        <Database className="w-8 h-8 text-indigo-400" />
      </div>
      <h3>Audit & Trace Investigation</h3>
      <p className="empty-description">
        Enter any transaction Message ID above to view its chronological event history, recipient metadata, and delivery lifecycle.
      </p>
    </div>
  );
};

export default EmptyState;
