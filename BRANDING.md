# 🎨 PRISM Brand Identity Guide

## Logo & Favicon Design

### Design Concept
The PRISM logo represents the core mission: **transforming complex research (white light) into clear, understandable insights (spectrum of colors)**.

### Visual Elements

#### 1. **The Prism Shape**
- **Symbolism**: Light refraction, analysis, breaking down complexity
- **Colors**: Blue → Purple → Pink gradient
- **3D Effect**: Shadow and highlight layers create depth
- **Meaning**: Scientific rigor meets artistic beauty

#### 2. **Light Beams**
- **Input Beam**: Single white light (research paper input)
- **Output Beams**: Three colored rays (insights, analysis, understanding)
  - 🔵 **Blue (#60a5fa)**: Methodology & Data
  - 🟣 **Purple (#a78bfa)**: Analysis & Critique  
  - 🌸 **Pink (#f472b6)**: Innovation & Ideas

#### 3. **Neural Network Icon**
- **Location**: Inside the prism
- **Symbolism**: AI-powered intelligence
- **Design**: Connected nodes representing neural processing
- **Meaning**: Advanced technology analyzing research

---

## Color Palette

### Primary Colors

```css
/* Prism Blue - Trust, Intelligence */
#60a5fa  /* Main blue */
#0ea5e9  /* Darker variant */

/* Prism Purple - Creativity, Wisdom */
#a78bfa  /* Main purple */
#8b5cf6  /* Darker variant */

/* Prism Pink - Innovation, Energy */
#f472b6  /* Main pink */
#ec4899  /* Darker variant */
```

### Gradient Combinations

```css
/* Primary Gradient (Prism) */
linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)

/* Background Gradient (Subtle) */
linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)

/* Text Gradient (Headings) */
linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
```

### Supporting Colors

```css
/* Neutral Slate */
#1e293b  /* Dark text */
#475569  /* Medium text */
#94a3b8  /* Light text */
#f1f5f9  /* Background */

/* Success Green */
#10b981  /* Success states */

/* Warning Orange */
#f59e0b  /* Warning states */

/* Error Red */
#ef4444  /* Error states */
```

---

## Typography

### Font Families

```css
/* Display Font (Headings) */
font-family: 'Poppins', system-ui, sans-serif;
font-weight: 600, 700, 800, 900;

/* Body Font (Content) */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400, 500, 600, 700;

/* Monospace (Code) */
font-family: 'JetBrains Mono', monospace;
font-weight: 400, 500, 600;
```

### Font Sizes

```css
/* Hero Text */
.text-6xl { font-size: 3.75rem; }  /* 60px */

/* Page Titles */
.text-4xl { font-size: 2.25rem; }  /* 36px */

/* Section Headings */
.text-2xl { font-size: 1.5rem; }   /* 24px */

/* Body Text */
.text-base { font-size: 1rem; }    /* 16px */

/* Small Text */
.text-sm { font-size: 0.875rem; }  /* 14px */
```

---

## Logo Usage

### Full Logo (Horizontal)
**File**: `logo.svg` (240x80px)

**Usage**:
- Website header
- Email signatures
- Presentations
- Marketing materials

**Spacing**:
- Minimum clear space: 20px on all sides
- Never squeeze or stretch

### Icon Only
**File**: `icon.svg` (64x64px)

**Usage**:
- App header (small screens)
- Social media avatars
- App icons
- Favicons

### Favicon
**File**: `favicon.svg` (512x512px)

**Usage**:
- Browser tabs
- Bookmarks
- Mobile home screen
- Progressive Web App

---

## Design Principles

### 1. **Modern & Professional**
- Clean geometric shapes
- Subtle shadows and glows
- Smooth gradients
- Rounded corners

### 2. **Scientific Yet Approachable**
- Prism represents scientific method
- Neural network shows AI capability
- Friendly colors (not corporate blue)
- Soft, inviting gradients

### 3. **Dynamic & Energetic**
- Light beams show motion
- Gradients create depth
- Sparkles add magic
- Animations bring life

### 4. **Trustworthy & Reliable**
- Solid geometric foundation
- Evidence-based design
- Clear visual hierarchy
- Consistent styling

---

## Animation Guidelines

### Logo Entrance
```css
/* Fade + Scale In */
@keyframes logoEntrance {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Light Beam Animation
```css
/* Pulse glow effect */
@keyframes beamPulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.5; }
}
```

### Prism Rotation (Hover)
```css
/* Subtle 3D tilt */
@keyframes prismTilt {
  from { transform: perspective(100px) rotateY(0deg); }
  to { transform: perspective(100px) rotateY(5deg); }
}
```

---

## Accessibility

### Color Contrast

All text colors meet WCAG AA standards:
- Dark text on light background: ≥4.5:1
- Light text on dark background: ≥4.5:1
- Large text: ≥3:1

### Logo Alternatives

**Dark Mode Version**:
- Invert background to dark
- Keep prism colors vibrant
- Increase glow effect

**Monochrome Version**:
- Single color gradient
- Maintain depth with opacity
- Preserve recognizable shape

**High Contrast Version**:
- Pure white background
- Stronger borders
- Darker prism fill

---

## File Formats & Exports

### Vector (SVG)
- ✅ Scalable to any size
- ✅ Small file size
- ✅ Editable
- ✅ Web-friendly

**When to use**: Website, print, scaling needed

### Raster (PNG)
- ✅ Wide compatibility
- ✅ Transparency support
- ⚠️ Fixed resolution

**Sizes to export**:
- 512x512 (favicon, large icon)
- 256x256 (social media)
- 128x128 (app icon)
- 64x64 (small icon)
- 32x32 (tiny icon)

---

## Brand Applications

### Website
- Favicon in browser tab
- Icon in mobile header
- Full logo in desktop header
- Animated entrance on homepage

### Social Media
- Profile picture: icon.svg
- Cover image: logo with tagline
- Posts: gradient backgrounds

### Print Materials
- Business cards: full logo
- Letterhead: top-left logo
- Presentations: slide header

### Merchandise
- T-shirts: large prism icon
- Stickers: circular icon
- Mugs: full logo wrap

---

## Don'ts ❌

1. **Never** change the color scheme
2. **Never** rotate or flip the prism
3. **Never** separate icon from text (in full logo)
4. **Never** add drop shadows (already has glow)
5. **Never** place on busy backgrounds
6. **Never** squeeze or stretch disproportionately
7. **Never** outline the logo
8. **Never** use low-resolution versions

---

## Technical Specifications

### SVG Structure
```xml
<!-- Always include viewBox for scalability -->
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients defined in defs -->
    <linearGradient id="prismGradient">
      <!-- ... -->
    </linearGradient>
  </defs>
  <!-- Content here -->
</svg>
```

### Optimization
- Minify SVG files for production
- Use SVGO or similar tools
- Keep gradient IDs unique
- Remove unnecessary metadata

---

## Evolution & Updates

### Version History
- **v1.0** (Current): Neural network prism design
- **v0.1** (Initial): Simple prism with light rays

### Future Considerations
- Animated version for loading states
- 3D rendered version for marketing
- Seasonal variations (holidays)
- Product-specific variants

---

## Brand Voice

The visual identity reflects our brand voice:

**Intelligent** 🧠
- Neural network symbolizes AI
- Prism represents analysis

**Innovative** ✨
- Light refraction shows transformation
- Gradients feel modern

**Trustworthy** 🛡️
- Geometric stability
- Scientific foundation

**Approachable** 🤝
- Soft colors
- Friendly design

---

## Contact for Brand Assets

Need high-res exports or custom versions?
- SVG source files: `/public/*.svg`
- Design documentation: This file
- Custom requests: Modify SVG directly

---

<div align="center">

### 🌈 PRISM
**Transforming Research Through Light**

*A brand that reflects our mission: making complex research clear, colorful, and accessible*

</div>
