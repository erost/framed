# Framed

A Vue.js application for creating beautiful layouts of two pictures with customizable backgrounds, borders, and orientations.

## Features

- Select frame orientation (portrait or landscape)
- Multiple aspect ratios (3:2, 4:3, 5:4, 16:9)
- Custom frame color selection
- Configurable frame width and outer border size
- Drag-and-drop image upload
- High-resolution image export

## Tech Stack

- **Framework**: Vue 3
- **Canvas**: Konva.js with vue-konva
- **Styling**: Tailwind CSS
- **Build Tool**: Vite 5
- **Testing**: Vitest with @vue/test-utils
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 24+ and npm

### Installation

```bash
# Install dependencies
npm ci
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### Automated Workflows

- **CI**: Runs linter, tests, and build on all non-main branches and pull requests
- **Build and Deploy**: Automatically builds and deploys to GitHub Pages on every tag
- **Version Bump**: Creates a PR with a minor version bump after successful deployment

## AI Disclaimer
AI tools have been used to contribute to this project.
