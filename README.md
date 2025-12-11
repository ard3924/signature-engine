# BoloSign - PDF Signature Engine

A full-stack web application for digitally signing PDF documents. Users can upload PDFs, add signature fields, capture signatures, and download the signed documents.

## Features

- **PDF Viewing**: View PDF documents directly in the browser
- **Signature Capture**: Draw signatures using a canvas interface
- **Field Placement**: Drag and drop signature fields on PDF pages
- **Digital Signing**: Embed signatures into PDF documents
- **Download Signed PDFs**: Save signed documents locally

## Tech Stack

### Frontend

- **React** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling framework
- **PDF.js** - PDF rendering and viewing
- **React PDF** - React components for PDF display
- **React Signature Canvas** - Signature capture component
- **React RND** - Draggable and resizable components

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **PDF-lib** - PDF manipulation library
- **Multer** - File upload handling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bolosign-signature-engine
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017/bolosign
     PORT=5000
     ```

## Usage

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

   The server will run on `http://localhost:5000`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Upload a PDF document
   - Add signature fields by clicking on the PDF
   - Draw your signature in the signature pad
   - Click "Sign PDF" to embed the signature
   - Download the signed PDF

## API Documentation

### POST /api/sign-pdf

Signs a PDF document by embedding signature images at specified positions.

**Request Body:**

```json
{
  "pdfId": "string",
  "fields": [
    {
      "type": "signature",
      "dataUrl": "data:image/png;base64,...",
      "xNorm": 0.1,
      "yNorm": 0.2,
      "wNorm": 0.3,
      "hNorm": 0.1
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "signedPdfUrl": "http://localhost:5000/signed/filename.pdf"
}
```

**Parameters:**

- `pdfId`: Unique identifier for the PDF file
- `fields`: Array of signature fields
  - `type`: Field type (currently supports "signature")
  - `dataUrl`: Base64 encoded PNG image of the signature
  - `xNorm`, `yNorm`: Normalized coordinates (0-1) for field position
  - `wNorm`, `hNorm`: Normalized dimensions (0-1) for field size

## Project Structure

```
bolosign-signature-engine/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── signed/          # Signed PDF storage
│   ├── pdfs/            # Original PDF storage
│   ├── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── api/         # API client
│   ├── index.html
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
