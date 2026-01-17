# Nooch Brand Guidelines

## Brand Overview

Nooch.ai is an AI-powered operating system for nutrition coaches. The brand combines warmth and approachability with technical sophistication, reflecting the human-AI collaboration at its core.

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Nooch Coral** | `#F87171` | rgb(248, 113, 113) | Primary accent, CTAs, highlights |
| **Nooch Dark** | `#1F2937` | rgb(31, 41, 55) | Primary text, headers, backgrounds |
| **Nooch White** | `#FFFFFF` | rgb(255, 255, 255) | Backgrounds, card surfaces |

### Secondary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Soft Peach** | `#FEE2E2` | rgb(254, 226, 226) | Subtle backgrounds, hover states |
| **Warm Gray** | `#6B7280` | rgb(107, 114, 128) | Secondary text, labels |
| **Light Gray** | `#F3F4F6` | rgb(243, 244, 246) | Borders, dividers, backgrounds |

### Gradient

```css
background: linear-gradient(135deg, #F87171 0%, #FB923C 100%);
```
Use for hero sections, feature highlights, and premium UI elements.

---

## Typography

### Font Stack

```css
--font-headline: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
--font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
--font-accent: 'Playfair Display', Georgia, serif;
```

### Type Scale

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 - Hero | Inter | 800 (Extra Bold) | 48-64px | 1.1 |
| H2 - Section | Inter | 700 (Bold) | 36-40px | 1.2 |
| H3 - Subsection | Inter | 600 (Semi Bold) | 24-28px | 1.3 |
| Accent/Tagline | Playfair Display | 400 (Italic) | 18-24px | 1.4 |
| Body | Inter | 400 (Regular) | 16px | 1.6 |
| Small/Caption | Inter | 400 (Regular) | 14px | 1.5 |

### Typography Rules

1. **Headlines**: Use condensed letter-spacing (-0.02em) for large headlines
2. **Accent Text**: Use italic serif (Playfair Display) for taglines and emotional phrases
3. **Body Text**: Maintain comfortable reading width (max 65-75 characters per line)
4. **Emphasis**: Use coral color or bold weight, never underline for emphasis

---

## Logo Specifications

### Primary Logo

- **Mark**: Stylized "N" with subtle leaf/growth element
- **Wordmark**: "nooch" in lowercase Inter Extra Bold
- **Tagline Position**: Below wordmark in Playfair Display italic

### Logo Clear Space

Minimum clear space = height of the "o" in nooch on all sides

### Logo Minimum Size

- Digital: 24px height minimum
- Print: 0.5 inch height minimum

### Logo Color Variations

| Context | Logo Color | Background |
|---------|------------|------------|
| Light backgrounds | Nooch Dark (#1F2937) | White/Light Gray |
| Dark backgrounds | White (#FFFFFF) | Nooch Dark |
| Hero/Gradient | White (#FFFFFF) | Coral Gradient |

---

## UI Components

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F87171;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #EF4444;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #1F2937;
  border: 2px solid #1F2937;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #1F2937;
  color: #FFFFFF;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #F3F4F6;
}

.card-elevated {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Input Fields

```css
.input {
  background: #FFFFFF;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #F87171;
  outline: none;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}
```

---

## Visual Elements

### Icons

- Style: Outlined, 2px stroke weight
- Corner radius: Rounded (2px radius on corners)
- Recommended: Heroicons, Phosphor Icons, or custom in same style

### Illustrations

- Style: Flat with subtle gradients
- Characters: Diverse, friendly, approachable
- Color palette: Use brand colors with soft shadows
- Mood: Warm, supportive, professional

### Photography

- Style: Natural lighting, candid moments
- Subjects: Coaches working with clients, healthy food prep, wellness activities
- Treatment: Slight warmth in color grading, avoid overly saturated images
- Overlay: Can use coral gradient overlay at 10-20% opacity

---

## Spacing System

Based on 4px grid:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

---

## CSS Variables (Complete)

```css
:root {
  /* Colors */
  --color-coral: #F87171;
  --color-coral-dark: #EF4444;
  --color-coral-light: #FEE2E2;
  --color-dark: #1F2937;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-300: #D1D5DB;
  --color-gray-100: #F3F4F6;
  --color-white: #FFFFFF;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

---

## Tailwind Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        nooch: {
          dark: '#1F2937',
          gray: '#6B7280',
          light: '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '16px',
      }
    }
  }
}
```

---

## Brand Voice

### Tone Attributes

| Attribute | Description |
|-----------|-------------|
| **Warm** | Friendly, supportive, encouraging |
| **Expert** | Knowledgeable, credible, trustworthy |
| **Empowering** | Coach-first, capability-enhancing |
| **Clear** | Simple, jargon-free, accessible |

### Writing Guidelines

1. **Address coaches directly** - "You" and "your clients"
2. **Emphasize partnership** - AI assists, coach leads
3. **Focus on outcomes** - Time saved, clients helped, income grown
4. **Avoid tech jargon** - "Smart responses" not "RAG pipeline"

### Example Copy

**Hero Headline:**
> Scale your coaching practice without losing your personal touch.

**Feature Description:**
> Nooch learns your methodology and drafts personalized responses for every client. You review, approve, and send—staying in control while saving hours each week.

**CTA:**
> Start coaching smarter →

---

## Do's and Don'ts

### Do's ✓
- Use coral as an accent, not as a primary background color
- Maintain generous white space
- Keep text hierarchy clear and scannable
- Use rounded corners consistently (8-16px)
- Include human elements in imagery

### Don'ts ✗
- Don't use pure black (#000000) for text
- Don't use more than 2-3 colors in a single composition
- Don't stretch or distort the logo
- Don't use harsh, clinical imagery
- Don't use robotic or cold AI imagery

---

## File Naming Convention

```
nooch-[asset-type]-[variant]-[size].[format]

Examples:
nooch-logo-dark-1x.svg
nooch-icon-coral-32.png
nooch-hero-gradient-1920.jpg
```

---

## Contact

For brand questions or asset requests:
- Brand Assets: [Link to brand folder]
- Questions: brand@nooch.ai

---

*Last Updated: January 2026*
*Version: 1.0*
