# AEC Open Source Directory - Backend

This backend service manages the data for the AEC (Architecture, Engineering, and Construction) Open Source Directory. It handles fetching project metadata from GitHub, updating a central `projects.json` file, and generating tables for the main project README.

## Project Overview

The primary functions of this backend are:

- **Metadata Management**: Periodically updates project information (stars, forks, last updated, license, topics, etc.) for GitHub-hosted projects listed in `data/projects.json`.
- **README Generation**: Generates Markdown tables of the projects, categorized for display in a main README file.
- **New Project Ingestion**: Provides a simple mechanism to add new projects to the directory via a YAML template.

## Project Structure

```
.
├── data/
│   └── projects.json        # Stores the list of all open source projects and their metadata
├── scripts/
│   ├── generate-readme-tables.ts # Generates Markdown tables for the main README
│   ├── parse-template.ts       # Parses new project submissions from new-project.yml
│   └── update-metadata.ts      # Updates metadata for projects
```

## Prerequisites

- Node.js (version specified in `package.json` or latest LTS)
- pnpm (package manager)

## Getting Started

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd backend
    ```

2.  **Install dependencies:**

    ```sh
    pnpm install
    ```

## Available Scripts

You can run the following scripts using pnpm:

- **`pnpm run update-metadata`**:

  - Executes `tsx scripts/update-metadata.ts`.
  - Fetches the latest metadata (stars, forks, description, etc.) from GitHub for projects listed in `data/projects.json` that have a GitHub URL.
  - Updates `data/projects.json` with the new metadata.

- **`pnpm run generate-readme`**:

  - Executes `tsx scripts/generate-readme-tables.ts`.
  - Reads `data/projects.json` and generates Markdown tables for projects, categorized as defined.
  - This script is intended to update a main README file in a parent directory (e.g., `../../README.md`).

- **`pnpm run parse-template`**:

  - Executes `tsx scripts/parse-template.ts`.
  - Checks for a `new-project.yml` file in the parent directory (`../..`).
  - If the file exists and has been modified from its template state, it parses the new project information.
  - Adds the new project to `data/projects.json`.
  - Resets `new-project.yml` to its template content for the next submission.
  - If `new-project.yml` does not exist, it creates a template file.
