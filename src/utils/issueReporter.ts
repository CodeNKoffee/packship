import axios from 'axios';
import { text, select, confirm, isCancel } from '@clack/prompts';
import { getVersion } from '../commands/version.js';
import os from 'os';
import { COLORS, MESSAGE } from './colors.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// GitHub API endpoint for creating issues
const GITHUB_API_URL = 'https://api.github.com/repos/CodeNKoffee/packship/issues';

// Issue categories
const ISSUE_CATEGORIES = [
  { value: 'bug', label: 'Bug Report - Packship Tool' },
  { value: 'feature', label: 'Feature Request for Packship' },
  { value: 'documentation', label: 'Documentation Issue with Packship' },
  { value: 'question', label: 'Question about Packship' },
  { value: 'other', label: 'Other Packship-related Issue' }
];

// Submission methods
const SUBMISSION_METHODS = [
  {
    value: 'automatic',
    label: 'Automatic Submission (requires GitHub token)'
  },
  {
    value: 'manual',
    label: 'Manual Submission (copy & paste to GitHub)'
  }
];

/**
 * Prompt user to enter their GitHub token and save it to .env file
 */
async function promptForGitHubToken(): Promise<string | null> {
  console.log(MESSAGE.INFO('To submit issues directly from the CLI, you need a GitHub Personal Access Token.'));
  console.log(MESSAGE.MUTED('You can create one at: ') + MESSAGE.LINK('https://github.com/settings/tokens'));
  console.log(MESSAGE.MUTED('The token needs "repo" scope to create issues.'));

  const token = await text({
    message: 'Enter your GitHub token:',
    placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    validate(value) {
      if (!value) return 'Token is required';
      if (value.length < 10) return 'Token seems too short';
      return;
    }
  });

  if (isCancel(token)) {
    return null;
  }

  const saveToken = await confirm({
    message: 'Would you like to save this token for future use?',
    initialValue: true
  });

  if (isCancel(saveToken)) {
    return String(token);
  }

  if (saveToken) {
    try {
      // Try to find .env file in current directory
      const envPath = path.join(process.cwd(), '.env');
      let envContent = '';

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');

        // Check if GITHUB_TOKEN already exists
        if (envContent.includes('GITHUB_TOKEN=')) {
          // Replace existing token
          envContent = envContent.replace(/GITHUB_TOKEN=.*/g, `GITHUB_TOKEN=${token}`);
        } else {
          // Add token to end of file
          envContent += `\nGITHUB_TOKEN=${token}\n`;
        }
      } else {
        // Create new .env file
        envContent = `GITHUB_TOKEN=${token}\n`;
      }

      // Write to .env file
      fs.writeFileSync(envPath, envContent);
      console.log(MESSAGE.SUCCESS('GitHub token saved to .env file.'));

      // Update process.env
      process.env.GITHUB_TOKEN = String(token);

      // Reload .env file
      dotenv.config();
    } catch (error) {
      console.error(MESSAGE.ERROR('Failed to save token to .env file:'), error);
      console.log(MESSAGE.INFO('You can manually add it to your .env file:'));
      console.log(MESSAGE.HIGHLIGHT(`GITHUB_TOKEN=${token}`));
    }
  }

  return String(token);
}

/**
 * Display manual submission instructions with formatted issue content
 */
function showManualSubmissionInstructions(category: string, title: string, body: string): void {
  console.log(`\nYou can submit your issue manually at:`);
  console.log(MESSAGE.LINK('https://github.com/CodeNKoffee/packship/issues/new'));

  // Format the issue for manual submission
  const divider = `${COLORS.CYAN}--- Copy the content below for manual submission ---${COLORS.RESET}`;
  console.log(`\n${divider}`);
  console.log(MESSAGE.HIGHLIGHT(`Title: [${String(category)}] ${String(title)}`));
  console.log(`\n${MESSAGE.HIGHLIGHT('Body:')}`);
  console.log(body);
  console.log(`${COLORS.CYAN}--- End of issue content ---${COLORS.RESET}\n`);
}

/**
 * Submit an issue to GitHub directly from the CLI
 */
