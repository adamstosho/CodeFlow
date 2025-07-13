# Code-to-Diagram Converter Backend API Documentation

## Overview
This backend provides APIs for user authentication and converting JavaScript/Python code into Mermaid.js flowcharts. It is built with Node.js, Express, MongoDB, and JWT authentication.

---

## Base URL
```
http://<your-backend-domain>/api
```

---

## Authentication
All authentication endpoints are under `/api/auth`.

### 1. Register (Signup)
- **Endpoint:** `POST /api/auth/signup`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Validation:**
  - `name`: required
  - `email`: required, must be valid
  - `password`: required, min 6 chars
- **Response:**
  - **Success (201):**
    ```json
    {
      "success": true,
      "message": "User registered successfully.",
      "token": "<jwt_token>"
    }
    ```
  - **Error (400):**
    ```json
    {
      "success": false,
      "message": "Validation failed.",
      "errors": [
        { "field": "email", "message": "Valid email is required." }
      ]
    }
    ```

### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Log in an existing user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Validation:**
  - `email`: required, must be valid
  - `password`: required
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "token": "<jwt_token>"
    }
    ```
  - **Error (401/400):**
    ```json
    {
      "success": false,
      "message": "Invalid credentials."
    }
    ```

---

## Code Conversion
All code conversion endpoints are under `/api/convert` and require authentication (JWT in `Authorization` header).

### 3. Convert Code to Mermaid
- **Endpoint:** `POST /api/convert`
- **Description:** Convert JavaScript or Python code to Mermaid.js flowchart syntax.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Request Body:**
  ```json
  {
    "code": "function foo(x) { if (x > 0) { return 1; } else { return -1; } }",
    "language": "javascript"
  }
  ```
  - `code`: required, string
  - `language`: required, one of `javascript` or `python`
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "mermaid": "graph TD\nN0[Start]\nN0-->N1[Function: foo]\nN1-->N2{If}\nN2-->N3[Return]\nN2-->N4[Return]\nN4-->End[End]"
    }
    ```
  - **Error (400):**
    ```json
    {
      "success": false,
      "message": "Invalid JavaScript code."
    }
    ```
  - **Python Placeholder:**
    ```json
    {
      "success": true,
      "mermaid": "Python parsing not yet implemented."
    }
    ```

---

## Diagram History & Sharing
All diagram endpoints are under `/api/diagrams` and require authentication (except for public sharing).

### Diagram Model
- `user`: User ID (owner)
- `code`: Original code snippet
- `language`: Code language
- `mermaid`: Generated Mermaid syntax
- `createdAt`: Timestamp
- `shared`: Boolean (default: false) — whether the diagram is public/shareable
- `_id`: Diagram ID

## Diagram History (User's Saved Diagrams)

### 1. List All Diagrams (History)
- **Endpoint:** `GET /api/diagrams`
- **Description:** List all diagrams for the logged-in user (history of all conversions).
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  ```json
  {
    "success": true,
    "diagrams": [
      {
        "_id": "...",
        "code": "...",
        "language": "...",
        "mermaid": "...",
        "createdAt": "...",
        "shared": false
      },
      ...
    ]
  }
  ```

### 2. Get a Single Diagram
- **Endpoint:** `GET /api/diagrams/:id`
- **Description:** Get a specific diagram for the logged-in user.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  ```json
  {
    "success": true,
    "diagram": {
      "_id": "...",
      "code": "...",
      "language": "...",
      "mermaid": "...",
      "createdAt": "...",
      "shared": false
    }
  }
  ```

### 3. Update a Diagram
- **Endpoint:** `PATCH /api/diagrams/:id`
- **Description:** Update a diagram's code and regenerate the mermaid diagram.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Request Body:**
  ```json
  {
    "code": "function updated(x) { return x * 2; }",
    "language": "javascript"
  }
  ```
  - `code`: required, string
  - `language`: required, one of `javascript` or `python`
