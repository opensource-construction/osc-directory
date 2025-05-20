# AEC Open Source Directory

A curated list of open source projects for the Architecture, Engineering, and Construction (AEC) industry.

## Table of Contents

- [AEC Open Source Directory](#aec-open-source-directory)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Project Structure](#project-structure)
  - [Setup](#setup)
  - [How to Add a Project](#how-to-add-a-project)
    - [Method 1: Using the Command Line Script (Recommended)](#method-1-using-the-command-line-script-recommended)
    - [Method 2: Manual Pull Request](#method-2-manual-pull-request)
  - [Development](#development)
  - [API Endpoints](#api-endpoints)
  - [GitHub Workflows](#github-workflows)
  - [Categories](#categories)
    - [Life Cycle Assessment](#life-cycle-assessment)
    - [Visualization](#visualization)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This repository serves as a directory of open source projects in the Architecture, Engineering, and Construction (AEC) industry. It includes:

- A data collection of AEC-related open source projects
- A SvelteKit website to browse and explore projects
- Automated tools to update project metadata (stars, language, etc.)
- GitHub workflows for maintenance

## Project Structure

```
.
├── .github/             # GitHub configuration
│   ├── workflows/       # GitHub Actions workflows
│   └── PULL_REQUEST_TEMPLATE/  # PR templates
├── data/                # Project data
│   ├── projects.json    # Main data store for projects
│   └── schema.ts        # TypeScript definitions for data structures
├── scripts/             # Utility scripts
│   ├── add-project.js   # Script to add new projects
│   ├── update-metadata.js  # Updates GitHub metadata
│   └── generate-readme-tables.js  # Creates README tables
└── src/                 # SvelteKit frontend
    ├── routes/          # Website routes
    │   ├── api/         # API routes
    │   ├── +layout.svelte  # Main layout
    │   └── +page.svelte    # Home page
    └── app.css          # Global styles
```

## Setup

To set up the project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/osc-directory.git
cd osc-directory

# Install dependencies
pnpm install

# Run setup script
pnpm setup
```

## How to Add a Project

### Method 1: Using the Command Line Script (Recommended)

If you have the repository cloned locally:

```bash
# Install dependencies
pnpm install

# Run the add project script
pnpm add-project
```

The script will prompt you for the project information and automatically update the projects database.

### Method 2: Manual Pull Request

1. Fork this repository
2. Add your project to the `data/projects.json` file following this format:
   ```json
   {
   	"name": "Project Name",
   	"url": "https://github.com/username/project",
   	"description": "A short description of the project",
   	"category": ["category1", "category2"],
   	"submittedBy": "your-github-username",
   	"submissionDate": "YYYY-MM-DD"
   }
   ```
3. Create a Pull Request using the "Add Project" template
4. Fill in the PR description with the project details
5. Submit the PR for review

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## API Endpoints

The directory provides REST API endpoints:

- `/api/projects` - Returns all projects as JSON
- `/api/categories` - Returns all categories as JSON

## GitHub Workflows

This repository uses GitHub Actions to automate:

- **Metadata Updates**: Weekly job to fetch the latest stats from GitHub
- **README Generation**: Rebuilds the README tables when projects are added

## Categories

### Life Cycle Assessment

Tools and libraries for conducting life cycle assessments in the AEC industry

| Project                                     | Description                                     | Language | Stars | Last Updated | License |
| ------------------------------------------- | ----------------------------------------------- | -------- | ----- | ------------ | ------- |
| [Open3D](https://github.com/isl-org/Open3D) | Open3D: A Modern Library for 3D Data Processing | N/A      | 0     | N/A          | N/A     |

### Visualization

Tools and libraries for visualizing AEC data and models

| Project                                     | Description                                     | Language | Stars | Last Updated | License |
| ------------------------------------------- | ----------------------------------------------- | -------- | ----- | ------------ | ------- |
| [Open3D](https://github.com/isl-org/Open3D) | Open3D: A Modern Library for 3D Data Processing | N/A      | 0     | N/A          | N/A     |

## Contributing

Contributions are welcome! Please see our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This directory is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
