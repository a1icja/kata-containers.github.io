# Kata Containers Test Dashboard

This repository contains the **Kata Containers Test Dashboard**, a web application that visualizes data for the nightly tests run by the Kata Containers repository. Built using **Next.js** and styled with **TailwindCSS**, this dashboard provides a simple and efficient interface to monitor test results, leveraging modern frontend technologies to ensure responsive and scalable performance.

## Features
- Fetches nightly CI test data using custom scripts.
- Displays weather-like icons to reflect test statuses (e.g., sunny for success, stormy for failures).
- Utilizes **Next.js** for server-side rendering and optimized builds.
- **TailwindCSS** for responsive, utility-first styling.
- Integration of **PrimeReact** components for UI elements.

---

## Project Structure

```bash
.
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Dependency lock file
├── pages
│   ├── _app.js                 # Application wrapper for global setup
│   └── index.js                # Main dashboard page
├── postcss.config.js           # PostCSS configuration for TailwindCSS
├── public
│   ├── cloudy.svg              # Weather icons for test statuses
│   ├── favicon.ico
│   ├── partially-sunny.svg
│   ├── rainy.svg
│   ├── stormy.svg
│   └── sunny.svg
├── README.md                   # Project documentation (this file)
├── scripts
│   └── fetch-ci-nightly-data.js # Script to fetch nightly test data
├── styles
│   └── globals.css             # Global CSS imports
└── tailwind.config.js          # TailwindCSS configuration
```

### Key Files
- **`pages/index.js`**: The main entry point of the dashboard, displaying test results and their statuses.
- **`scripts/fetch-ci-nightly-data.js`**: Custom script to retrieve CI data for the dashboard.
- **`styles/globals.css`**: Custom global styles, mainly extending the TailwindCSS base.
- **`public/`**: Contains static assets like icons representing different test statuses.

---

## Setup Instructions

Follow these steps to set up the development environment for the Kata Containers Test Dashboard:

### Prerequisites
- [**Node.js**](https://nodejs.org/en/download) (version 18.x or later recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kata-containers/kata-containers.github.io.git
   cd kata-containers.github.io
   ```

2. **Install dependencies**:
   Run the following command to install both the project dependencies and development dependencies.
   ```bash
   npm install
   ```

### Development

3. **Run the development server**:
   Start the Next.js development server with hot-reloading enabled.
   ```bash
   node scripts/fetch-ci-nightly-data.js > job_stats.json
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Production

4. **Build for production**:
   To create an optimized production build, run:
   ```bash
   npm run build
   ```

5. **Start the production server**:
   After building, you can start the server:
   ```bash
   npm start
   ```

### Scripts

- **Fetch CI Nightly Data**: 
  The `fetch-ci-nightly-data.js` script can be executed manually to pull the latest CI test data from the Kata Containers repository:
   ```bash
   node scripts/fetch-ci-nightly-data.js > job_stats.json
   ```