# Aeroplanar Frontend

A comprehensive Next.js-based application for 2D-to-3D conversion, architectural modeling, and advanced 3D scene editing. Features a React frontend with professional 3D editing tools and a Python FastAPI backend for AI-powered model generation.

## Features

### Core Generation
- 🖼️ **Image Upload**: Drag and drop interface for image uploads
- 🎨 **3D Model Generation**: Convert 2D images to 3D models using Tripo3D API
- 🏗️ **Architecture Models**: Generate architectural elements and building components
- 🌐 **3D Visualization**: Interactive 3D model viewer using Three.js and React Three Fiber

### Advanced Editing Tools
- ✂️ **3D Editing Suite**: Professional 3D editing tools with transform gizmos
- 📐 **Resize & Transform**: Precise scaling, rotation, and positioning controls
- 🎯 **Object Selection**: Multi-object selection and manipulation
- 🗂️ **Scene Management**: Organize and manage complex 3D scenes
- 📦 **Primitive Generation**: Add basic 3D shapes (cubes, spheres, cylinders, etc.)

### Performance & Export
- 🚀 **Performance Monitoring**: Real-time scene performance tracking and optimization
- 📊 **Resource Management**: Automatic performance limiting and quality adjustment
- 📥 **Scene Export**: Download entire 3D scenes or individual models
- 🎛️ **Multiple Formats**: Support for GLB, GLTF, OBJ, and other 3D formats

### User Experience
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- 🎯 **Real-time Progress**: Track conversion progress and status updates
- 🌙 **Theme Support**: Light and dark mode themes
- ⚡ **Optimized Performance**: Efficient rendering and resource management

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and Suspense
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Three.js** - WebGL 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers and abstractions for R3F
- **Lucide React** - Beautiful & consistent icons

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
│   └── page.tsx           # Main application page
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main API server
│   ├── requirements.txt   # Python dependencies
│   └── models/           # Generated 3D models
├── components/            # React components
│   ├── ui/               # Reusable UI components (buttons, dialogs, etc.)
│   ├── generation-panel.tsx      # Image upload and generation
│   ├── architecture-panel.tsx    # Architecture model generation
│   ├── editing-3d-sidebar.tsx    # 3D editing tools sidebar
│   ├── model-3d.tsx             # 3D model viewer and renderer
│   ├── primitive-3d.tsx         # 3D primitive shapes generator
│   ├── transform-gizmo.tsx      # 3D transform controls
│   ├── resize-toolbar.tsx       # Object resizing tools
│   ├── scene-performance-monitor.tsx # Performance tracking
│   ├── performance-limit-dialog.tsx  # Performance management
│   ├── model-stats.tsx          # Model statistics display
│   └── theme-provider.tsx       # Theme context provider
├── hooks/                 # Custom React hooks
│   ├── use-toast.tsx     # Toast notification hook
│   └── use-scene-performance.tsx # Performance monitoring hook
├── lib/                   # Utility functions and configurations
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

### Basic 3D Generation
1. **Upload Image**: Drag and drop an image file onto the upload zone
2. **Configure Settings**: Adjust model version, style, and texture resolution
3. **Generate 3D Model**: Click "Generate 3D Model" to start conversion
4. **Monitor Progress**: Track the conversion progress in real-time
5. **View Results**: Interact with the generated 3D model in the viewer

### Advanced 3D Editing
1. **Add Primitives**: Use the primitive panel to add basic 3D shapes to your scene
2. **Transform Objects**: Select objects and use the transform gizmo for precise positioning
3. **Edit Properties**: Use the editing sidebar to modify object properties and materials
4. **Architecture Tools**: Generate architectural elements like walls, columns, and structures
5. **Performance Monitoring**: Keep track of scene performance with the built-in monitor

### Export and Download
1. **Individual Models**: Download specific 3D models in various formats
2. **Whole Scene**: Export the entire 3D scene including all objects and their transforms
3. **Format Options**: Choose from GLB, GLTF, OBJ, and other supported formats

## Configuration Options

### Model Generation Parameters
- **Model Version**: Choose from available Tripo3D model versions
- **Style**: Apply different artistic styles to the 3D model
- **Texture Resolution**: Set the quality of texture mapping (512, 1024, 2048)
- **Remesh**: Control mesh optimization (none, low, medium, high)

### 3D Editing Options
- **Transform Tools**: Move, rotate, and scale objects with precision
- **Primitive Shapes**: Add cubes, spheres, cylinders, cones, and more
- **Material Properties**: Adjust colors, opacity, and surface properties
- **Scene Organization**: Group and organize objects in hierarchical structures
- **Performance Settings**: Adjust quality and performance limits for optimal experience

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

5. **Performance Issues**
   - Monitor scene performance using the built-in performance monitor
   - Reduce the number of objects in the scene
   - Lower texture resolution for better performance
   - Use the performance limit dialog to automatically optimize settings

6. **3D Editing Problems**
   - Ensure you have selected an object before trying to transform it
   - Check that the transform gizmo is visible and responsive
   - Verify that editing mode is enabled in the sidebar

### Performance Tips

- Use appropriate image sizes for faster processing (recommended: 1024x1024 or smaller)
- Monitor scene performance regularly with the built-in performance monitor
- Limit the number of high-poly models in a single scene
- Use lower texture resolutions for preview and higher for final export
- Close unnecessary browser tabs to free up memory
- Consider using a dedicated GPU for better 3D rendering
- Enable hardware acceleration in your browser settings
- Use primitive shapes for prototyping before adding detailed models

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
