# OS.C Directory Frontend

This project is the SvelteKit-based frontend for the **AEC Open Source Directory**. The main goal of the AEC Open Source Directory is to provide a curated and searchable list of open-source software relevant to the Architecture, Engineering, and Construction (AEC) industry.

This frontend application allows users to:

- Browse and search for open-source tools and projects.
- View detailed information about each tool, including its purpose, license, and links to its repository or website.
- Potentially (depending on features) filter tools by category, discipline, or other relevant criteria.

It aims to be a user-friendly interface to help professionals and enthusiasts in the AEC sector discover and utilize open-source solutions.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (which includes npm). It's recommended to use the latest LTS version.
- You have `pnpm` installed. If not, you can install it globally using `npm install -g pnpm`.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1. Clone the repository (if you haven't already):
   ```sh
   git clone <your-repository-url>
   ```
2. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
3. Install NPM packages using pnpm:
   ```sh
   pnpm install
   ```

### Running the Development Server

To start the development server, run:

```sh
pnpm dev
```

This will start the development server, typically on `http://localhost:5173`. Open this URL in your browser to see the application. The app will automatically reload if you change any of the source files.
