"""OAuth2 token management for Strava API."""

import json
import os
import time
from typing import Optional
import requests


class StravaAuth:
    """Manages OAuth2 tokens for Strava API authentication."""

    def __init__(self, token_file: str = ".strava_tokens.json"):
        """Initialize the auth manager.

        Args:
            token_file: Path to file for storing OAuth tokens
        """
        self.token_file = token_file
        self.client_id = os.getenv("STRAVA_CLIENT_ID")
        self.client_secret = os.getenv("STRAVA_CLIENT_SECRET")

        if not self.client_id or not self.client_secret:
            raise ValueError(
                "Missing Strava API credentials. "
                "Please set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET environment variables."
            )

    def load_tokens(self) -> Optional[dict]:
        """Load tokens from file.

        Returns:
            Dictionary with access_token, refresh_token, and expires_at, or None if file doesn't exist
        """
        if not os.path.exists(self.token_file):
            return None

        with open(self.token_file, "r") as f:
            return json.load(f)

    def save_tokens(self, tokens: dict):
        """Save tokens to file.

        Args:
            tokens: Dictionary with access_token, refresh_token, and expires_at
        """
        with open(self.token_file, "w") as f:
            json.dump(tokens, f, indent=2)

        # Set restrictive file permissions
        os.chmod(self.token_file, 0o600)

    def is_token_valid(self, tokens: dict) -> bool:
        """Check if access token is still valid.

        Args:
            tokens: Dictionary with access_token, refresh_token, and expires_at

        Returns:
            True if token is valid and not expired
        """
        if not tokens or "expires_at" not in tokens:
            return False

        # Add 5 minute buffer before expiration
        return time.time() < (tokens["expires_at"] - 300)

    def refresh_access_token(self, refresh_token: str) -> dict:
        """Refresh the access token using the refresh token.

        Args:
            refresh_token: The refresh token from previous authorization

        Returns:
            Dictionary with new access_token, refresh_token, and expires_at

        Raises:
            requests.exceptions.RequestException: If refresh fails
        """
        url = "https://www.strava.com/oauth/token"
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }

        response = requests.post(url, data=payload)
        response.raise_for_status()

        data = response.json()
        return {
            "access_token": data["access_token"],
            "refresh_token": data["refresh_token"],
            "expires_at": data["expires_at"],
        }

    def get_access_token(self) -> str:
        """Get a valid access token, refreshing if necessary.

        Returns:
            Valid access token

        Raises:
            FileNotFoundError: If no tokens file exists (need to run auth setup first)
            requests.exceptions.RequestException: If token refresh fails
        """
        tokens = self.load_tokens()

        if not tokens:
            raise FileNotFoundError(
                f"No tokens file found at {self.token_file}. "
                "Please run the OAuth setup script first (scripts/strava_auth_setup.py)"
            )

        if self.is_token_valid(tokens):
            return tokens["access_token"]

        # Token expired, refresh it
        print("Access token expired, refreshing...")
        new_tokens = self.refresh_access_token(tokens["refresh_token"])
        self.save_tokens(new_tokens)
        print("Token refreshed successfully")

        return new_tokens["access_token"]

    def clear_tokens(self):
        """Clear tokens file (useful when re-authorizing)."""
        if os.path.exists(self.token_file):
            os.remove(self.token_file)
            print(f"Cleared tokens from {self.token_file}")
