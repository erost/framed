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
│                         App.vue                             │
│  (Root Component - Responsive Layout Container)             │
│  Desktop: Sidebar + Canvas | Mobile: Canvas + Bottom Panel  │
└────────┬───────────────────────────────┬────────────────────┘
         │                               │
         │                       ┌───────▼──────────┐
         │                       │ CanvasContainer  │
         │                       │   FrameCanvas    │
         │                       │   (Rendering)    │
         │                       └────────┬─────────┘
         │                                │
┌────────▼────────┐              ┌───────┴─────────┐
│ ConfigBar.vue   │              │                 │
│ (Configuration) │          ┌───▼──────┐   ┌─────▼──────┐
└────────┬────────┘          │  Konva   │   │   Image    │
         │                   │  Stage   │   │  Upload    │
   ┌─────┴───────┐           └──────────┘   └────────────┘
   │             │
   │  ConfigElement Wrapper (x7)
   │             │
┌──▼───┐  ┌────▼────┐  ┌────────┐  ┌─────────┐
│Orient│  │  Ratio  │  │ Color  │  │  Frame  │
│Toggle│  │Selector │  │ Picker │  │  Size   │
└──────┘  └─────────┘  └────────┘  └─────────┘
┌──────┐  ┌────────┐  ┌────────┐
│Border│  │ Format │  │Quality │
│Slider│  │Selector│  │ Slider │
└──────┘  └────────┘  └────────┘

┌─────────────────┐
│ ActionBar.vue   │
│ (Action Buttons)│
└────────┬────────┘
         │
   ┌─────┴──────┐
┌──▼───┐  ┌────▼────┐
│Reset │  │Download │
│Button│  │ Button  │
└──────┘  └─────────┘

           Composables Layer (Business Logic)
┌──────────────┬──────────────┬──────────────┐
│useFrameConfig│useImageState │useCanvasRender│
└──────────────┴──────────────┴──────────────┘

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
├── App.vue                      # Root component with responsive layout
├── assets/
│   └── styles/
│       └── main.css            # Tailwind imports, shared component styles
├── components/
│   ├── layout/
│   │   ├── ConfigBar.vue       # Configuration controls container
│   │   ├── ActionBar.vue       # Action buttons container
│   │   └── CanvasContainer.vue # Canvas wrapper with upload zones
│   ├── canvas/
│   │   ├── FrameCanvas.vue     # Main Konva canvas component
│   │   └── ImageUploadZone.vue # Image upload interface
│   ├── shared/
│   │   └── ConfigElement.vue   # Configuration control wrapper
│   └── controls/
│       ├── AspectRatioSelector.vue  # Button group (3:2, 4:3, 5:4, 16:9)
│       ├── BorderSlider.vue         # Border percentage slider (1-25%)
│       ├── ColorPicker.vue          # HTML5 color picker
│       ├── DownloadButton.vue       # Download canvas button
│       ├── FormatSelector.vue       # Export format selector (PNG, JPEG, WebP)
│       ├── FrameSizeSelector.vue    # Frame size selector (presets + native)
│       ├── OrientationToggle.vue    # Portrait/Landscape toggle
│       ├── QualitySlider.vue        # Export quality slider (1-100%)
│       └── ResetButton.vue          # Reset configuration button
├── composables/
│   ├── useFrameConfig.js       # Frame configuration state
│   ├── useImageState.js        # Image upload and management
│   └── useCanvasRenderer.js    # Canvas rendering logic
└── utils/
    ├── calculations.js         # Dimension calculations
    ├── validation.js           # Validation functions
    └── constants.js            # App constants
