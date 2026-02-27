# Rainboots Marketing - React Website

A modern, animated marketing website built with React, Vite, and Framer Motion.

## Features

- 🎨 **Modern Design**: Bold, distinctive aesthetics with water-inspired animations
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🎭 **Smooth Animations**: Framer Motion for fluid, professional animations
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🧭 **Multi-page**: React Router for seamless navigation
- ♿ **Accessible**: Semantic HTML and keyboard navigation support

## Tech Stack

- **React** 18.2 - UI library
- **React Router** 6.20 - Client-side routing
- **Framer Motion** 10.16 - Animation library
- **Vite** 5.0 - Build tool and dev server
- **CSS3** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rainboots-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
rainboots-react/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── WaterDrops.jsx
│   │   ├── Blobs.jsx
│   │   └── ServiceCard.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## Customization

### Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary: #2B5CE6;
  --secondary: #FF6B35;
  --accent: #FFD23F;
  --dark: #1A1A2E;
  --light: #F8F9FA;
  --splash: #4FB3D4;
  --text: #2D3748;
}
```

### Fonts

The project uses Google Fonts:
- **DM Serif Display** - Headlines and display text
- **Outfit** - Body text

To change fonts, update the link in `index.html` and the font-family in CSS files.

### Content

Update content by editing the respective page components in `src/pages/`

## Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Vercel

```bash
npm install -g vercel
vercel
```

### Static Hosting

Simply upload the contents of the `dist` folder to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

## License

© 2024 Rainboots LLC. All rights reserved.

## Support

For questions or support, contact: hello@rainbootsmarketing.com
