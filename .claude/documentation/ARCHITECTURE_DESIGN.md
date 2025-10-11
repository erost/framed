# Picture Frame Creator - Architecture Design

## 1. Overview

Picture Frame Creator is a Vue.js-based web application that allows users to create layouts of two images with customizable backgrounds, spacing, and orientations. The application uses Konva.js for canvas rendering and provides high-resolution image export.

### Key Design Principles
- **Component-based architecture**: Modular, reusable Vue components
- **Separation of concerns**: Business logic separated from presentation
- **Testability**: Components and utilities designed for easy testing
- **Performance**: Efficient canvas operations and reactive state management
- **Maintainability**: Clear folder structure and well-documented code

---

## 2. Technology Stack

### Core Dependencies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Vue.js 3 | 3.5.22 | Frontend framework with Composition API |
| Konva.js | 9.3.22 | Canvas manipulation library |
| vue-konva | 3.2.6 | Vue wrapper for Konva.js |
| Tailwind CSS | 3.4.18 | Utility-first CSS framework |
| Vite | 5.0.11 | Build tool and dev server |
| Vitest | 1.2.1 | Testing framework |
| ESLint | 8.56.0 | Code linting |
| Prettier | 3.2.4 | Code formatting |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.vue                              │
│  (Root Component - Theme, Layout Container)                  │
└────────┬───────────────────────────────┬────────────────────┘
         │                               │
┌────────▼────────┐             ┌────────▼─────────┐
│ AppHeader.vue   │             │CanvasContainer   │
│ (Header+Theme)  │             │  FrameCanvas     │
└─────────────────┘             │  (Rendering)     │
                                └────────┬─────────┘
┌─────────────────┐                      │
│ ConfigBar.vue   │             ┌────────┴─────────┐
│ (Row 1 & 2)     │             │                  │
└────────┬────────┘         ┌───▼──────┐    ┌─────▼──────┐
         │                  │  Konva   │    │   Image    │
   ┌─────┴──────┐           │  Stage   │    │  Upload    │
   │            │           └──────────┘    └────────────┘
┌──▼───┐  ┌────▼────┐
│Orient│  │  Ratio  │
│Toggle│  │Selector │
└──────┘  └─────────┘
┌──────┐  ┌────────┐  ┌────────┐
│Color │  │ Frame  │  │Spacing │
│Picker│  │  Size  │  │ Input  │
└──────┘  └────────┘  └────────┘

┌─────────────────┐
│ ActionBar.vue   │
│ (Below Canvas)  │
└────────┬────────┘
         │
   ┌─────┴──────┐
┌──▼───┐  ┌────▼────┐
│Reset │  │Download │
│Button│  │ Button  │
└──────┘  └─────────┘

           Composables Layer (Business Logic)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│useFrameConfig│useImageState │useCanvasRender│useTheme      │
└──────────────┴──────────────┴──────────────┴──────────────┘

              Utilities Layer (Pure Functions)
┌──────────────┬──────────────┬──────────────┐
│calculations  │validation    │constants     │
└──────────────┴──────────────┴──────────────┘
```

### 3.2 Data Flow

```
User Interaction
      │
      ▼
  Component Event
      │
      ▼
  Composable (State Update)
      │
      ├──▼ Validation (Utils)
      │
      ├──▼ Calculation (Utils)
      │
      ▼
  Reactive State Change
      │
      ▼
  Canvas Re-render (Konva)
      │
      ▼
  Visual Update
```

---

## 4. Project Structure

```
src/
├── main.js                      # Application entry point
├── App.vue                      # Root component
├── assets/
│   └── styles/
│       └── main.css            # Tailwind imports, global styles
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue       # Header with theme toggle
│   │   ├── ConfigBar.vue       # Configuration controls bar (2 rows)
│   │   ├── ActionBar.vue       # Action buttons bar (below canvas)
│   │   └── CanvasContainer.vue # Canvas wrapper with upload zones
│   ├── canvas/
│   │   ├── FrameCanvas.vue     # Main Konva canvas component
│   │   └── ImageUploadZone.vue # Image upload interface
│   ├── controls/
│   │   ├── AspectRatioSelector.vue  # Button group (3:2, 4:3, 5:4, 16:9)
│   │   ├── ColorPicker.vue          # Color swatch + hex input
│   │   ├── DownloadButton.vue       # Download canvas button
│   │   ├── FrameSizeInput.vue       # Frame size input (uses BaseInput)
│   │   ├── OrientationToggle.vue    # Portrait/Landscape toggle
│   │   ├── ResetButton.vue          # Reset configuration button
│   │   └── SpacingInput.vue         # Spacing input (uses BaseInput)
│   └── shared/
│       └── BaseInput.vue       # Reusable input component
├── composables/
│   ├── useFrameConfig.js       # Frame configuration state
│   ├── useImageState.js        # Image upload and management
│   ├── useCanvasRenderer.js    # Canvas rendering logic
│   └── useTheme.js             # Theme management
└── utils/
    ├── calculations.js         # Dimension calculations
    ├── validation.js           # Validation functions
    └── constants.js            # App constants
