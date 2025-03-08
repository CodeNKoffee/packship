import axios from 'axios';
import { text, select, confirm, isCancel } from '@clack/prompts';
import { getVersion } from '../commands/version.js';
import os from 'os';
import { COLORS, MESSAGE } from './colors.js';

// GitHub API endpoint for creating issues
const GITHUB_API_URL = 'https://api.github.com/repos/CodeNKoffee/packship/issues';

// Issue categories
const ISSUE_CATEGORIES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'documentation', label: 'Documentation Issue' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Other' }
];

/**
 * Submit an issue to GitHub directly from the CLI
 */
export async function submitIssue(): Promise<void> {
  console.log(`\n${MESSAGE.HEADER('📝 Report an Issue')}`);
  console.log(MESSAGE.HIGHLIGHT('This will help us improve PackShip by submitting an issue to our GitHub repository.'));
  console.log(MESSAGE.MUTED('No personal information will be collected other than what you provide.'));

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

  // Confirm submission
  const confirmSubmission = await confirm({
    message: 'Ready to submit your issue?',
    initialValue: true
  });

  if (isCancel(confirmSubmission) || !confirmSubmission) {
    console.log(MESSAGE.WARNING('Issue reporting cancelled.'));
    return;
  }

  try {
    console.log(`\n${MESSAGE.INFO('Submitting your issue...')}`);

    // Check if user has a GitHub token set
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      console.log(`\n${MESSAGE.WARNING('⚠️  No GitHub token found.')}`);
      console.log(`To submit issues directly from the CLI, you need to set a ${MESSAGE.HIGHLIGHT('GITHUB_TOKEN')} environment variable.`);
      console.log(`You can create a personal access token at: ${MESSAGE.LINK('https://github.com/settings/tokens')}`);
      console.log(`\nAlternatively, you can submit your issue manually at:`);
      console.log(MESSAGE.LINK('https://github.com/CodeNKoffee/packship/issues/new'));

      // Format the issue for manual submission
      const divider = `${COLORS.CYAN}--- Copy the content below for manual submission ---${COLORS.RESET}`;
      console.log(`\n${divider}`);
      console.log(MESSAGE.HIGHLIGHT(`Title: [${String(category)}] ${String(title)}`));
      console.log(`\n${MESSAGE.HIGHLIGHT('Body:')}`);
      console.log(body);
      console.log(`${COLORS.CYAN}--- End of issue content ---${COLORS.RESET}\n`);

      // No telemetry tracking for manual submission
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
    // No telemetry tracking for failed issue creation
  }
} 