```

---

## 5. Component Architecture

### 5.1 Component Responsibilities

#### **App.vue**
- Root application container with responsive layout
- **Desktop**: Horizontal layout with sidebar and canvas area
- **Mobile**: Vertical reverse layout with canvas on top and bottom panel
- **Mobile Panel**: CSS-only slide-up settings panel using checkbox hack
  - Chevron button toggles panel visibility
  - Panel slides over canvas without JavaScript
  - Settings displayed vertically when expanded
- Manages canvas stage reference and preview width calculation
- Coordinates ConfigBar, CanvasContainer, and ActionBar

#### **ConfigBar.vue**
- Container for all frame configuration and export settings controls
- Vertical stack layout for both desktop and mobile
- Uses ConfigElement wrapper for consistent control presentation
- Contains 7 configuration controls:
  - Orientation, Aspect Ratio, Frame Color, Frame Size, Border Size, Export Format, Quality
- No props required (uses composables directly)

#### **ActionBar.vue**
- Container for action buttons (Reset and Download)
- **Desktop**: Buttons aligned in sidebar bottom section
- **Mobile**: Fixed at bottom of screen below canvas
- Receives stage and previewWidth props for download functionality

#### **ConfigElement.vue**
- Shared wrapper component for consistent configuration control layout
- Provides two slots:
  - **label**: Configuration control label (e.g., "Orientation", "Border Size")
  - **element**: The actual control component
- Standardizes spacing, typography, and layout across all configuration controls
- Used by all controls in ConfigBar for visual consistency

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

#### **Control Components**

**OrientationToggle.vue**
- Button group for Portrait and Landscape orientations
- Uses shared selector button styles from main.css

**AspectRatioSelector.vue**
- Button group for aspect ratio presets: 3:2, 4:3, 5:4, 16:9
- Uses shared selector button styles from main.css

**ColorPicker.vue**
- Native HTML5 color picker for frame color selection
- Auto-validation and formatting for hex colors

**FrameSizeSelector.vue**
- Button group for frame size presets: 1024px, 2048px, 4096px, Native
- Uses shared selector button styles from main.css
- Native option uses original uploaded image dimensions

**BorderSlider.vue**
- Range slider for border percentage (1-25%)
- Uses shared range slider styles from main.css
- Border calculated as percentage of frame size
- Fixed inner spacing between images (not configurable)

**FormatSelector.vue**
- Button group for export formats: PNG, JPEG, WebP
- Uses shared selector button styles from main.css
- Dynamically generates filenames at download time

**QualitySlider.vue**
- Range slider for export quality (1-100%)
- Uses shared range slider styles from main.css
- Affects compression for JPEG and WebP formats

**DownloadButton.vue**
- Triggers high-resolution canvas export
- Disabled when images not uploaded
- Shows loading state during export

**ResetButton.vue**
- Resets all configuration to defaults
- Clears uploaded images

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
  backgroundColor: string,       // Hex color
  frameSize: number,             // pixels (default 2048)
  borderPercentage: number,      // 1-25% (default 2)
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
      fileName: string,
      dataUrl: string,
      width: number,
      height: number,
      orientation: string,
      aspectRatio: number,
    },
    // ... second image
  ]
}
```