```

---

## 5. Component Architecture

### 5.1 Component Responsibilities

#### **App.vue**
- Root application container
- Initializes global theme state
- Provides main layout structure
- Manages canvas stage reference and preview width
- Coordinates ConfigBar, CanvasContainer, and ActionBar

#### **AppHeader.vue**
- Application title ("Framed")
- Theme toggle (light/dark mode)

#### **ConfigBar.vue**
- Groups frame configuration controls in 2 rows:
  - **Row 1**: OrientationToggle + AspectRatioSelector (side-by-side on desktop, stacked on mobile)
  - **Row 2**: ColorPicker + FrameSizeInput + SpacingInput (responsive flex layout)
- No props required (uses composables directly)

#### **ActionBar.vue**
- Contains action buttons positioned below canvas
- **Desktop**: Buttons aligned right, side-by-side
- **Mobile**: Stacked vertically with Download on top (flex-col-reverse)
- Receives stage and previewWidth props for download functionality

#### **CanvasContainer.vue**
- Canvas wrapper and orchestration
- Integrates FrameCanvas with ImageUploadZones
- Manages responsive sizing
- Coordinates image uploads with canvas

#### **FrameCanvas.vue**
- Konva.js stage integration
- Renders background, images, and layout
- Handles canvas export for download
- Manages image positioning and scaling

#### **ImageUploadZone.vue**
- File drop and click-to-upload interface
- Displays upload placeholder or preview
- Validates image files on upload

#### **OrientationToggle.vue**
- Button group: Portrait and Landscape
- Uses scoped CSS for styling (.orientation-btn, .btn-active, .btn-inactive)
- Full-width responsive layout with equal button distribution

#### **AspectRatioSelector.vue**
- Button group: 3:2, 4:3, 5:4, 16:9 ratios
- Uses scoped CSS matching OrientationToggle style
- Always horizontal layout, buttons shrink/grow equally

#### **ColorPicker.vue**
- Color swatch (40px square) + hex text input
- Uses scoped CSS (.color-picker-swatch, .color-text-input)
- Height matches BaseInput components
- Auto-validation and formatting for hex colors
- Hint text: "(hex format)"

#### **FrameSizeInput.vue**
- Uses BaseInput component
- Number input with "px" unit display
- Validation for min/max frame size

#### **SpacingInput.vue**
- Uses BaseInput component
- Number input with "px" unit display
- Validation for min/max spacing

#### **DownloadButton.vue**
- Triggers high-resolution canvas export
- Disables when images not uploaded
- Shows loading state during export

#### **ResetButton.vue**
- Resets all configuration to defaults
- Clears uploaded images

#### **BaseInput.vue**
- Shared input component with label, hint, and error display
- Supports unit display (e.g., "px")
- Consistent styling across all form inputs

---

## 6. State Management

### 6.1 Approach: Composition API with Composables

The application uses Vue 3 Composition API composables for state management, providing sufficient reactivity and sharing without the overhead of a heavy state management library.

### 6.2 State Structure

#### **Frame Configuration** (`useFrameConfig.js`)
```javascript
{
  orientation: 'portrait' | 'landscape',
  aspectRatio: '3:2' | '4:3' | '5:4' | '16:9',
  backgroundColor: string,      // Hex color
  frameSize: number,             // pixels (default 3000)
  spacing: number,               // pixels (default 150)
  frameWidth: computed,          // Based on orientation and aspect ratio
  frameHeight: computed,         // Based on orientation and aspect ratio
}
```

#### **Image State** (`useImageState.js`)
```javascript
{
  images: [
    {
      id: string,
      file: File,
      dataUrl: string,
      width: number,
      height: number,
    },
    // ... second image
  ]
}
```

#### **Theme State** (`useTheme.js`)
```javascript
{
  theme: 'light' | 'dark'
}
```

---

## 7. Konva Integration

### 7.1 Layer Structure

```
Stage (Responsive Container)
├── Background Layer
│   └── Rectangle (background color)
└── Images Layer
    ├── Image 1 (top/left position)
    └── Image 2 (bottom/right position)
