import { UAParser } from "ua-parser-js";

/**
 * Parses a user agent string into device info
 * @param {string} userAgent
 * @returns {object} { browser, os, device }
 */
export const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: result.device.type || "Desktop",
  };
};