export async function submitIssue(): Promise<void> {
  console.log(`\n${MESSAGE.HEADER('📝 Report an Issue with Packship')}`);
  console.log(MESSAGE.HIGHLIGHT('This will help us improve the Packship tool by submitting an issue to our GitHub repository.'));
  console.log(MESSAGE.MUTED('No personal information will be collected other than what you provide.'));

  // Choose submission method
  const submissionMethod = await select({
    message: 'How would you like to submit your issue?',
    options: SUBMISSION_METHODS,
    initialValue: 'automatic'
  });

  if (isCancel(submissionMethod)) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  // Select issue category
  const category = await select({
    message: 'What type of issue would you like to report?',
    options: ISSUE_CATEGORIES
  });

  if (isCancel(category)) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  // Get issue title
  const title = await text({
    message: 'Enter a title for your issue:',
    placeholder: 'Brief description of the issue'
  });

  if (isCancel(title)) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  // Get issue description
  const description = await text({
    message: 'Please describe the issue in detail:',
    placeholder: 'Include steps to reproduce if applicable'
  });

  if (isCancel(description)) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  // Collect system information
  const includeSystemInfo = await confirm({
    message: 'Would you like to include system information? (OS, Node version, etc.)',
    initialValue: true
  });

  if (isCancel(includeSystemInfo)) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  // Prepare issue body
  let body = String(description);

  if (includeSystemInfo) {
    const systemInfo = `
## System Information
- PackShip Version: ${getVersion()}
- OS: ${os.type()} ${os.release()}
- Node Version: ${process.version}
- Platform: ${os.platform()}
- Architecture: ${os.arch()}
`;
    body += systemInfo;
  }

  // If manual submission was selected, show instructions and exit
  if (submissionMethod === 'manual') {
    showManualSubmissionInstructions(String(category), String(title), body);
    return;
  }

  // For automatic submission, proceed with GitHub API

  // Confirm submission
  const confirmSubmission = await confirm({
    message: 'Ready to submit your issue automatically to GitHub?',
    initialValue: true
  });

  if (isCancel(confirmSubmission) || !confirmSubmission) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  try {
    console.log(`\n${MESSAGE.INFO('Submitting your issue...')}`);

    // Check if user has a GitHub token set
    let githubToken = process.env.GITHUB_TOKEN;

    // If no token is found, prompt user to enter one
    if (!githubToken) {
      console.log(`\n${MESSAGE.WARNING('⚠️  No GitHub token found.')}`);
      const promptedToken = await promptForGitHubToken();
      if (promptedToken) {
        githubToken = promptedToken;
      }
    }

    // If still no token (user declined to enter one), show manual submission instructions
    if (!githubToken) {
      console.log(MESSAGE.WARNING('Cannot proceed with automatic submission without a GitHub token.'));
      showManualSubmissionInstructions(String(category), String(title), body);
      return;
    }

    // Submit the issue to GitHub
    const response = await axios.post(
      GITHUB_API_URL,
      {
        title: `[${String(category)}] ${String(title)}`,
        body: body,
        labels: [String(category)]
      },
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (response.status === 201) {
      console.log(`\n${MESSAGE.SUCCESS('✅ Issue successfully created:')} ${MESSAGE.LINK(response.data.html_url)}`);
      // No telemetry tracking for successful issue creation
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error(`\n${MESSAGE.ERROR('❌ Failed to create issue:')} ${error instanceof Error ? error.message : 'Unknown error'}`);

    // If the error is related to authentication, suggest checking the token
    if (error instanceof Error && error.message.includes('401')) {
      console.log(MESSAGE.WARNING('This might be due to an invalid GitHub token. Please check your token and try again.'));
      console.log(MESSAGE.INFO('You can generate a new token at: ') + MESSAGE.LINK('https://github.com/settings/tokens'));
    }

    // Show manual submission as a fallback
    console.log(`\n${MESSAGE.INFO('You can still submit your issue manually:')}`);
    showManualSubmissionInstructions(String(category), String(title), body);

    // No telemetry tracking for failed issue creation
  }
} 