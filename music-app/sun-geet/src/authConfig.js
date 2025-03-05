export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = "YOUR_SPOTIFY_CLIENT_ID"; // Replace with your actual Client ID
export const redirectUri = "http://localhost:5173/callback"; // Ensure this matches your Spotify Developer Dashboard
export const scopes = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "user-read-email",
  "user-read-private"
];

// Construct the login URL for Spotify authentication
export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