```

### 7.2 Canvas Rendering (`useCanvasRenderer.js`)

**Responsibilities**:
- Calculate image positions and dimensions based on spacing
- Handle image scaling and centering within slots
- Generate Konva configuration objects
- Export canvas to downloadable image at full resolution

**Key Computed Properties**:
- `stageConfig`: Stage dimensions for preview
- `backgroundConfig`: Background rectangle configuration
- `image1Config` / `image2Config`: Image positioning and sizing
- `imageLayout`: Calculates slot positions for images

### 7.3 Preview vs. Export Dimensions

**Preview Mode**:
- Canvas scales to fit screen (default 800px width)
- Maintains aspect ratio
- All elements scale proportionally

**Export Mode**:
- Canvas renders at exact `frameWidth` x `frameHeight`
- Uses `pixelRatio` parameter in Konva's `toDataURL()`/`toBlob()`
- Calculates scale ratio: `frameWidth / previewWidth`
- High-resolution output for download

---

## 8. Image Processing

### 8.1 Image Upload Flow

```
User selects file
      │
      ▼
File validation (type, size)
      │
      ▼
Load image to get dimensions
      │
      ▼
Store in state & display
      │
      ▼
Trigger canvas re-render
```

### 8.2 Image Layout Calculation

Images are positioned using the `calculateImageLayout()` utility:

- **Portrait orientation**: Images stacked vertically
- **Landscape orientation**: Images placed side-by-side
- **Spacing**: Configurable gap between images and frame edges
- **Centering**: Images centered within their allocated slots
- **Scaling**: Images scaled to fit while maintaining aspect ratio

---

## 9. Theme Management

### 9.1 Implementation

Uses Tailwind CSS dark mode with class strategy:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### 9.2 Theme Composable

```javascript
// useTheme.js
export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  watch(theme, (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  }, { immediate: true });

  return { theme, toggleTheme };
}
```

---

## 10. Testing Strategy

### 10.1 Testing Coverage

- **Unit Tests (70%)**: Pure functions, utilities, composables
- **Component Tests (25%)**: Vue components in isolation
- **Integration Tests (5%)**: Full user workflows

### 10.2 Testing Tools

- **Vitest**: Test framework with Vite integration
- **@vue/test-utils**: Vue component testing utilities
- **happy-dom**: Lightweight DOM implementation

### 10.3 Test Coverage

| Category | Target | Current Status |
|----------|--------|----------------|
| Overall | 60%+ | ✅ Achieved |
| Utils | 95%+ | ✅ Achieved |
| Composables | 80%+ | ✅ Achieved |
| Components | 70%+ | ✅ Achieved |

**Total Tests**: 350 tests passing
- All components have dedicated test suites
- Vitest with @vue/test-utils for component testing
- Mock components used for integration tests to avoid dependency issues

---

## 11. Utility Functions

### 11.1 Constants (`utils/constants.js`)

```javascript
export const ASPECT_RATIOS = {
  '3:2': 1.5,
  '4:3': 1.333,
  '5:4': 1.25,
  '16:9': 1.778,
};

export const ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

export const IMAGE_CONSTRAINTS = {
  maxFileSize: 40 * 1024 * 1024, // 40MB
  minDimension: 800,
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  aspectRatioTolerance: 0.05,
};

