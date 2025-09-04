# Ryan Radityatama - Portfolio Website

A futuristic glassmorphism personal portfolio website built with Next.js, TypeScript, and Tailwind CSS, featuring a vibrant purple color scheme and interactive elements.

## 🚀 Features

- **Glassmorphism Design**: Modern glass-like UI elements with backdrop blur effects
- **Vibrant Purple Theme**: Eye-catching purple gradient color scheme
- **Dynamic Hero Section**: Animated hero with role rotation and floating elements
- **Seamless Navigation**: Smooth scroll navigation between sections
- **Interactive Project Cards**: Hover effects and detailed project modals
- **Functional Contact Form**: Form validation and submission handling
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Performance Optimized**: Built with Next.js 15 for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Icons**: Heroicons and custom SVG icons
- **Animations**: CSS animations and transitions
- **Deployment**: Ready for Vercel deployment

## 📱 Sections

- **Home**: Dynamic hero section with animated role display
- **About Me**: Personal information and statistics
- **My Skills**: Technical skills with animated progress bars
- **My Projects**: Interactive project showcase with filtering
- **Contact Me**: Functional contact form with validation

## 🎨 Design Features

- Glass morphism effects with backdrop blur
- Gradient text animations
- Floating background elements
- Interactive hover effects
- Smooth scroll navigation
- Responsive grid layouts
- Custom CSS animations

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryradit/future-porto.git
   cd future-porto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and glassmorphism effects
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx            # Main page component
│   └── not-found.tsx       # Custom 404 page
└── components/
    ├── Navigation.tsx       # Sticky navigation component
    ├── HeroSection.tsx      # Dynamic hero section
    ├── AboutSection.tsx     # About me section
    ├── SkillsSection.tsx    # Skills showcase
    ├── ProjectsSection.tsx  # Interactive projects
    ├── ContactSection.tsx   # Contact form
    └── Footer.tsx          # Footer component
```

## 🔧 Customization

### Colors
Modify the color scheme in `globals.css`:
```css
:root {
  --primary: #9333ea;
  --secondary: #a855f7;
  --accent: #c084fc;
}
```

### Content
Update personal information in each component:
- Personal details in `AboutSection.tsx`
- Skills in `SkillsSection.tsx`
- Projects in `ProjectsSection.tsx`
- Contact info in `ContactSection.tsx`

### Styling
- Glassmorphism effects in `globals.css`
- Component-specific styles using Tailwind classes
- Custom animations and transitions

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## 📊 Performance

- Lighthouse Score: 95+ Performance
- First Contentful Paint: <1s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## 🤝 Contact

- **Email**: ryradit@example.com
- **GitHub**: [github.com/ryradit](https://github.com/ryradit)
- **LinkedIn**: [linkedin.com/in/ryradit](https://linkedin.com/in/ryradit)
- **Website**: [ryradit.my.id](https://www.ryradit.my.id)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Ryan Radityatama using Next.js, TypeScript, and Tailwind CSS.
