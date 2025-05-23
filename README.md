# AEC Open Source Directory

A curated list of open source projects for the Architecture, Engineering, and Construction (AEC) industry.

## How to Add a Project

To add a project, simply create a pull request:

1. Fork this repository
2. Edit the `data/projects.json` file to add your project in this format:
   ```json
   {
   	"url": "https://github.com/isl-org/Open3D",
   	"category": "visualization",
   	"metadata": ["Rhino, Grasshopper", "Open3D"]
   }
   ```
3. Submit a pull request

Available categories:

- `lca` - Life Cycle Assessment
- `bim` - Building Information Modeling
- `visualization` - Visualization
- `analysis` - Structural & Environmental Analysis
- `interoperability` - Interoperability
- `generative` - Generative Design

Your project will be automatically updated with metadata like stars, language, and last updated date.

## Projects

### Visualization

| Project | Description | Language | Stars | Last Updated | License |
|---------|-------------|----------|-------|--------------|--------|
| [Open3D](https://github.com/isl-org/Open3D) | Open3D: A Modern Library for 3D Data Processing | C++ | 12336 | May 23, 2025 | NOASSERTION |
| [OCCT](https://github.com/Open-Cascade-SAS/OCCT) | Open CASCADE Technology (OCCT) is an open-source software development platform for 3D CAD, CAM, CAE. | C++ | 1564 | May 23, 2025 | LGPL-2.1 |
| [FreeCAD](https://github.com/FreeCAD/FreeCAD) | Official source code of FreeCAD, a free and opensource multiplatform 3D parametric modeler. | C++ | 24745 | May 23, 2025 | NOASSERTION |

### Analysis

| Project | Description | Language | Stars | Last Updated | License |
|---------|-------------|----------|-------|--------------|--------|
| [ladybug](https://github.com/ladybug-tools/ladybug) | 🐞 Core ladybug library for weather data analysis and visualization | Python | 206 | May 20, 2025 | AGPL-3.0 |

### Interoperability

| Project | Description | Language | Stars | Last Updated | License |
|---------|-------------|----------|-------|--------------|--------|
| [compas](https://github.com/compas-dev/compas) | Core packages of the COMPAS framework. | Python | 331 | May 17, 2025 | MIT |
| [three.js](https://github.com/mrdoob/three.js) | JavaScript 3D Library. | JavaScript | 106339 | May 23, 2025 | MIT |
| [voxelization_toolkit](https://github.com/IfcOpenShell/voxelization_toolkit) | Voxelization Toolkit for (IFC) Building Models | C++ | 81 | May 20, 2025 | MIT |

### Infrastructure

| Project | Description | Language | Stars | Last Updated | License |
|---------|-------------|----------|-------|--------------|--------|
| [BIMserver](https://github.com/opensourceBIM/BIMserver) | The open source BIMserver platform | Java | 1612 | May 23, 2025 | AGPL-3.0 |

## Contributing

Contributions are welcome! Please see our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This directory is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
