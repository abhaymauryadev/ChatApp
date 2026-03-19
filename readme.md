## QuickChat – Real‑time Chat App

QuickChat is a full‑stack real‑time chat application with user authentication, profile management, and live messaging using Socket.IO, React, and Node.js.

### Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB (Mongoose)
- **Other**: Cloudinary (for media), JSON Web Tokens (JWT)

### Project Structure
- **client**: React frontend (Vite)
- **server**: Express/Socket.IO backend and API routes

### Prerequisites
- Node.js (LTS or newer)
- npm
- MongoDB running locally or a MongoDB connection string

### 1. Environment Variables

Create a `.env` file inside the `server` folder:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/chatapp
SecretKey=your_long_random_jwt_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note**: Do not commit `.env` to git. It is already ignored by `.gitignore`.

### 2. Install Dependencies

From the project root:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Run the App in Development

#### Backend (API + Socket.IO)

```bash
cd server
npm run server   # uses nodemon server.js
```

The backend will start on `http://localhost:5000` (or the port from `PORT` env).

Check that it is running:

```bash
curl http://localhost:5000/api/status
# → "Server is Live"
```

#### Frontend (React + Vite)

Make sure `client/vite.config.js` includes the `/api` proxy to the backend:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

Then start the dev server:

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

Build the frontend:

```bash
cd client
npm run build
```

Start the backend in production mode:

```bash
cd server
NODE_ENV=production PORT=5000 npm start
```

Configure your hosting platform to:
- Run `npm run build` in `client` during the build step.
- Run `npm install && npm start` in `server` as the start command.

### 5. Scripts Reference

#### server/package.json
- **npm run server**: start backend with nodemon
- **npm start**: start backend with node

#### client/package.json
- **npm run dev**: start Vite dev server
- **npm run build**: build production assets
- **npm run preview**: preview built frontend locally

### 6. Notes
- Ensure MongoDB is running and accessible from `MONGODB_URI`.
- Update CORS, proxy, and environment values as needed when deploying.

