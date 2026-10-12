import React, { useState } from 'react';
import { Search, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (messageId: string) => void;
  isLoading: boolean;
  initialValue?: string;
  onClear?: () => void;
}

const SAMPLE_IDS = [
  { id: 'msg_ts_1791827549687', label: 'OTP Flow (2 Events)' },
  { id: 'msg_test_1791826399005', label: 'Delivery Ack (2 Events)' },
  { id: 'msg_mv5juyfh_d172dd0acd56', label: 'Notification' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  initialValue = '',
  onClear,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Sync internal state when parent updates initialValue
  React.useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onClear) onClear();
  };

  const handleQuickSelect = (id: string) => {
    setSearchTerm(id);
    onSearch(id);
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon w-5 h-5" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Message ID (e.g. msg_ts_1791827549687)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          {searchTerm && !isLoading && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`btn search-submit-btn ${searchTerm.trim() ? 'btn-primary' : 'btn-disabled'}`}
          disabled={isLoading || !searchTerm.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Trace Message</span>
            </>
          )}
        </button>
      </form>

      <div className="quick-suggestions">
        <div className="suggestions-label">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick sample traces:</span>
        </div>
        <div className="chips-list">
          {SAMPLE_IDS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={`chip-btn ${searchTerm === sample.id ? 'active' : ''}`}
              onClick={() => handleQuickSelect(sample.id)}
              disabled={isLoading}
            >
              <code>{sample.id}</code>
              <span className="chip-tag">{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
