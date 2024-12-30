# Torus Forms

A full-stack form builder application built with Next.js, Express, and MongoDB.

## Features

- 🎨 Drag-and-drop form builder
- 📝 Multiple field types (text, number, date, checkbox, dropdown, radio)
- 🔗 Form sharing via unique links
- 📊 Form submission collection and management
- 🔄 Submission export to CSV
- 📱 Responsive design

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm (v7 or higher)

## Project Structure

```
torus-forms/
├── client/                # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # React components
│   │   └── types/      # TypeScript types
│   └── public/         # Static files
└── server/             # Express backend
    └── src/
        ├── models/    # MongoDB models
        ├── routes/    # API routes
        └── types/    # TypeScript types
```

## Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sapekshpareek/torus-forms.git
cd torus-forms
```

2. **Install MongoDB:**
   - Download and install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Make sure MongoDB service is running:
     ```bash
     # On Windows (in PowerShell as Administrator):
     net start MongoDB
     
     # On macOS/Linux:
     sudo systemctl start mongod
     ```

3. **Set up the server:**
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Install additional required packages
npm install uuid json2csv

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/torus-forms
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development" > .env
```

4. **Set up the client:**
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create required directories
mkdir -p src/app
mkdir -p src/components
mkdir -p src/types

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

5. **Create basic Next.js app structure:**
```bash
# In client/src/app directory, create page.tsx
echo "export default function Home() {
  return <div>Welcome to Torus Forms</div>;
}" > src/app/page.tsx

# Create layout.tsx
echo "export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}" > src/app/layout.tsx
```

6. **Install root project dependencies:**
```bash
# Navigate back to project root
cd ..

# Install dependencies
npm install
```

7. **Start the development servers:**
```bash
# Start both client and server
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Troubleshooting

1. **MongoDB Connection Issues:**
   - Ensure MongoDB is running: `mongo` or `mongosh` in terminal
   - Check MongoDB connection string in server/.env
   - Verify MongoDB port (default: 27017)

2. **Port Conflicts:**
   - If port 3000 or 5000 is in use, modify in respective .env files
   - Kill processes using: `npx kill-port 3000 5000`

3. **Module Not Found Errors:**
   - Run `npm install` in each directory (root, client, server)
   - Check package.json for missing dependencies
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

4. **TypeScript Errors:**
   - Ensure all required types are installed
   - Run `npm install @types/node @types/react @types/react-dom --save-dev`

## API Endpoints

### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get a specific form
- `PUT /api/forms/:id` - Update a form
- `DELETE /api/forms/:id` - Delete a form

### Submissions
- `POST /api/submissions` - Submit a form response
- `GET /api/submissions/:formId` - Get all submissions for a form
- `GET /api/submissions/:formId/export` - Export form submissions as CSV

## License

MIT
