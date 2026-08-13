# MindSpark Backend

This is the backend service for MindSpark University Edition, providing authentication, profile management, and device syncing.

## Tech Stack
- **Node.js** & **Express**
- **SQLite3** (Database)
- **JSON Web Tokens (JWT)** (Authentication)
- **bcrypt** (Password hashing)

## Prerequisites
- Node.js (v14 or higher)
- npm

## Setup & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy and edit `.env.example` to `.env`):
   - `JWT_SECRET`: Secret key used to sign JWT tokens.
   - `PORT`: The port the server listens on (default: `34567`).
   - `GROQ_API_KEY`: Groq Cloud API Key used to proxy AI completions.
   - **Email Verification (Resend API)**:
     - `RESEND_API_KEY`: API key for the Resend email service.
     - `EMAIL_FROM`: Sender address for notifications (e.g. `onboarding@resend.dev`).
     - `APP_URL`: Base application URL for verification links (e.g. `http://localhost:34567`).
   - **Email Verification Fallback (SMTP Configurations)**:
     - `SMTP_HOST`: Host address of the SMTP server.
     - `SMTP_PORT`: Port for SMTP connection (default: `587`).
     - `SMTP_USER`: SMTP username.
     - `SMTP_PASS`: SMTP password.
     - `SMTP_FROM`: Sender address/name for SMTP (default: `"MindSpark" <no-reply@mindspark.edu>`).
   
   *Note: If no email settings are configured, verification emails/codes will be logged to the server console in development.*

3. Start the server:
   ```bash
   node server.js
   ```

   The server will start on `http://localhost:34567`.
   The SQLite database (`mindspark.sqlite`) will be automatically created on first run in this directory.

## API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new account. Requires `email`, `password`, optional `displayName`. Note: Newly created accounts are inactive (`is_active = 0`) and require email verification.
- `POST /api/auth/login`: Log in to an account. Requires `email`, `password`. Rejects inactive accounts with a `403 Forbidden` status.
- `POST /api/auth/verify-code`: Activate account using 6-digit verification code. Requires `email`, `code`.
- `POST /api/auth/resend-code`: Resend verification email and regenerate code. Requires `email`.
- `GET /api/auth/activate`: Direct link activation via token. Requires `token` query parameter. Redirects to frontend with success/error params.
- `POST /api/auth/reset-password`: Verify identity and reset password. Requires `email`, `studentId`, `newPassword`. Checks input student ID against database profile.

### Profile
- \`GET /api/profile\`: Get the authenticated user's profile and usage stats.
- \`PUT /api/profile\`: Update profile fields (\`displayName\`, \`college\`, \`major\`, \`studentId\`, \`program\`, \`avatar\`, \`bio\`).

### Usage Sync
- \`POST /api/usage/sync\`: Sync client-side usage stats (\`toolUsage\`, \`streak\`, \`xp\`, \`level\`, \`badges\`, \`weeklyData\`) to the server.

### AI Completion Proxy
- \`POST /api/chat\`: Proxy completions requests to the Groq API. Accepts \`{ messages, model, temperature, max_tokens, stream }\` in the request body. Fully supports Server-Sent Events (SSE) streaming.

*Note: All \`/api/profile\` and \`/api/usage/sync\` endpoints require a \`Authorization: Bearer <token>\` header. The \`/api/chat\` endpoint accepts an optional token.*

## Production Readiness
For production deployment:
- Ensure you set a strong \`JWT_SECRET\` environment variable.
- Configure CORS to restrict allowed origins instead of allowing all (which \`cors()\` does by default).
- Always run the server behind a reverse proxy (like Nginx) handling HTTPS to ensure passwords and JWTs are transmitted securely.
