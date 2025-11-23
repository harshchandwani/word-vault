# Word Archive - Design Guidelines

## Design Approach
**System**: Material Design principles adapted for reading-focused application
**Rationale**: Vocabulary learning requires excellent readability, clear hierarchy, and minimal cognitive load. Material Design's emphasis on content and typography aligns perfectly with the app's educational purpose.

**Key Principles**:
- Reading-first: Prioritize legibility and comprehension
- Breathing room: Generous whitespace around text content
- Focused interactions: Clear, predictable UI patterns
- Scholarly aesthetic: Clean, refined, distraction-free

## Typography
**Font Family**: Noto Serif (all weights via Google Fonts CDN)

**Hierarchy**:
- Page titles: text-4xl, font-semibold
- Section headers: text-2xl, font-medium
- Vocabulary terms: text-xl, font-semibold
- Definitions/Body: text-base, font-normal, leading-relaxed
- Example sentences: text-base, italic, leading-relaxed
- Labels/UI elements: text-sm, font-medium
- Captions/metadata: text-xs, text-gray-600

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 as core spacing primitives
- Component padding: p-6 or p-8
- Section spacing: space-y-4 or space-y-6
- Card gaps: gap-6
- Form field spacing: space-y-4

**Container Strategy**:
- Max width: max-w-4xl for optimal reading
- Centered layouts: mx-auto
- Page padding: px-6 lg:px-8

## Component Library

### Authentication Pages
- Centered card layout (max-w-md)
- Single-column form with clear field labels
- Primary action button (full width)
- Minimal branding: "Word Archive" in Noto Serif at top
- Link to switch between login/register below form

### Main Application Layout
**Navigation Bar**:
- Fixed top position with subtle shadow
- Left: "Word Archive" wordmark
- Center: Nothing (keep clean)
- Right: "Add Entry" button + user menu (username with dropdown: Logout)
- Height: h-16
- Padding: px-6

**Content Area**:
- Top margin: mt-16 (to clear fixed nav)
- Container: max-w-4xl mx-auto py-8

### Entry List View
**List Container**:
- Vertical stack with space-y-6
- Each entry as distinct card with rounded corners and subtle border

**Entry Card Structure**:
- Padding: p-6
- Term: Large, bold at top
- Definition: Below term with mt-3
- Example: Below definition with mt-4, italicized, slightly muted
- Actions row: Right-aligned at bottom (Edit | Delete as text buttons)

**Empty State**:
- Centered message with icon placeholder
- "No vocabulary entries yet"
- Subtitle: "Click 'Add Entry' to start building your collection"

### Add/Edit Entry Form
**Form Layout**:
- Card container with p-8
- Header with title ("Add Entry" or "Edit Entry")
- Vertical form fields with consistent spacing (space-y-6)

**Field Structure**:
- Label above each input (font-medium, text-sm)
- Full-width text inputs for term (single line)
- Textarea for definition (4 rows, resize-vertical)
- Textarea for example (3 rows, resize-vertical)

**Form Actions**:
- Button row at bottom: flex justify-end gap-4
- Cancel button (secondary style)
- Save button (primary style)

### Buttons
**Primary**: Solid background, medium font-weight, px-6 py-2.5, rounded-md
**Secondary**: Border style, same padding and rounding
**Text/Action**: No background, underline on hover, color accent

### Interactive States
- Input focus: Ring effect (ring-2)
- Button hover: Subtle opacity change (hover:opacity-90)
- Card hover: None (keep calm)
- Delete action: Confirmation required (modal overlay)

### Confirmation Modal
- Overlay: Full screen with backdrop
- Dialog: Centered card (max-w-md)
- Content: Warning message with entry term
- Actions: Cancel + Confirm Delete (destructive styling)

## Animations
**Minimal Use**:
- Page transitions: None (instant)
- Modal appearance: Simple fade-in (200ms)
- Button interactions: Built-in browser defaults only
- Form feedback: Instant display of error messages

## Accessibility
- All form inputs have proper labels
- Focus indicators on all interactive elements
- Semantic HTML throughout (nav, main, article for entries)
- ARIA labels where needed (especially icon buttons)
- Keyboard navigation support (Tab order, Enter to submit)

## No Images Required
This application is purely text-focused. No hero images, decorative graphics, or illustrations needed. The design relies entirely on typography, spacing, and subtle UI elements.