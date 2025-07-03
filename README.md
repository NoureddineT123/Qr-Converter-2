# QR Code Converter

A bidirectional QR code utility website that converts URLs to QR codes and decodes QR codes back to URLs.

## Features

- 🔗 **URL to QR Code**: Generate QR codes from any URL instantly
- 📷 **QR Code to URL**: Upload QR code images to decode back to URLs
- 📝 **Recent Activity**: Track your recent conversions with copy/download options
- 💾 **Download QR Codes**: Save generated QR codes as PNG files
- 📋 **Copy to Clipboard**: Easy copying of URLs and QR codes
- 🎨 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Activity history updates instantly

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- Shadcn/ui components
- TanStack Query for state management
- Wouter for routing

### Backend
- Express.js with TypeScript
- QRCode library for generation
- Jimp + qrcode-reader for decoding
- Multer for file uploads
- In-memory storage for activities

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/qr-code-converter.git
cd qr-code-converter
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the settings and deploy
5. Your app will be live at `https://your-app-name.vercel.app`

### Deploy to Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "New Site from Git" and select your repository
4. Set build command to `npm run build` and publish directory to `dist`
5. Deploy automatically

### Deploy to Railway
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign in with GitHub
3. Click "New Project" and select "Deploy from GitHub repo"
4. Select your repository and deploy

## Usage

1. **Generate QR Code**: Enter any URL in the first section and click "Generate QR Code"
2. **Decode QR Code**: Upload a QR code image in the second section and click "Decode QR Code"
3. **View Activity**: See your recent conversions in the "Recent Activity" section
4. **Download/Copy**: Use the action buttons to download QR codes or copy URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).