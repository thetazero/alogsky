# Strava API Setup Guide

This guide will help you set up the Strava API integration for importing your activity data.

## Prerequisites

- A Strava account
- Python 3.10+ installed
- UV package manager installed

## Step 1: Create a Strava API Application

1. Go to https://www.strava.com/settings/api

2. If you don't have an API application yet, click **"Create App"** or **"My API Application"**

3. Fill in the application details:
   - **Application Name**: `Mechanical Coach Data Import` (or any name you prefer)
   - **Category**: `Training`
   - **Club**: Leave blank
   - **Website**: `http://localhost` (or your actual website)
   - **Application Description**: `Personal training data import tool`
   - **Authorization Callback Domain**: `localhost` ⚠️ **Important: Must be exactly `localhost`**

4. Click **"Create"**

5. After creation, you'll see your application details with:
   - **Client ID**: A numeric ID (e.g., `123456`)
   - **Client Secret**: A hexadecimal string (e.g., `a1b2c3d4e5f6...`)

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your credentials:
   ```bash
   STRAVA_CLIENT_ID=123456
   STRAVA_CLIENT_SECRET=a1b2c3d4e5f6...
   STRAVA_REDIRECT_URI=http://localhost:8080/callback
   ```

3. Save the file

⚠️ **Security Note**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 3: Run OAuth Authorization

Run the authorization setup script:

```bash
python scripts/strava_auth_setup.py
```

This script will:
1. Start a local HTTP server on port 8080
2. Open your browser to the Strava authorization page
3. Ask you to authorize the application
4. Receive the authorization callback
5. Exchange the code for access tokens
6. Save tokens to `.strava_tokens.json`

### What You'll See:

1. **In Terminal**:
   ```
   Strava API OAuth Setup
   ======================================================================

   This script will:
     1. Start a local HTTP server on port 8080
     2. Open your browser to authorize with Strava
     3. Save your access tokens to .strava_tokens.json

   Starting local server on http://localhost:8080...

   Opening browser for authorization...
   Waiting for authorization callback...
   ```

2. **In Browser**:
   - Strava will ask you to authorize the application
   - Click **"Authorize"**
   - You'll see a success message: "Authorization Successful!"

3. **Back in Terminal**:
   ```
   ✓ Authorization code received
   Exchanging code for access tokens...
   ✓ Tokens saved to .strava_tokens.json

   ======================================================================
   SUCCESS! OAuth setup complete!
   ======================================================================

   You can now use the Strava API integration.
   Run: python -m import_strava.import_strava
   ```

## Step 4: Run the Data Import

Now you can import your Strava activities:

```bash
python -m import_strava.import_strava
```

### What Happens:

1. **First Run**:
   - Loads existing `strava_export.json` (from your CSV import)
   - Fetches all activities from Strava API
   - Filters out activities already in JSON
   - Processes only NEW activities
   - Appends new activities to JSON
   - Saves updated file

2. **Subsequent Runs**:
   - Only fetches and processes new activities since last run
   - Appends to existing JSON
   - Very fast (only a few API calls)

### Interactive Workout Interval Entry

The import script will prompt you interactively for workout intervals, just like before:

```
Is this a workout? [y/n]: y
Strava Link: https://www.strava.com/activities/123456

Enter intervals (format: distance,time or empty to finish):
Interval 1: 1,330
Interval 2: 0.1,75
Interval 3:
```

This behavior is preserved from the original CSV import system.

## Troubleshooting

### "No tokens file found"

If you see this error:
```
FileNotFoundError: No tokens file found at .strava_tokens.json.
Please run the OAuth setup script first (scripts/strava_auth_setup.py)
```

**Solution**: Run `python scripts/strava_auth_setup.py` to authorize the application.

### "Missing Strava API credentials"

If you see:
```
ValueError: Missing Strava API credentials.
Please set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET environment variables.
```

**Solution**: Make sure you created the `.env` file with your Client ID and Secret from Step 2.

### "Authorization Failed" in Browser

**Possible Causes**:
- Authorization Callback Domain is not set to `localhost`
- You clicked "Cancel" instead of "Authorize"

**Solution**: Go back to https://www.strava.com/settings/api and verify the callback domain is `localhost`, then try again.

### "Token expired" / "401 Unauthorized"

The script automatically refreshes expired tokens. If you see this error repeatedly:

**Solution**: Delete `.strava_tokens.json` and run the OAuth setup again:
```bash
rm .strava_tokens.json
python scripts/strava_auth_setup.py
```

### Rate Limit Errors

Strava API has rate limits:
- 100 requests per 15 minutes
- 1000 requests per day

The script automatically handles rate limiting by waiting when needed. If you hit the daily limit:

**Solution**: Wait until the next day, or run the script less frequently.

### Port 8080 Already in Use

If another process is using port 8080:

**Solution**:
1. Find and stop the process using port 8080
2. Or change the port in `.env`:
   ```
   STRAVA_REDIRECT_URI=http://localhost:8081/callback
   ```
   And update the Authorization Callback Domain in your Strava API application settings to match.

## Maintenance

### Token Refresh

Access tokens expire every 6 hours, but the script automatically refreshes them using the refresh token. You don't need to do anything!

### Re-authorizing

If you need to re-authorize (e.g., you revoked access or changed scopes):

```bash
rm .strava_tokens.json
python scripts/strava_auth_setup.py
```

### Checking What's Been Processed

The existing `strava_export.json` file is the source of truth for which activities have been processed. The script extracts `strava_id` from each activity and skips activities already in the file.

## Additional Information

### Required OAuth Scopes

The application requests these scopes:
- `activity:read` - Read basic activity data
- `activity:read_all` - Read all activity data including private activities

### Data Privacy

All credentials and tokens are stored locally:
- `.env` - API credentials (gitignored)
- `.strava_tokens.json` - OAuth tokens (gitignored)

Never commit these files to version control.

### File Structure

```
import-strava-api/
├── .env                      # Your API credentials (gitignored)
├── .strava_tokens.json       # OAuth tokens (gitignored)
├── import_strava/
│   ├── auth.py              # Token management
│   ├── strava_api.py        # API client
│   ├── import_strava.py     # Main import script
│   ├── run.py               # Run activity parser
│   ├── bike.py              # Bike activity parser
│   ├── elliptical.py        # Elliptical parser
│   ├── utils.py             # Utility functions
│   └── cache.py             # Workout interval cache
├── scripts/
│   └── strava_auth_setup.py # OAuth authorization script
└── docs/
    └── STRAVA_API_SETUP.md  # This file
```

## Support

If you encounter issues not covered in this guide:

1. Check that all prerequisites are installed
2. Verify your Strava API application settings
3. Ensure `.env` file has correct credentials
4. Try deleting `.strava_tokens.json` and re-authorizing

## Next Steps

Once setup is complete, you can run the import regularly to fetch new activities:

```bash
# Import new activities
python -m import_strava.import_strava
```

The script is incremental - it only processes new activities not already in the JSON file.