#### **Canvas Renderer** (`useCanvasRenderer.js`)
```javascript
{
  quality: number,               // 1-100% (default 85)
  format: string,                // 'image/png' | 'image/jpeg' | 'image/webp'
  stageConfig: computed,
  backgroundConfig: computed,
  image1Config: computed,
  image2Config: computed,
  previewScale: computed,
  isReady: computed,
  canExport: computed,
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

Removed, only dark UI

---

## 10. Testing Strategy

### 10.1 Testing Approach

The application follows a **behavior-driven testing** philosophy, focusing on user interactions, state changes, and business logic rather than implementation details.

### 10.2 Testing Tools

- **Vitest**: Test framework with Vite integration
- **@vue/test-utils**: Vue component testing utilities
- **happy-dom**: Lightweight DOM implementation
- **Coverage**: v8 provider targeting 60%+ coverage for src/ folder only

### 10.3 Test Focus Areas

**What We Test:**
- User interactions and button clicks
- State changes via composables
- Business logic (disabled states, format updates, value calculations)
- Edge cases and error handling
- Integration between components
- Accessibility attributes with user interactions
- Event emissions with payloads

**What We Don't Test:**
- CSS classes and styling
- Layout implementation details (flex, padding, margins)
- TestId attributes
- Input attribute presence (min, max, step)
- Basic DOM structure
- Simple getters/setters without logic

### 10.4 Coverage Strategy

- **Unit Tests**: Pure functions, utilities, composables
- **Component Tests**: Vue components focusing on behavior
- **Integration Tests**: Component interaction workflows
- All major components have dedicated test suites
- Mock components used for integration tests to isolate dependencies

---

## 11. Utility Functions

### 11.1 Constants (`utils/constants.js`)

Constains all static values

### 11.2 Calculations (`utils/calculations.js`)

Key functions:
- `calculateFrameDimensions()`: Calculate frame width/height based on orientation and aspect ratio
- `calculateBorderSpacing()`: Calculate border spacing from percentage
- `calculateImageLayout()`: Calculate positions for two images with border and fixed 20px inner spacing
- `calculatePreviewScale()`: Calculate scale ratio for responsive preview
- `calculateScaledDimensions()`: Fit image within container maintaining aspect ratio
- `calculateCenterOffset()`: Center image within slot

### 11.3 Validation (`utils/validation.js`)

Key functions:
- `validateFile()`: Validate file type and size
- `validateImageDimensions()`: Validate image meets minimum dimensions
- `validateFrameSize()`: Validate frame size within constraints
- `validateSpacing()`: Validate spacing within constraints
- `extractValidFilenameChars()`: Extract valid characters from filename (1-10 chars)
- `generateUuidV1Short()`: Generate 8-character time-based UUID

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

### 12.3 Color Picker: Native HTML5

**Decision**: Use native `input type="color"`

**Rationale**:
- No external dependencies
- Native OS color picker UI
- Better accessibility
- Smaller bundle size
- Direct color selection without additional UI complexity

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

### 12.6 Responsive Layout: Flexbox with Mobile Slide-up Panel

**Decision**: Use flexbox for responsive layout with CSS-only mobile panel

**Rationale**:
- **Desktop**: Horizontal layout with sidebar (`flex-row`)
- **Mobile**: Vertical reverse layout with bottom panel (`flex-col-reverse`)
- **Mobile Panel**: CSS checkbox hack for slide-up panel without JavaScript
  - No state management overhead
  - Pure CSS transitions and transforms
  - Better performance (no JS event handlers)
  - Simpler implementation
- Flexbox simpler than CSS Grid for this use case
- Better browser support and performance

### 12.7 CSS Organization: Shared Component Styles

**Decision**: Centralize common component styles in main.css

**Rationale**:
- DRY principle - single source of truth for shared component styling
- **Selector buttons**: All selector components share identical button group styles
  - Classes: `.selector-group`, `.selector-btn`, `.selector-btn-active`, `.selector-btn-inactive`
  - Used by: OrientationToggle, AspectRatioSelector, FrameSizeSelector, FormatSelector
- **Range sliders**: Shared slider styling and value label positioning
  - Used by: BorderSlider, QualitySlider
- Better maintainability - style changes in one place
- Reduced code duplication
- Consistent styling guaranteed across all similar controls

### 12.8 Component Wrapper Pattern: ConfigElement

**Decision**: Create shared ConfigElement wrapper for all configuration controls

**Rationale**:
- Consistent label and element layout across all controls
- Single source of truth for configuration control presentation
- Reduces code duplication in ConfigBar
- Easier to maintain and update styling
- Slot-based design allows flexibility while maintaining consistency
- Separates structure (ConfigElement) from functionality (control components)

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

**Document Version**: 4.0
**Last Updated**: 2025-01-24
**Status**: Current

---

## Changelog

### Version 4.0 (2025-01-24)
- **Major UI Update**: Mobile slide-up settings panel with CSS-only implementation
  - Documented CSS checkbox hack pattern for mobile panel
  - Added mobile UX pattern documentation (chevron toggle, slide-up animation)
  - Updated App.vue to reflect responsive layout changes
- **New Component**: ConfigElement.vue wrapper for consistent control layout
  - Added to project structure under `shared/` folder
  - Documented component wrapper pattern (section 12.8)
- **Component Updates**:
  - ConfigBar: Now uses ConfigElement wrapper, single vertical stack layout
  - Removed: FileNameInput, SpacingInput, FrameSizeInput, BaseInput components
  - Renamed: QualityInput → QualitySlider
- **Architecture Diagram**: Updated to reflect ConfigElement and mobile panel pattern
- **Testing Strategy**: Rewritten to focus on behavior-driven testing approach
  - Removed specific test counts and coverage percentages
  - Added "What We Test" vs "What We Don't Test" guidelines
  - Coverage now targets src/ folder only
- **CSS Organization**: Documented shared range slider styles alongside selector styles
- **Responsive Layout**: Updated section 12.6 to document mobile panel decision
- **Technology Stack**: Updated Tailwind CSS version

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
- Removed BaseSelect.vue from project structure (no longer used)

### Version 2.0 (2025-10-09)
- Initial comprehensive architecture documentation
