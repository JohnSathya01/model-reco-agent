# AI Copilot - Visual UI Guide

## 🎨 Component Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Header                            │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                           │
│   Input Form         │   Results Dashboard                       │
│   (Left Panel)       │   (Right Panel)                          │
│                      │                                           │
│                      │   [Overview] [Pipeline] [Analysis]       │
│                      │   [API] [Activity]                       │
│                      │                                           │
│                      │   ┌─────────────────────────────────┐   │
│                      │   │  Dashboard Content              │   │
│                      │   │                                 │   │
│                      │   └─────────────────────────────────┘   │
│                      │                                           │
│                      │                    ┌──────────────────┐  │
│                      │                    │  AI COPILOT      │  │
│                      │                    │  DRAWER          │  │
│                      │                    │  (Right Side)    │  │
│                      │                    └──────────────────┘  │
│                      │                                           │
│                      │              ╭─────╮                     │
│                      │              │ AI  │ ← Floating Button   │
│                      │              ╰─────╯                     │
└──────────────────────┴──────────────────────────────────────────┘
```

## 🔘 Floating Toggle Button

**Location**: Bottom-right corner (fixed position)

```
╭─────────────╮
│   ✨        │  ← Sparkles icon
│             │
│   ╭───╮     │
│   │ AI│     │  ← AI badge (animated pulse)
│   ╰───╯     │
╰─────────────╯
```

**Styling**:
- Gradient: Blue-600 → Purple-600
- Size: 64px × 64px (rounded-full)
- Shadow: Large with hover effect
- Animation: Scale on hover (1.05x)
- Z-index: 50 (always on top)

## 📱 Copilot Drawer (Opened)

**Layout**: Fixed right side, full height, 384px width

```
┌────────────────────────────────────┐
│ ✨ AI Copilot              ✕      │ ← Header (gradient)
│ Context: Pipeline Architecture     │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │ 👋 Hi! I'm your AI Copilot  │ │ ← Assistant message
│  │                              │ │   (white background)
│  │ I can help you with:         │ │
│  │ - Reduce costs               │ │
│  │ - Optimize performance       │ │
│  └──────────────────────────────┘ │
│                                    │
│              ┌──────────────────┐  │
│              │ Reduce costs     │  │ ← User message
│              └──────────────────┘  │   (blue background)
│                                    │
│  ┌──────────────────────────────┐ │
│  │ I've analyzed your config... │ │ ← Assistant response
│  │                              │ │
│  │ ╭─ Proposed Changes ────────╮│ │
│  │ │ ✓ Instance Type:          ││ │ ← Change card
│  │ │   ml.p3.2xlarge → g4dn    ││ │   (blue background)
│  │ │ ✓ Training: Full → LoRA   ││ │
│  │ │                           ││ │
│  │ │ Impact:                   ││ │
│  │ │ 📉 Cost: -42%             ││ │
│  │ │ 📈 Latency: +15ms         ││ │
│  │ ╰───────────────────────────╯│ │
│  └──────────────────────────────┘ │
│                                    │
│  ● ● ●  ← Typing indicator         │
│                                    │
├────────────────────────────────────┤
│ ⚠️ Would you like me to apply    │ ← Confirmation
│    these changes?                  │   (yellow background)
│                                    │
│ [✓ Accept Changes] [✕ Reject]    │
├────────────────────────────────────┤
│ [Ask me anything...        ] [→]  │ ← Input box
└────────────────────────────────────┘
```

## 🎨 Color Scheme

### Header
- Background: `linear-gradient(to right, #2563eb, #9333ea)`
- Text: White
- Context label: Light blue (blue-100)

### Messages
- **User**: 
  - Background: `#2563eb` (blue-600)
  - Text: White
  - Alignment: Right
  
- **Assistant**: 
  - Background: White
  - Border: `#e5e7eb` (gray-200)
  - Text: `#111827` (gray-900)
  - Alignment: Left

### Proposed Changes Card
- Background: `#dbeafe` (blue-50)
- Border: `#93c5fd` (blue-200)
- Header icon: Blue-600
- Checkmarks: Green-600

### Confirmation Area
- Background: `#fef3c7` (yellow-50)
- Border: `#fde68a` (yellow-200)
- Warning icon: Yellow-600
- Text: `#92400e` (yellow-800)

### Buttons
- **Accept**: 
  - Background: `#16a34a` (green-600)
  - Hover: `#15803d` (green-700)
  - Icon: CheckCircle
  
- **Reject**: 
  - Background: `#4b5563` (gray-600)
  - Hover: `#374151` (gray-700)
  - Icon: XCircle

### Input Box
- Background: White
- Border: `#d1d5db` (gray-300)
- Focus ring: Blue-500
- Send button: Blue-600

## 📊 Impact Indicators

### Cost/Latency Reduction (Good)
```
📉 Cost: -42%
   ↓
   Green color (#16a34a)
   TrendingDown icon
```

### Cost/Latency Increase (Caution)
```
📈 Latency: +15ms
   ↑
   Orange color (#ea580c)
   TrendingUp icon
```

### Neutral Impact
```
➖ Complexity: Low
   —
   Gray color (#4b5563)
   Minus icon
```

## 🎭 Animations

### Drawer Entrance
```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
/* Duration: 0.3s, Easing: ease-out */
```

### Typing Indicator
```
● ● ●
↓ ↓ ↓
Bounce animation with staggered delays
(0ms, 150ms, 300ms)
```

### AI Badge Pulse
```
AI
↓
Scale pulse animation
Continuous loop
```

### Button Hover
```
[Accept Changes]
      ↓
Scale: 1.0 → 1.02
Shadow: Increase
Transition: 200ms
```

## 📐 Dimensions

### Drawer
- Width: `384px` (24rem)
- Height: `100vh` (full viewport)
- Position: Fixed right
- Z-index: 50

### Floating Button
- Size: `64px × 64px`
- Border radius: `50%` (full circle)
- Position: Fixed bottom-right
- Offset: `24px` from edges

### Message Bubbles
- Max width: `85%` of drawer
- Padding: `12px` (0.75rem)
- Border radius: `8px` (0.5rem)
- Margin: `16px` between messages

### Change Card
- Padding: `12px` (0.75rem)
- Border radius: `8px` (0.5rem)
- Border width: `1px`
- Spacing: `12px` between items

### Confirmation Area
- Padding: `16px` (1rem)
- Border top: `1px`
- Button height: `40px` (2.5rem)
- Button spacing: `8px` gap

### Input Box
- Height: `40px` (2.5rem)
- Padding: `16px` horizontal
- Border radius: `8px` (0.5rem)
- Send button: `40px × 40px`

## 🔤 Typography

### Header
- Font size: `16px` (1rem)
- Font weight: 600 (semibold)
- Context: `12px` (0.75rem)

### Messages
- Font size: `14px` (0.875rem)
- Line height: 1.5
- Timestamp: `12px` (0.75rem)

### Change Card
- Title: `14px` (0.875rem), semibold
- Items: `12px` (0.75rem)
- Impact: `12px` (0.75rem)

### Confirmation
- Text: `14px` (0.875rem), medium
- Buttons: `14px` (0.875rem), medium

### Input
- Font size: `14px` (0.875rem)
- Placeholder: Gray-400

## 🎯 Interactive States

### Floating Button
- **Default**: Gradient, shadow-lg
- **Hover**: Scale 1.05, shadow-xl
- **Active**: Scale 0.95
- **Focus**: Ring-2, ring-blue-500

### Send Button
- **Default**: Blue-600
- **Hover**: Blue-700
- **Disabled**: Gray-300, cursor-not-allowed
- **Active**: Blue-800

### Accept Button
- **Default**: Green-600
- **Hover**: Green-700
- **Active**: Green-800
- **Focus**: Ring-2, ring-green-500

### Reject Button
- **Default**: Gray-600
- **Hover**: Gray-700
- **Active**: Gray-800
- **Focus**: Ring-2, ring-gray-500

## 📱 Responsive Behavior

### Desktop (>1024px)
- Drawer: 384px width
- Floating button: Bottom-right
- Full functionality

### Tablet (768px - 1024px)
- Drawer: 384px width (may overlap content)
- Floating button: Bottom-right
- Scrollable messages

### Mobile (<768px)
- Drawer: Full width or 90vw
- Floating button: Bottom-right
- Optimized for touch

## 🎨 Visual Hierarchy

### Primary Elements
1. Floating button (most prominent)
2. Confirmation buttons (when active)
3. Proposed changes card
4. Send button

### Secondary Elements
1. Message bubbles
2. Header
3. Input box
4. Timestamps

### Tertiary Elements
1. Icons
2. Impact indicators
3. Typing indicator
4. Context label

## 🔍 Accessibility Features

### ARIA Labels
- Floating button: "Open AI Copilot"
- Close button: "Close AI Copilot"
- Send button: "Send message"
- Accept button: "Accept Changes"
- Reject button: "Reject Changes"

### Keyboard Navigation
- Tab: Navigate between interactive elements
- Enter: Send message / Activate button
- Escape: Close drawer (when not in input)

### Screen Reader Support
- Semantic HTML structure
- Role attributes on custom elements
- Live regions for dynamic content
- Descriptive labels on all controls

### Focus Management
- Auto-focus input when drawer opens
- Visible focus indicators
- Logical tab order
- Focus trap within drawer

## 🎬 User Flow

```
1. User sees floating AI button
         ↓
2. Clicks to open drawer
         ↓
3. Reads welcome message
         ↓
4. Types question in input
         ↓
5. Clicks send or presses Enter
         ↓
6. Sees typing indicator
         ↓
7. Reads AI response
         ↓
8. Reviews proposed changes card
         ↓
9. Reads impact analysis
         ↓
10. Sees confirmation prompt
         ↓
11. Clicks Accept or Reject
         ↓
12. Sees confirmation message
         ↓
13. Checks Activity tab (optional)
```

## 💡 Design Principles

1. **Non-Intrusive**: Drawer doesn't block main content
2. **Clear Hierarchy**: Important actions are prominent
3. **Visual Feedback**: Every action has a response
4. **Consistent**: Follows app's design system
5. **Accessible**: Works for all users
6. **Responsive**: Adapts to screen size
7. **Performant**: Smooth animations
8. **Intuitive**: Self-explanatory interface

---

This visual guide provides a complete reference for the AI Copilot's appearance and behavior!
