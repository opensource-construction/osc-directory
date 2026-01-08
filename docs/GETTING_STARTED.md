# Getting Started Guide

Welcome to the **AEC Open Source Directory**! This guide will help you get up and running quickly, whether you're a user exploring projects or a developer contributing to the codebase.

---

## For Users: Discovering Projects

### 1. Visit the Directory

Head to the live directory at **[https://directory.opensource.construction/](https://directory.opensource.construction/)**

### 2. Browse Projects

The homepage displays all projects organized by category:

- **BIM Tools** - Building Information Modeling solutions
- **Visualization** - 3D rendering and graphics
- **Analysis** - Simulation and computational tools
- **Interoperability** - Data format conversion and standards
- **Parametric Design** - Generative and computational design
- **Data Management** - Information systems and databases
- **Infrastructure** - Transportation and utilities
- **Sustainability** - Environmental and energy analysis
- **Development Tools** - Libraries and frameworks
- **Other** - Projects that don't fit other categories

### 3. Search for Projects

Use the **search bar** at the top to find projects by name or description:

- Type keywords like "BIM", "Visualization", "Python", etc.
- Results update instantly as you type
- See how many projects match your search

### 4. Filter & Sort

**Filter by Metadata:**

- **Language**: Python, C#, C++, JavaScript, Java, etc.
- **License**: MIT, Apache 2.0, GPL, etc.
- **Platforms**: Windows, macOS, Linux, Web
- **Frameworks**: React, Three.js, Django, etc.

**Sort Results:**

- **Alphabetical** - A to Z
- **Stars** - Most popular projects first (GitHub stars)
- **Last Updated** - Most recently maintained projects first

### 5. View Project Details

Click on any project card to see:

- Full project description
- GitHub repository link
- Key statistics: ⭐ stars, 🔀 forks, 📊 open issues
- Primary programming language
- License type
- Last update date
- Relevant platform and framework tags

### 6. Visit the Repository

Click the project name or GitHub link to visit the full repository where you can:

- View source code
- Read detailed documentation
- Check open issues
- Contribute or report bugs
- Review license terms

---

## For Contributors: Submitting Projects

### Quick Steps to Add a Project

#### Step 1: Prepare Your Project Information

Have ready:

- **GitHub Repository URL** (required)
- **Project Category** - Choose from the 10 categories listed above
- **Optional Tags** - Platform (Windows, macOS, Linux, Web) or Framework (React, Three.js, etc.)
- **Basic Description** - What does the project do? (usually auto-fetched from GitHub)

#### Step 2: Create a GitHub Issue

1. Go to [GitHub Issues](https://github.com/openingdesign/osc-directory/issues)
2. Click **"New Issue"**
3. Select **"New Project"** template
4. Fill in the template form:
   ```
   GitHub URL: https://github.com/your-org/your-project
   Category: [Choose one]
   Platforms: [Optional - select applicable platforms]
   Frameworks: [Optional - select applicable frameworks]
   ```

#### Step 3: Validation

Our automated system will:

- ✅ Verify the GitHub repository exists
- ✅ Check the project has proper metadata
- ✅ Validate the category selection
- ✅ Report any issues to your submission

#### Step 4: Review & Approval

- A maintainer will review your submission
- They'll check if the project fits the AEC/construction industry focus
- Once approved, the issue will be labeled "approved"

#### Step 5: Automatic Addition

When approved:

- 🤖 Automation fetches the latest project data from GitHub
- 📝 Project data is added to the directory database
- 🌐 Website updates automatically (usually within minutes)
- 🎉 Your project appears in the directory!

### For Detailed Submission Instructions

See [Submit a Project](./submit-a-project.md) for the complete guide with screenshots and troubleshooting.

---

## For Developers: Setting Up Locally

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **pnpm** ([install](https://pnpm.io/installation))
- **Git** ([download](https://git-scm.com/))
- A code editor (VS Code recommended)

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/openingdesign/osc-directory.git
cd osc-directory
```

#### 2. Install Dependencies

```bash
# Install dependencies for all workspaces
pnpm install
```

#### 3. Run the Frontend

```bash
cd frontend
pnpm dev
```

The site will be available at **http://localhost:5173**

#### 4. Run Tests

```bash
pnpm test
```

#### 5. Check Code Quality

```bash
pnpm lint
pnpm format
```

### Project Structure

```
osc-directory/
├── frontend/          # SvelteKit web application (users interact with this)
├── backend/           # Data management and automation scripts
├── shared/            # Shared TypeScript types and categories
└── docs/              # Documentation
```

### Common Development Tasks

| Task                    | Command                                  | What it does                        |
| ----------------------- | ---------------------------------------- | ----------------------------------- |
| Start dev server        | `cd frontend && pnpm dev`                | Runs the website locally            |
| Run tests               | `pnpm test`                              | Executes unit and integration tests |
| Check code style        | `pnpm lint`                              | Identifies style issues             |
| Format code             | `pnpm format`                            | Auto-fixes style issues             |
| Build for production    | `cd frontend && pnpm build`              | Creates optimized build             |
| Update project metadata | `cd backend && pnpm run update-metadata` | Fetches latest GitHub data          |
| Generate README tables  | `cd backend && pnpm run generate-readme` | Updates main README                 |

### File Structure Explained

**Frontend** (`frontend/src/`)

- `routes/` - Page routes and API endpoints
- `lib/components/` - Reusable UI components (filters, search, project cards)
- `lib/search.ts` - Search and filter configuration

**Backend** (`backend/`)

- `data/projects.json` - Master database of all projects
- `scripts/` - Automation scripts for data management
- `helpers/` - Utility functions for validation and parsing

**Shared** (`shared/`)

- `categories.ts` - List of all AEC project categories
- `types/` - TypeScript type definitions used across frontend and backend

### Making Your First Change

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests to ensure nothing broke:

   ```bash
   pnpm test
   ```

4. Commit your changes:

   ```bash
   git add .
   git commit -m "Description of your change"
   ```

5. Push to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub

### Key Technologies

- **Frontend**: SvelteKit, Tailwind CSS, TypeScript
- **Backend**: Node.js, TypeScript
- **Search**: Fuse.js (fuzzy search)
- **API**: GitHub REST API
- **Hosting**: Firebase
- **Automation**: GitHub Actions
- **Testing**: Vitest

See [Contributions.md](./Contributions.md) for detailed contribution guidelines.

---

## Common Questions

### Q: Can I submit projects from companies?

**A:** Yes! We welcome open-source projects from any organization that serves the AEC industry.

### Q: What if my project is in a different programming language?

**A:** We support all programming languages! We have projects in Python, C#, JavaScript, Java, C++, and more.

### Q: How are projects filtered or removed?

**A:** Projects must be open-source and relevant to Architecture, Engineering, or Construction. Spam or commercial-only tools may be removed after review.

### Q: Can I edit my project information after it's added?

**A:** Yes! Submit a new issue or pull request with the updates you'd like to make.

### Q: How often is the project metadata updated?

**A:** Automatically every night! GitHub statistics (stars, forks, updates) are refreshed daily.

### Q: Where can I report bugs or suggest features?

**A:** Open a [GitHub Issue](https://github.com/openingdesign/osc-directory/issues) with the "Bug Report" or "Feature Request" template.

---

## Next Steps

- 👀 **Explore projects**: Visit [https://directory.opensource.construction/](https://directory.opensource.construction/)
- 📝 **Submit a project**: Follow [Submit a Project](./submit-a-project.md)
- 🛠️ **Contribute code**: Check out [Contributions.md](./Contributions.md)
- 💬 **Ask questions**: Open a GitHub Discussion or Issue

---

## Need Help?

- **GitHub Discussions**: Ask questions in the community
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Browse the [docs/](../) folder for more guides
- **Code Examples**: Check out the [frontend/src/](../frontend/src/) folder for component examples

Happy exploring and contributing! 🎉
