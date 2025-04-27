# 📅 Calendar Touch Display

A clean, touchscreen-friendly calendar display for families, classrooms, and offices.  
Runs on Node.js + Docker. Works great on TVs, tablets, and kiosks!

---

## 🚀 Features

- Dual Google Calendars displayed side-by-side
- Touchscreen friendly buttons
- View toggle: Daily / Weekly view
- Always visible \"Next Event\" cards
- Auto-refresh every 5 minutes
- Admin-only PIN lockout (optional)
- Responsive design (scales to TVs, tablets, phones)
- Dockerized for simple deployment

---

## ⚙️ Local Setup

1. **Clone the repo:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/calendar-touch-display.git
   cd calendar-touch-display

2. **Install dependencies:**

    ```bash
    cd backend
    npm install

3. **Prepare Google API credentials:**

    * Create a credentials/credentials.json file (OAuth 2.0 credentials).
    * Generate a credentials/token.json after authorizing your app.
    * Do NOT commit these to GitHub.

4. **Start the server locally:**

    ```bash
    node backend/server.js

5. **Open the app:**
    
    Open your browser at: http://localhost:3000

## 🐳 Docker Deployment (optional)

1. **Build the Docker image:**

    ``bash
    docker build -t calendar-touch-display .

2. **Run with Docker Compose:**

    ``bash
    docker-compose up -d --build

3. **Server will be available at:**
    
    http://your-server-ip/