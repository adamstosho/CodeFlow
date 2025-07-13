# CodeFlow - Code to Diagram Converter

A modern web application that converts JavaScript into visual flowcharts using Mermaid.js. Built with React, Node.js, and MongoDB.

## Problem Statement

Developers often struggle to understand complex code logic and share their code structure with non-technical stakeholders. Traditional documentation methods are time-consuming and don't provide immediate visual feedback.

## Solution

CodeFlow automatically analyzes your code and generates interactive flowcharts that visualize:
- Function calls and control flow
- Conditional statements and loops
- Return statements and program flow
- Code structure and logic paths

## Real-World Use Cases

- **Code Reviews**: Quickly visualize complex functions for team discussions
- **Documentation**: Generate visual documentation for legacy code
- **Teaching**: Help students understand programming concepts visually
- **Architecture Planning**: Visualize code structure before implementation
- **Client Presentations**: Share code logic with non-technical stakeholders

## ✨ Features

### Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and API endpoints

### Code Conversion
- **JavaScript Support**: Full AST parsing and flowchart generation
- **Python Support**: Basic parsing with placeholder implementation (Although it is still in process)
- **Real-time Preview**: Instant diagram generation as you type
- **Syntax Highlighting**: Monaco Editor integration for better code editing

### Diagram Management
- **Save & Organize**: Store all your diagrams with metadata
- **Edit & Update**: Modify existing diagrams and regenerate flowcharts
- **History View**: Access all your previous conversions
- **Delete**: Remove unwanted diagrams

### **Sharing & Collaboration**
- **Public Sharing**: Make diagrams shareable with unique URLs
- **Social Media Integration**: Share directly to WhatsApp, Facebook, Twitter, LinkedIn
- **Email Sharing**: Send diagrams via email
- **Mobile Native Sharing**: Use device's native sharing options
- **Copy Link**: One-click link copying with visual feedback

### Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Tailwind CSS with consistent styling
- **Interactive Diagrams**: Click and explore flowchart nodes
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Mermaid.js** for diagram rendering
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Acorn** for JavaScript AST parsing
- **Puppeteer** for diagram generation
- **Swagger** for API documentation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamstosho/codeflow.git
   cd codeflow
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
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start the development servers**

   Backend (from `backend/` directory):
   ```bash
   npm run dev
   ```

   Frontend (from `frontend/` directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## Usage

### Basic Workflow
1. **Register/Login**: Create an account or sign in
2. **Write Code**: Use the Monaco editor to write JavaScript or Python code
3. **Generate Diagram**: Click "Convert" to generate a flowchart
4. **Save**: Save your diagram to your history
5. **Share**: Make it public and share with others

**_### Come and Look at the Uniqueness of the Project here_** 
### Sharing Diagrams
1. **Make Public**: Click the eye icon on a diagram card
2. **Share**: Click the share button to open sharing options
3. **Choose Platform**: Select your preferred sharing method
4. **Share Link**: Copy the direct link or use social media integration


## 🔧 API Endpoints
### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Code Conversion
- `POST /api/convert` - Convert code to Mermaid diagram

### Diagram Management
- `GET /api/diagrams` - Get user's diagrams
- `GET /api/diagrams/:id` - Get specific diagram
- `PATCH /api/diagrams/:id` - Update diagram
- `DELETE /api/diagrams/:id` - Delete diagram
- `PATCH /api/diagrams/:id/share` - Toggle sharing

### Public Sharing
- `GET /api/diagrams/share/:id` - Access shared diagram


##Now Check the Preview of the App 

![screenshot](/frontend/public/6026130143728224889.jpg)
**Here is the landing page of the app** You can have the preview of the overall app here and the description is also detailed there
![screenshot](/frontend/public/6026130143728224895.jpg)
**Here is the dashobard of the app** it also details the pages and the history of the generated diagram
![screenshot](/frontend/public/6026130143728224899.jpg)
**Here is the sample of the generated diagram with the javscript code** __Note that the python will be implemented later__
![screenshot](/frontend/public/6026130143728224900.jpg)
**This modal shows the link sharing options**. You can actually share the link to different social media from here.


## 🏗️ Project Structure

```
codeflow/
├── backend/                 # Node.js API server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth and validation
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # AST parsing and conversion
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) for diagram rendering
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for code editing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Acorn](https://github.com/acornjs/acorn) for JavaScript parsing

##  Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ by ART_Redox for the developer community** 
**_Powered by DLT Africa_**