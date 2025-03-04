import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { confirm } from '@clack/prompts';
import { TelemetryConfig, TelemetryEvent } from '../types';

// Default Umami endpoint - users can override this with their own
const UMAMI_ENDPOINT = process.env.UMAMI_ENDPOINT || 'https://analytics.umami.is/api/collect';
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID || 'packship-cli';
const CONFIG_FILE = path.join(os.homedir(), '.packship', 'config.json');

// Ensure the config directory exists
function ensureConfigDir(): void {
  const configDir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

// Load the telemetry configuration
export function loadTelemetryConfig(): TelemetryConfig {
  ensureConfigDir();

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return {
        enabled: config.telemetry?.enabled ?? false,
        userId: config.telemetry?.userId ?? generateUserId()
      };
    } catch (error) {
      // If there's an error reading the config, return default values
      return { enabled: false, userId: generateUserId() };
    }
  }

  // Default config if file doesn't exist
  return { enabled: false, userId: generateUserId() };
}

// Save the telemetry configuration
export function saveTelemetryConfig(config: TelemetryConfig): void {
  ensureConfigDir();

  let fullConfig = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      fullConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (error) {
      // If there's an error reading the config, use an empty object
    }
  }

  // Update only the telemetry part of the config
  fullConfig = {
    ...fullConfig,
    telemetry: {
      enabled: config.enabled,
      userId: config.userId
    }
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(fullConfig, null, 2));
}

// Generate a random user ID
function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

// Ask for telemetry consent if not already configured
export async function askForTelemetryConsent(): Promise<boolean> {
  const config = loadTelemetryConfig();

  // If telemetry is already configured, return its current state
  if ('enabled' in config) {
    return config.enabled;
  }

  console.log('\n📊 Telemetry');
  console.log('PackShip collects anonymous usage data to help improve the tool.');
  console.log('This data includes command usage and error rates, but never includes personal information or code.');
  console.log('You can opt out at any time by running: packship telemetry disable');

  const consent = await confirm({
    message: 'Do you want to enable anonymous telemetry?',
    initialValue: true
  });

  const telemetryConfig: TelemetryConfig = {
    enabled: Boolean(consent),
    userId: generateUserId()
  };

  saveTelemetryConfig(telemetryConfig);
  return Boolean(consent);
}

// Send telemetry event to Umami
export async function sendTelemetryEvent(event: TelemetryEvent): Promise<void> {
  const config = loadTelemetryConfig();

  // Don't send telemetry if it's disabled
  if (!config.enabled) {
    return;
  }

  try {
    const payload = {
      type: 'event',
      payload: {
        website: UMAMI_WEBSITE_ID,
        url: `https://packship.dev/${event.type}`,
        event: event.name,
        data: event.data || {},
        hostname: 'packship.dev',
        language: process.env.LANG || 'en-US',
        screen: '1920x1080',
        referrer: '',
        userId: config.userId
      }
    };

    await axios.post(UMAMI_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `PackShip CLI/${process.env.npm_package_version || 'unknown'}`
      },
      timeout: 3000 // 3 second timeout to avoid hanging the CLI
    }).catch(() => {
      // Silently fail on telemetry errors - don't disrupt the user
    });
  } catch (error) {
    // Silently ignore telemetry errors
  }
}

// Disable telemetry
export function disableTelemetry(): void {
  const config = loadTelemetryConfig();
  config.enabled = false;
  saveTelemetryConfig(config);
  console.log('Telemetry has been disabled.');
}

// Enable telemetry
export function enableTelemetry(): void {
  const config = loadTelemetryConfig();
  config.enabled = true;
  saveTelemetryConfig(config);
  console.log('Telemetry has been enabled.');
}

// Get current telemetry status
export function getTelemetryStatus(): boolean {
  return loadTelemetryConfig().enabled;
} 