# 📊 ESG Data Challenge Dashboard

This project is a Front-end Dashboard designed for analyzing **ESG (Environmental, Social, and Governance) indicators**, specifically focusing on visualizing CO₂ emissions and energy consumption data uploaded via an Excel file.

The application leverages **Vite** for rapid development, **React** and **TypeScript** for component architecture and strict typing, **Tailwind CSS** for styling, and **Recharts** for data visualization.

---

## 🚀 How to Run the Project

To get the project running, follow the steps below. This guide assumes your **Backend server (Express/Node.js)** is already operational and listening on `http://localhost:3000/api`.

### 1. Prerequisites

* **Excel file for the upload**
[example.xlsx] (https://github.com/user-attachments/files/23689449/Dados.DGEG.Challenge.xlsx)

* **Node.js** (LTS version is highly recommended)
* **npm** (comes installed with Node.js)
* **Backend** running and accessible (configured to port `3333`).

### 2. Installation of Dependencies

Navigate to the project's root directory (`backend`):
```bash
# 1. Install all project dependencies
npm install
npm run dev
```
The backend will be accessible via your browser, usually at http://localhost:3333/api/. You can use Insomnia, for example, to try it.
<img width="1926" height="995" alt="image" src="https://github.com/user-attachments/assets/b8244bf3-edb5-4879-acdf-c92f2ef3ce9a" />


Navigate to the project's root directory (`frontend`):

```bash
# 1. Install all project dependencies
npm install
npm run dev
```

The dashboard will be accessible via your browser, usually at http://localhost:5173/.
<img width="1920" height="925" alt="image" src="https://github.com/user-attachments/assets/67418c47-8360-411a-88e0-e6d673a93561" />
<img width="1904" height="926" alt="image" src="https://github.com/user-attachments/assets/98337fb0-156c-40cf-bf6c-02a94b4c5461" />
<img width="1890" height="602" alt="image" src="https://github.com/user-attachments/assets/94471f7e-7163-4d9e-bfa7-a13fff0da1e7" />

You can also use Docker. In the root of the project, run the first script: 

```bash
# 1. Build images, create the container and run them.
docker compose up --build -d
```
When Docker is running the containers, open your browser and navigate to http://localhost/

```bash
# 2. Stop the execution of the containers, but keep the images
docker compose stop
```


### 3. Usage
Access the provided URL.

Click or drag your Excel file (.xlsx or .xls) into the upload area.

The form performs client-side validation using Zod and React Hook Form.

The file is sent to the backend for processing.

Upon receiving the pre-aggregated JSON data, the Dashboard component renders the charts and tables.

### 4. Approach to Data Extraction and Processing
The architecture employs a Client-Driven Processing model. The Front-end is responsible for coordinating the upload and visualizing the results, while the Backend handles the heavy lifting of data transformation.

Data Flow Strategy
Client Validation (Zod): The file is validated on the Front-end for size and type before transmission, minimizing unnecessary server load.

Upload (Axios): The file is sent as multipart/form-data to the dedicated backend endpoint.

Backend Processing (Node/Express):

The server uses a package (exceljs) to parse the raw Excel data.

It executes the required aggregation logic (grouping by year, calculating totals, calculating averages) to derive indicators like totalCo2PerYear and top5HighEmitters.

This approach ensures the Front-end receives clean, ready-to-display JSON data, separating concerns effectively.

Client Visualization: The Front-end consumes the pre-calculated data and passes it directly to the Recharts library for immediate rendering.

### 5. Chosen Tech Stack and Rationale Technology
* Vite.js was selected over frameworks like Next.js because this is a single-page application (SPA) dashboard. Vite offers superior DX (Developer Experience), ultra-fast builds, and immediate Hot Module Replacement, without the overhead of Server Side Rendering (SSR), which is unnecessary for an application behind a login.

* React + TypeScript is the industry standard for component-based UIs. TypeScript is crucial for maintaining data integrity and catching errors early, essential when dealing with external API contracts and data schemas.
* RechartsA highly flexible, React-native charting library. It uses SVG and is specifically designed to integrate seamlessly with the React component lifecycle, making it the most pragmatic choice for building diverse and responsive charts.
* Tailwind CSSA utility-first framework. It facilitates the rapid construction of a modern, consistent UI directly within JSX, significantly accelerating the design process and keeping the final CSS bundle small and optimized.
* Zod + React Hook FormThis combination provides the best-in-class solution for form management. Zod ensures strong, runtime-safe validation, while React Hook Form ensures the form state is handled efficiently, minimizing component re-renders and boosting performance.
* AxiosA reliable and feature-rich promise-based HTTP client. Used to create a clean, centralized API service layer, keeping the application components focused purely on presentation.