- **Response:**
  ```json
  {
    "success": true,
    "diagram": {
      "_id": "...",
      "code": "function updated(x) { return x * 2; }",
      "language": "javascript",
      "mermaid": "graph TD\nN0[Start]\nN0-->N1[Function: updated]\nN1-->N2[Return]\nN2-->End[End]",
      "createdAt": "...",
      "shared": false
    }
  }
  ```

### 4. Delete a Diagram
- **Endpoint:** `DELETE /api/diagrams/:id`
- **Description:** Delete a diagram for the logged-in user.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Diagram deleted."
  }
  ```

### 8. Toggle Diagram Sharing
- **Endpoint:** `PATCH /api/diagrams/:id/share`
- **Description:** Set whether a diagram is public/shareable.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Request Body:**
  ```json
  {
    "shared": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "diagram": {
      "_id": "...",
      "shared": true,
      ...
    }
  }
  ```

### 9. Public Shareable Link
- **Endpoint:** `GET /api/diagrams/share/:id`
- **Description:** Get a diagram by ID (public, no auth) — only works if `shared: true`.
- **Response:**
  ```json
  {
    "success": true,
    "diagram": {
      "_id": "...",
      "code": "...",
      "language": "...",
      "mermaid": "...",
      "createdAt": "...",
      "shared": true
    }
  }
  ```
- **Error (if not shared):**
  ```json
  {
    "success": false,
    "message": "Diagram not found or not shared."
  }
  ```

### 10. Export Diagram as SVG
- **Endpoint:** `POST /api/diagrams/export`
- **Description:** Convert Mermaid code to SVG (returns SVG image). JWT required.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Request Body:**
  ```json
  {
    "mermaid": "graph TD; ..."
  }
  ```
- **Response:**
  - **Success (200):** SVG image (Content-Type: image/svg+xml)
  - **Error (400):**
    ```json
    {
      "success": false,
      "message": "Mermaid code is required."
    }
    ```

---

## Notes on Diagram Creation
- You can set `shared: true` in the `/api/convert` request body to immediately make a diagram public/shareable.
- Example:
  ```json
  {
    "code": "function foo(x) { return x; }",
    "language": "javascript",
    "shared": true
  }
  ```
- If omitted, `shared` defaults to `false` (private).

---

## Error Handling
- All errors return JSON with `success: false` and a `message`.
- Validation errors include an `errors` array with field-specific messages.
- Example:
  ```json
  {
    "success": false,
    "message": "Validation failed.",
    "errors": [
      { "field": "code", "message": "Code is required." }
    ]
  }
  ```

---

## Security
- All sensitive routes require JWT authentication.
- Passwords are hashed with bcrypt.
- CORS is restricted to allowed origins (see `.env`).
- Security middleware: helmet, express-rate-limit.
- Only diagrams with `shared: true` are accessible via public links.

---

## Environment Variables
See `.env.example` for all required variables:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRES_IN`: JWT token expiry
- `ALLOWED_ORIGINS`: Comma-separated allowed CORS origins
- `PYTHON_SERVICE_URL`: Python microservice URL (for future)

---

## Example Usage
### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3. Convert Code
```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"code":"function foo(x) { if (x > 0) { return 1; } else { return -1; } }","language":"javascript"}'
```

### 4. Update Diagram
```bash
curl -X PATCH http://localhost:5000/api/diagrams/<diagram_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"code":"function updated(x) { return x * 2; }","language":"javascript"}'
```

### 5. Toggle Sharing
```bash
curl -X PATCH http://localhost:5000/api/diagrams/<diagram_id>/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"shared": true}'
```

### 6. Get Public Diagram
```bash
curl -X GET http://localhost:5000/api/diagrams/share/<diagram_id>
```

---

## Notes
- Python code conversion is a placeholder; future support will use a Python microservice.
- All responses are JSON.
- For questions or issues, see the main README or contact the maintainer. 