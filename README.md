# Q-Search Setup and Run Instructions

## Backend Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/skyjade10/q-search.git
   cd q-search/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the `backend` directory and add the following:
   ```env
   TINYFISH_API_KEY
   TINYFISH_BASE_URL
   //for local hosting change the link to local hosting
   SERPAPI_KEY
   PORT=3000
   ```

4. **Run the backend server:**
   ```bash
   npm start
   ```

## Client Setup
1. **Navigate to the client directory:**
   ```bash
   cd ../client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the client application:**
   ```bash
   npm start
   ```

## Common Issues
- Ensure that you have Node.js installed. Use `node -v` to check the version.
- If you encounter issues with missing modules, try deleting `node_modules` and running `npm install` again.