export const FRAME_CONSTRAINTS = {
  minSize: 2000,
  maxSize: 6000,
  defaultSize: 3000,
  minSpacing: 50,
  maxSpacing: 500,
  defaultSpacing: 150,
};
```

### 11.2 Calculations (`utils/calculations.js`)

Key functions:
- `calculateFrameDimensions()`: Calculate frame width/height based on orientation and aspect ratio
- `calculateImageLayout()`: Calculate positions for two images
- `calculatePreviewScale()`: Calculate scale ratio for responsive preview
- `calculateScaledDimensions()`: Fit image within container maintaining aspect ratio
- `calculateCenterOffset()`: Center image within slot

### 11.3 Validation (`utils/validation.js`)

Key functions:
- `validateImageFile()`: Validate file type and size
- `validateFrameSize()`: Validate frame size within constraints
- `validateSpacing()`: Validate spacing within constraints
- `isValidHexColor()`: Validate hex color codes

---

## 12. Key Technical Decisions

### 12.1 State Management: Composables vs. Pinia

**Decision**: Use Composition API composables

**Rationale**:
- Application state is relatively simple
- No need for complex state mutations
- Better performance (no proxy overhead)
- Easier to test
- Aligns with Vue 3 best practices

### 12.2 Konva Integration: vue-konva

**Decision**: Use `vue-konva` wrapper

**Rationale**:
- Declarative API matches Vue paradigm
- Automatic reactivity integration
- Less boilerplate code
- Better integration with Vue lifecycle

### 12.3 Color Picker: Native HTML5 + Text Input

**Decision**: Use native `input type="color"` with hex text input

**Rationale**:
- No external dependencies
- Native OS color picker UI for visual selection
- Text input allows precise hex color entry
- Better accessibility
- Smaller bundle size
- Dual input method improves UX

### 12.4 Canvas Export: pixelRatio Scaling

**Decision**: Use Konva's `pixelRatio` parameter

**Rationale**:
- Single stage for preview and export
- No quality loss
- Simple implementation
- Efficient memory usage

### 12.5 UI Layout: Button Groups vs. Dropdowns

**Decision**: Use button groups for OrientationToggle and AspectRatioSelector instead of dropdowns

**Rationale**:
- All options visible at once (no click required to see choices)
- Better UX for small number of options (2-4 choices)
- Faster interaction (single click vs. open + select)
- Clearer visual feedback of current selection
- Consistent styling with Tailwind utility classes

### 12.6 Responsive Layout: Flexbox

**Decision**: Use flexbox for responsive layout with mobile-first approach

**Rationale**:
- ConfigBar Row 1 & 2: `flex-col` on mobile, `md:flex-row` on desktop
- ActionBar: `flex-col-reverse` on mobile (Download on top), `sm:flex-row sm:justify-end` on desktop
- Equal distribution with `flex-1` on child containers
- Simpler than CSS Grid for this use case
- Better browser support and performance

### 12.7 CSS Organization: Scoped CSS with Tailwind @apply

**Decision**: Move repetitive Tailwind classes to scoped CSS using `@apply`

**Rationale**:
- Reduces template clutter
- Easier to maintain consistent styling
- Better separation of concerns (structure vs. styling)
- Improves readability of component templates
- Allows for semantic class names (.btn-active, .ratio-btn, etc.)

---

## 13. Browser Support

### 13.1 Target Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

### 13.2 Required Features

- ES6+ support
- Canvas API
- File API
- Blob API
- LocalStorage

---

## 14. Performance Optimization

### 14.1 Runtime Optimization

- Computed properties for expensive calculations
- Reactive state updates trigger efficient re-renders
- Canvas layers cached by Konva
- Preview scaling reduces rendering load

### 14.2 Build Optimization

- Code splitting via Vite
- Tailwind CSS purging removes unused styles
- Production builds minified
- Source maps for debugging

---

## 15. Accessibility

### 15.1 WCAG 2.1 AA Compliance

- Keyboard navigation for all controls
- Clear focus indicators
- Sufficient color contrast (4.5:1 for text)
- ARIA labels where needed
- Descriptive button labels
- Form inputs with associated labels

---

## 16. Security

### 16.1 Client-Side Processing

- All image processing happens client-side
- No data sent to servers
- No data persistence (unless user saves locally)
- File validation before processing

### 16.2 Content Security

- File type validation
- File size limits (10MB)
- Sandboxed canvas operations

---

## Appendix: References

- [Vue 3 Documentation](https://vuejs.org/)
- [Konva.js Documentation](https://konvajs.org/)
- [vue-konva Documentation](https://github.com/konvajs/vue-konva)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

**Document Version**: 3.0
**Last Updated**: 2025-10-10
**Status**: Current

---

## Changelog

### Version 3.0 (2025-10-10)
- Updated architecture diagram to reflect ActionBar component separation
- Added ActionBar.vue component documentation
- Updated ConfigBar.vue to reflect 2-row layout (removed action buttons)
- Added detailed component descriptions for all controls
- Documented button group pattern for OrientationToggle and AspectRatioSelector
- Added ColorPicker scoped CSS pattern documentation
- Updated constants to include FRAME_CONSTRAINTS
- Added validation functions for frame size and spacing
- Documented UI refactoring decisions (sections 12.5-12.7)
- Updated test coverage with current statistics (350 tests)
- Removed BaseSelect.vue from project structure (no longer used)

### Version 2.0 (2025-10-09)
- Initial comprehensive architecture documentation
