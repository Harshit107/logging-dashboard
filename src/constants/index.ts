import DOMAINS from "../config/domain";

export { DOMAINS };

/**
 * Centralized Ecosystem URLs for Logging Dashboard
 * Derived from authoritative DOMAINS configuration.
 */
export const ECOSYSTEM_URLS = Object.freeze({
  LOGGER_API: DOMAINS.EMAIL.LOGGER_API,
  LOGGER_UI: DOMAINS.EMAIL.LOGGER_UI,
  MAIL_API: DOMAINS.EMAIL.API,
  SHOWCASE_UI: DOMAINS.EMAIL.SHOWCASE_UI,
  REPOS: Object.freeze({
    API: "https://github.com/Harshit107/FreelyEmail-API",
    SDK: "https://github.com/Harshit107/FreelyEmail-Node-library",
    LOGGER_SERVICE: "https://github.com/Harshit107/central-logging-service",
    DASHBOARD: "https://github.com/Harshit107/logging-dashboard",
    SHOWCASE: "https://github.com/Harshit107/FreelyEmail-Showcase",
  }),
} as const);

export const DEFAULT_CONFIG = Object.freeze({
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_URL || ECOSYSTEM_URLS.LOGGER_API,
  API_KEY: import.meta.env.VITE_LOGGING_SERVICE_API_KEY || "50b65cea-691b-406e-9d28-0718b86abe98",
});
