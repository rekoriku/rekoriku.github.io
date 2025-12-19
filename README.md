# GitHub Repository Showcase

A modern, responsive GitHub Pages site that displays and filters public repositories with TypeScript support.

## Features

- 🚀 **TypeScript Support**: Full type safety and modern JavaScript features
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile
- 🌙 **Dark/Light Mode**: Automatic theme detection
- 🔍 **Search & Filter**: Real-time search and sorting options
- ⚡ **Performance**: Caching, debouncing, and optimized API usage
- ♿ **Accessibility**: ARIA labels and semantic HTML
- 🔧 **Configurable**: Easy customization without code changes

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env to change the GitHub username
```

3. Start development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

5. Build for production:
```bash
npm run build
```

### Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # Styles with dark/light mode support
├── js/
│   ├── types.ts        # TypeScript type definitions
│   ├── api.ts          # GitHub API integration
│   ├── render.ts       # HTML generation utilities
│   ├── state.ts        # URL state management
│   ├── lang.ts         # Language color mapping
│   └── main.ts         # Main application logic
├── test/               # Unit tests
│   ├── api.test.ts     # API function tests
│   ├── render.test.ts  # Render function tests
│   ├── state.test.ts   # State management tests
│   ├── lang.test.ts    # Language utility tests
│   └── setup.ts       # Test setup and mocks
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vitest.config.ts    # Test configuration
└── .env.example        # Environment variables template
```

## Configuration

### Environment Variables

- `VITE_GITHUB_USER`: GitHub username to display (default: "rekoriku")

### Deployment

The site is designed for GitHub Pages deployment. After building, commit the compiled JavaScript files and deploy to your GitHub Pages branch.

## License

MIT
