#!/usr/bin/env python3
"""OAuth2 setup script for Strava API authentication.

This script helps you authorize the application with Strava and obtain access tokens.
It starts a local HTTP server to handle the OAuth callback.
"""

import os
import sys
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
REDIRECT_URI = os.getenv("STRAVA_REDIRECT_URI", "http://localhost:8080/callback")
TOKEN_FILE = ".strava_tokens.json"

# Global variable to store the authorization code
auth_code = None


class OAuthCallbackHandler(BaseHTTPRequestHandler):
    """HTTP request handler for OAuth callback."""

    def log_message(self, format, *args):
        """Suppress default logging."""
        pass

    def do_GET(self):
        """Handle GET request with authorization code."""
        global auth_code

        # Parse the URL
        parsed_url = urlparse(self.path)

        if parsed_url.path == "/callback":
            # Extract authorization code
            query_params = parse_qs(parsed_url.query)

            if "code" in query_params:
                auth_code = query_params["code"][0]
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(b"""
                    <html>
                    <body>
                        <h1>Authorization Successful!</h1>
                        <p>You have successfully authorized the Strava API integration.</p>
                        <p>You can close this window and return to the terminal.</p>
                    </body>
                    </html>
                """)
            elif "error" in query_params:
                error = query_params["error"][0]
                self.send_response(400)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(f"""
                    <html>
                    <body>
                        <h1>Authorization Failed</h1>
                        <p>Error: {error}</p>
                        <p>Please try again.</p>
                    </body>
                    </html>
                """.encode())
        else:
            self.send_response(404)
            self.end_headers()


def exchange_code_for_tokens(code: str) -> dict:
    """Exchange authorization code for access and refresh tokens.

    Args:
        code: Authorization code from OAuth callback

    Returns:
        Dictionary with access_token, refresh_token, and expires_at

    Raises:
        requests.exceptions.RequestException: If token exchange fails
    """
    url = "https://www.strava.com/oauth/token"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
    }

    response = requests.post(url, data=payload)
    response.raise_for_status()

    data = response.json()
    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
        "expires_at": data["expires_at"],
    }


def save_tokens(tokens: dict):
    """Save tokens to file.

    Args:
        tokens: Dictionary with access_token, refresh_token, and expires_at
    """
    import json

    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f, indent=2)

    # Set restrictive file permissions
    os.chmod(TOKEN_FILE, 0o600)
    print(f"✓ Tokens saved to {TOKEN_FILE}")


def main():
    """Run the OAuth authorization flow."""
    # Validate environment variables
    if not CLIENT_ID or not CLIENT_SECRET:
        print("Error: Missing Strava API credentials!")
        print("Please create a .env file with:")
        print("  STRAVA_CLIENT_ID=your_client_id")
        print("  STRAVA_CLIENT_SECRET=your_client_secret")
        print("\nGet your credentials from: https://www.strava.com/settings/api")
        sys.exit(1)

    # Build authorization URL
    scopes = "activity:read,activity:read_all"
    auth_url = (
        f"https://www.strava.com/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={scopes}"
    )

    print("=" * 70)
    print("Strava API OAuth Setup")
    print("=" * 70)
    print()
    print("This script will:")
    print("  1. Start a local HTTP server on port 8080")
    print("  2. Open your browser to authorize with Strava")
    print("  3. Save your access tokens to .strava_tokens.json")
    print()
    print("Starting local server on http://localhost:8080...")
    print()

    # Start HTTP server
    server = HTTPServer(("localhost", 8080), OAuthCallbackHandler)

    # Open browser
    print("Opening browser for authorization...")
    print(f"If the browser doesn't open automatically, visit:")
    print(f"  {auth_url}")
    print()
    webbrowser.open(auth_url)

    # Wait for callback
    print("Waiting for authorization callback...")
    global auth_code
    auth_code = None

    while auth_code is None:
        server.handle_request()

    print()
    print("✓ Authorization code received")
    print("Exchanging code for access tokens...")

    # Exchange code for tokens
    try:
        tokens = exchange_code_for_tokens(auth_code)
        save_tokens(tokens)

        print()
        print("=" * 70)
        print("SUCCESS! OAuth setup complete!")
        print("=" * 70)
        print()
        print("You can now use the Strava API integration.")
        print("Run: python -m import_strava.import_strava")
        print()

    except requests.exceptions.RequestException as e:
        print()
        print("ERROR: Failed to exchange authorization code for tokens")
        print(f"  {e}")
        print()
        print("Please try running this script again.")
        sys.exit(1)


if __name__ == "__main__":
    main()
