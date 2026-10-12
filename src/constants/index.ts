/**
 * Centralized Ecosystem URLs for Logging Dashboard
 * Change domains here to propagate across the entire dashboard project.
 */
export const ECOSYSTEM_URLS = Object.freeze({
  LOGGER_API: "https://logger-api.harshit107.online",
  LOGGER_UI: "https://logger.harshit107.online",
  MAIL_API: "https://freelyemail-api.harshit107.online",
  SHOWCASE_UI: "https://freelyemail.harshit107.online",
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
});
