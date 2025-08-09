# Aeroplanar Frontend

A Next.js-based frontend application for converting 2D images to 3D models using the Tripo3D API. The project includes a React frontend with 3D model visualization capabilities and a Python FastAPI backend for image processing and API integration.

## Features

- 🖼️ **Image Upload**: Drag and drop interface for image uploads
- 🎨 **3D Model Generation**: Convert 2D images to 3D models using Tripo3D API
- 🌐 **3D Visualization**: Interactive 3D model viewer using Three.js and React Three Fiber
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- 🎯 **Real-time Progress**: Track conversion progress and status updates
- 📦 **Multiple Formats**: Support for various 3D model formats (GLB, GLTF, OBJ)

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pillow** - Image processing
- **Pydantic** - Data validation
- **Python-multipart** - File upload handling

## Prerequisites

- **Node.js** 18+ and **npm** or **pnpm**
- **Python** 3.8+
- **Tripo3D API Key** (for 3D model generation)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd aeroplanar-frontend
```

### 2. Install Frontend Dependencies
```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install

# Using yarn
yarn install
```

### 3. Install Backend Dependencies
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Return to root directory
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```env
# Tripo3D API Configuration
TRIPO3D_API_KEY=your_api_key_here

# Backend Configuration
BACKEND_URL=http://localhost:8000

# Frontend Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Create a `.env` file in the `backend/` directory:
```env
# Tripo3D API Configuration
TRIPO3D_API_KEY=your_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

## Running the Project

### Development Mode

#### 1. Start the Backend Server
```bash
cd backend

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

#### 2. Start the Frontend Development Server
```bash
# In a new terminal, from the root directory
npm run dev
# or
pnpm dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Production Mode

#### 1. Build the Frontend
```bash
npm run build
# or
pnpm build
# or
yarn build
```

#### 2. Start Production Server
```bash
npm start
# or
pnpm start
# or
yarn start
```

## Project Structure

```
aeroplanar-frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main API server
│   ├── requirements.txt   # Python dependencies
│   └── models/           # Generated 3D models
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── generation-panel.tsx  # Image upload and generation
│   ├── model-3d.tsx      # 3D model viewer
│   └── model-stats.tsx   # Model statistics
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets
```

## API Endpoints

### Backend API (FastAPI)

- `GET /` - Health check
- `POST /convert/image-to-3d` - Convert image to 3D model
- `GET /task/{task_id}` - Get task status
- `GET /task/{task_id}/download` - Download generated 3D model
- `GET /models/{filename}` - Serve 3D model files

### Frontend Routes

- `/` - Home page with image upload and 3D viewer
- `/api/*` - API routes (if any)

## Usage

1. **Upload Image**: Drag and drop an image file onto the upload zone
2. **Configure Settings**: Adjust model version, style, and texture resolution
3. **Generate 3D Model**: Click "Generate 3D Model" to start conversion
4. **Monitor Progress**: Track the conversion progress in real-time
5. **View Results**: Interact with the generated 3D model in the viewer
6. **Download**: Download the 3D model in your preferred format

## Configuration Options

### Model Generation Parameters
- **Model Version**: Choose from available Tripo3D model versions
- **Style**: Apply different artistic styles to the 3D model
- **Texture Resolution**: Set the quality of texture mapping (512, 1024, 2048)
- **Remesh**: Control mesh optimization (none, low, medium, high)

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure the backend server is running on port 8000
   - Check firewall settings
   - Verify the `BACKEND_URL` environment variable

2. **API Key Issues**
   - Verify your Tripo3D API key is valid
   - Check the `.env` file configuration
   - Ensure the API key has sufficient credits

3. **Image Upload Problems**
   - Check file format (JPEG, PNG supported)
   - Ensure file size is reasonable (< 10MB recommended)
   - Verify image dimensions are appropriate

4. **3D Model Loading Issues**
   - Check browser console for errors
   - Ensure WebGL is enabled in your browser
   - Try refreshing the page

### Performance Tips

- Use appropriate image sizes for faster processing
- Close unnecessary browser tabs to free up memory
- Consider using a dedicated GPU for better 3D rendering

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Open an issue on GitHub

## Acknowledgments

- [Tripo3D](https://tripo3d.ai/) for 3D model generation API
- [Next.js](https://nextjs.org/) for the React framework
- [Three.js](https://threejs.org/) for 3D graphics
- [Tailwind CSS](https://tailwindcss.com/) for styling
