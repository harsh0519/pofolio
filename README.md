# Advanced Black & White Portfolio Template

An ultra-modern, minimalist portfolio template featuring pure black and white aesthetics with cutting-edge animations powered by Framer Motion. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Features

### Design Philosophy
- **Pure Black & White**: Minimalist color palette focusing on contrast and elegance
- **Advanced Animations**: Powered by Framer Motion for fluid, professional animations
- **Glassmorphism**: Modern frosted glass effects with backdrop blur
- **Noise Texture**: Subtle grain overlay for depth and sophistication
- **Custom Cursor**: Interactive cursor with magnetic effects
- **Responsive**: Pixel-perfect across all devices

### Advanced Libraries

#### Framer Motion
- Smooth spring animations
- Gesture-based interactions (drag, hover, tap)
- Scroll-triggered animations
- Motion values and transforms
- Stagger animations for lists
- Page transitions

#### React Icons
- Comprehensive icon library
- Lightweight and tree-shakeable
- Consistent styling

#### React Intersection Observer
- Scroll-triggered animations
- Lazy loading support
- Performance optimized

### Component Features

#### 1. Hero Section
**Advanced Animations:**
- Staggered text reveal with spring physics
- Typewriter effect with custom cursor
- Magnetic button interactions
- 3D perspective transforms on mouse move
- Floating orb backgrounds with infinite animations
- Social icons with scale and rotate effects

**Effects:**
- Noise texture overlay
- Grid background pattern
- Smooth scroll indicator
- Glass-morphism cards

#### 2. Skills Section
- Interactive skill cards with hover animations
- Progress bars with spring transitions
- Category filtering with smooth transitions
- Perspective card transforms
- Technology tag cloud

#### 3. Projects Section
- Filterable project grid
- Card flip animations
- Magnetic hover effects
- Shimmer loading states
- Featured project badges

#### 4. About Section
- Timeline with reveal animations
- Statistics counter animations
- Floating element decorations
- Alternating layout animations

#### 5. Contact Section
- Animated form inputs
- Glassmorphism design
- Social link animations
- Interactive availability indicator

#### 6. Navigation
- Scroll-aware sticky header
- Mobile hamburger menu with animations
- Active section tracking
- Smooth scroll behavior

#### 7. Custom Cursor
- Smooth spring-based movement
- Hover state scaling
- Mix-blend-mode for contrast
- Magnetic pull on interactive elements

### Animation Techniques

#### Spring Physics
```tsx
const springConfig = { damping: 25, stiffness: 150 };
const x = useSpring(mouseX, springConfig);
```

#### Motion Values & Transforms
```tsx
const rotateX = useTransform(y, [0, height], [5, -5]);
const rotateY = useTransform(x, [0, width], [-5, 5]);
```

#### Gesture Animations
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  drag
  dragConstraints={{ left: 0, right: 300 }}
/>
```

#### Stagger Children
```tsx
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={item} />
  ))}
</motion.div>
```

### Color Scheme

**Pure Black & White Palette:**
```css
--bg-primary: #000000        /* Pure black background */
--bg-secondary: #0a0a0a      /* Subtle black variation */
--bg-tertiary: #141414       /* Card backgrounds */
--accent-primary: #ffffff    /* Pure white accents */
--text-primary: #ffffff      /* White text */
--text-secondary: #a0a0a0    /* Gray text */
--text-tertiary: #707070     /* Darker gray */
```

### CSS Effects

#### Glassmorphism
```css
.glass-effect {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

#### Noise Texture
```css
.noise-texture::before {
  background-image: url("data:image/svg+xml...");
  opacity: 0.03;
}
```

#### Shimmer Effect
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Intersection Observer**: React Intersection Observer

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Customization Guide

### 1. Personal Information

#### Hero Section (`src/components/pages/hero/herosSection.tsx`)
```tsx
// Line 93: Change your name
{['YOUR', 'NAME'].map...

// Lines 119-124: Update roles
texts={[
  'Full Stack Developer',
  'Creative Designer',
  ...
]}

// Lines 162-166: Update social links
{ icon: FaGithub, href: 'https://github.com/yourusername' },
```

### 2. Color Customization

While the template is designed for black & white, you can adjust:

```css
/* app/globals.css */
:root {
  --bg-primary: #000000;      /* Adjust for different black tones */
  --text-primary: #ffffff;    /* Adjust for off-white variations */
  --border-color: rgba(255, 255, 255, 0.1); /* Adjust border opacity */
}
```

### 3. Animation Speed

```tsx
// Adjust transition durations
transition={{ duration: 0.6, delay: 0.2 }}

// Adjust spring physics
const springConfig = { damping: 25, stiffness: 150 };
```

### 4. Custom Cursor

Enable/disable in `app/layout.tsx`:
```tsx
<body className="antialiased custom-cursor"> {/* Remove custom-cursor to disable */}
  <CustomCursor /> {/* Remove to disable custom cursor */}
```

## Advanced Features

### Magnetic Buttons
Buttons follow mouse movement within proximity:
```tsx
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  setPosition({ x: x * 0.3, y: y * 0.3 });
};
```

### Perspective Transforms
3D transforms based on mouse position:
```tsx
const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);
```

### Scroll Animations
Trigger animations on scroll:
```tsx
const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true
});

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
/>
```

## Performance Optimization

### Framer Motion
- Use `layout` prop for layout animations
- Leverage `variants` for reusable animations
- Utilize `useMemo` for expensive calculations
- Enable GPU acceleration with `transform` properties

### Best Practices
- Lazy load components below the fold
- Use `next/image` for optimized images
- Minimize re-renders with `React.memo`
- Code-split heavy animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Deploy `.next` folder
3. Run: `npm start`

## Advanced Customization

### Adding New Animations

```tsx
// Create custom variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

// Use in component
<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Custom Spring Physics

```tsx
const customSpring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
  mass: 0.5
};
```

### Gesture Interactions

```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
  dragElastic={0.2}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.x > 100) {
      // Handle swipe right
    }
  }}
/>
```

## Troubleshooting

### Animations Not Working
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check that components have `'use client'` directive
- Verify no CSS conflicts with `transform` properties

### Custom Cursor Not Showing
- Check `custom-cursor` class is applied to body
- Ensure z-index is higher than other elements
- Verify `mix-blend-mode` browser support

### Performance Issues
- Reduce number of animated elements
- Use `will-change` CSS property sparingly
- Disable custom cursor on mobile devices
- Optimize spring configurations

## License

This template is free to use for personal and commercial projects.

## Credits

Built with:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

---

**A masterpiece of minimalism and motion**

Elevate your portfolio with cutting-edge animations and timeless black & white design.
