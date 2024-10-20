# Starting with Vite: Your Home Frontend

This project is frontend(client side) part of the Your home web application

## Scripts

These scripts streamline the process of starting your development server, building your project, cleaning old builds, linting your code, previewing your production build, and running tests.

In the client-side directory, you can run:

### 1\. start

* **Purpose:** Starts the Vite development server. This is typically used for serving your project during development.
* **Usage:** `npm start`

### 2\. dev

* **Purpose:** Alias for the "start" script, also starts the Vite development server.
* **Usage**: `npm run dev`

### 3\. clean

* **Purpose:** Uses rimraf to delete the dist directory. This is useful for cleaning up old build files before a new build.
* **Usage:** `npm run clean`

### 4\. build

* **Purpose:** Cleans the dist directory and builds the project for production using Vite.
* **Usage:** `npm run build`

### 5\. lint

* **Purpose:** Runs ESLint on the src directory, checking files with .js and .jsx extensions, reports unused disable directives, and fails if there are any warnings. Ensuring code quality.
* **Usage:** `npm run lint`

### 6\. preview

* **Purpose:** Starts the Vite preview server to serve the built project, allowing you to test the production build locally.
* **Usage:** `npm run preview`

### 7\. test

* **Purpose:** Runs tests using Jest to ensure your code is functioning correctly
* **Usage:** `npm test`