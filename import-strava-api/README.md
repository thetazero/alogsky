# Strava API Integration

Incremental Strava activity importer using the Strava API. This tool fetches new activities from Strava and appends them to your existing JSON export file.

## Features

- ✅ **OAuth2 Authentication** - Secure token management with automatic refresh
- ✅ **Incremental Updates** - Only fetches and processes new activities
- ✅ **Rate Limiting** - Respects Strava API limits (100/15min, 1000/day)
- ✅ **Manual Workout Intervals** - Preserves interactive workout interval entry
- ✅ **Backward Compatible** - Works with existing parsers and cache system
- ✅ **No Duplicates** - Automatically filters out already-processed activities

## Quick Start

### 1. Set Up Strava API Credentials

Follow the complete setup guide in [`docs/STRAVA_API_SETUP.md`](docs/STRAVA_API_SETUP.md)

Quick version:
1. Create Strava API app at https://www.strava.com/settings/api
2. Copy `.env.example` to `.env` and add your credentials
3. Run `python scripts/strava_auth_setup.py`
4. Authorize the application in your browser

### 2. Import Activities

```bash
python -m import_strava.import_strava
```

## How It Works

### Incremental Processing

The tool uses your existing `strava_export.json` file as the source of truth:

1. Loads existing JSON and extracts all `strava_id` values
2. Fetches activities from Strava API
3. Filters out activities already in the JSON
4. Processes only NEW activities through the existing parsers
5. Appends new activities to the JSON array
6. Saves the updated file

This means:
- ✅ First run: Only processes activities not in existing JSON (likely just recent ones)
- ✅ Subsequent runs: Very fast, only fetches recent activities
- ✅ No data loss: Existing activities are preserved
- ✅ No duplicates: Each activity is processed exactly once

### Token Management

OAuth tokens are automatically managed:
- Access tokens expire after 6 hours
- Automatically refreshed using refresh token
- No manual intervention needed

## Project Structure

```
import-strava-api/
├── .env                      # API credentials (create from .env.example)
├── .env.example              # Template for credentials
├── .gitignore                # Protects sensitive files
├── pyproject.toml            # UV project configuration
├── import_strava/
│   ├── __init__.py
│   ├── auth.py              # OAuth2 token management
│   ├── strava_api.py        # API client and field normalization
│   ├── import_strava.py     # Main import script
│   ├── run.py               # Run activity parser (from original)
│   ├── bike.py              # Bike activity parser (from original)
│   ├── elliptical.py        # Elliptical parser (from original)
│   ├── utils.py             # Utility functions (from original)
│   └── cache.py             # Workout interval cache (from original)
├── scripts/
│   └── strava_auth_setup.py # OAuth authorization helper
└── docs/
    └── STRAVA_API_SETUP.md  # Detailed setup instructions
```

## Usage

### First Time Setup

```bash
# 1. Configure credentials
cp .env.example .env
# Edit .env with your Strava API credentials

# 2. Authorize with Strava
python scripts/strava_auth_setup.py

# 3. Import activities
python -m import_strava.import_strava
```

### Regular Use

After initial setup, just run:

```bash
python -m import_strava.import_strava
```

This will:
1. Load existing activities from JSON
2. Fetch new activities from Strava API
3. Process and append new activities
4. Save updated JSON

### Manual Workout Intervals

The interactive workout interval entry is preserved. When processing new run activities, you'll be prompted:

```
Is this a workout? [y/n]: y
Strava Link: https://www.strava.com/activities/123456

Enter intervals (format: distance,time or empty to finish):
Interval 1: 1,330
Interval 2: 0.1,75
Interval 3:
```

Interval data is cached in `strava_cache.json` (in the parent directory).

## API Field Mapping

The API client normalizes Strava API responses to match the CSV format:

| Strava API Field | CSV Field | Notes |
|-----------------|-----------|-------|
| `id` | `Activity ID` | Converted to string |
| `start_date_local` | `Activity Date` | Reformatted to "MMM DD, YYYY, HH:MM:SS AM" |
| `name` | `Activity Name` | Direct mapping |
| `type` | `Activity Type` | Direct mapping (Run, Ride, etc.) |
| `description` | `Activity Description` | Direct mapping |
| `distance` | `Distance` | Direct mapping |
| `moving_time` | `Moving Time` | Direct mapping |
| `elapsed_time` | `Elapsed Time` | Direct mapping |
| `average_heartrate` | `Average Heart Rate` | Direct mapping |
| `max_heartrate` | `Max Heart Rate` | Direct mapping |

**Missing fields** (not available in API summary endpoint):
- `Activity Private Note` - left empty
- `Average Temperature` - left empty
- `Apparent Temperature` - left empty
- `Activity Gear` - left empty (API has `gear_id`, would need separate lookup)

These fields are accepted as empty for API-sourced activities.

## Rate Limiting

The Strava API has rate limits:
- **100 requests per 15 minutes**
- **1000 requests per day**

The tool automatically:
- Tracks requests in memory
- Waits when approaching limits
- Uses pagination efficiently (100 activities per request)

For incremental updates, this means:
- Usually just 1-2 API requests per run
- Well within rate limits
- Fast execution

## Troubleshooting

See [`docs/STRAVA_API_SETUP.md`](docs/STRAVA_API_SETUP.md) for detailed troubleshooting.

Common issues:
- **"No tokens file found"** → Run `python scripts/strava_auth_setup.py`
- **"Missing credentials"** → Check your `.env` file
- **Token expired** → Automatic refresh (no action needed)
- **Rate limited** → Wait or reduce frequency

## Development

### Running Tests

```bash
# TODO: Add tests
```

### Code Structure

- **`auth.py`** - OAuth2 token lifecycle management
- **`strava_api.py`** - API client with rate limiting and field normalization
- **`import_strava.py`** - Main orchestrator (load, fetch, filter, process, save)
- **Parsers** (`run.py`, `bike.py`, `elliptical.py`) - Activity-specific processing
- **`cache.py`** - Persistent storage for manual workout intervals

## License

This is a personal training data import tool. Use at your own discretion.

## Credits

Built on top of the original CSV-based import system, now powered by the Strava API.
