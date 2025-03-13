# PackShip Telemetry Guide

This document explains how to access and view the telemetry data collected by PackShip.

## Overview

PackShip uses [Umami Analytics](https://umami.is/) to collect anonymous usage data. This helps us understand how the tool is being used and identify areas for improvement.

The telemetry system tracks:
- Command usage (e.g., how many times `packship init` and `packship publish` are run)
- Success and failure rates
- Basic error information (without personal data)

## Accessing the Telemetry Dashboard

To view the telemetry data:

1. Go to [Umami Cloud](https://cloud.umami.is/login)
2. Log in with the credentials provided to the PackShip team
3. Select the "PackShip CLI" website from the dashboard

## Understanding the Data

### Events

The telemetry system tracks the following events:

- `package_initialized`: Triggered when a user successfully runs `packship init`
- `package_initialization_failed`: Triggered when `packship init` fails
- `package_published`: Triggered when a user successfully runs `packship publish`
- `package_publish_failed`: Triggered when `packship publish` fails

### Event Properties

Each event includes additional properties:

- `success`: Boolean indicating if the operation was successful
- `packageName`: The name of the package (for successful operations)
- `packageVersion`: The version of the package (for successful operations)
- `error`: Error message (for failed operations)

### User Identification

Users are identified by a randomly generated ID that is stored in their local configuration file (`~/.packship/config.json`). This ID does not contain any personal information and cannot be used to identify individual users.

## Telemetry Configuration

The telemetry system uses the following environment variables:

```
UMAMI_ENDPOINT=https://analytics.umami.is/api/collect
UMAMI_WEBSITE_ID=cb37a298-c6e9-492e-9640-1166a4b54fe5
UMAMI_API_KEY=api_KsNYWM6f3IXqIJiyCV0HGmypDT7KJ5Jd
```

These are configured in the `.env` file and have fallback values in the code. 