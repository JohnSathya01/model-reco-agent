# Collaboration Feature - Real-Time Presence & Sharing

## Overview
Added Google Docs/Excel-style collaboration features to the ML Recommendation Generator, allowing teams to work together in real-time with presence indicators showing who's viewing or editing.

## Features Implemented

### 1. Collaboration Bar
**Location:** Top of the recommendation generator page (below back button if present)

**Features:**
- **Live Collaborator Count** - Shows number of active users
- **Avatar Stack** - Displays up to 3 collaborator avatars with initials
  - Color-coded avatars (blue, green, amber, etc.)
  - Status indicators (green dot = editing, blue dot = viewing, gray = idle)
  - Hover to see names
  - "+N" badge for additional collaborators
- **Live Indicator** - Animated green pulse showing real-time activity
- **Share Button** - Opens share modal for inviting collaborators

**Hover Interaction:**
- Hovering over avatars shows detailed collaborator panel
- Panel displays:
  - Full name and email
  - Role (ML Engineer, Solution Architect, etc.)
  - Current status (Editing/Viewing/Idle) with icons
  - Current section they're viewing (e.g., "Project Details", "Pipeline")
  - Last active time (e.g., "Just now", "2m ago")
  - Color-coded status badges

### 2. Share Modal
**Triggered by:** Clicking "Share" button in collaboration bar

**Features:**

#### Invite People Section
- Email input field with Mail icon
- Permission dropdown (Can view / Can edit / Admin)
- Invite button
- Press Enter to quickly invite
- Shows pending invitations

#### Share Link Section
- Shareable link with copy button
- "Anyone with the link can access" indicator
- One-click copy with success feedback
- Link format: `https://ml-reco.app/project/abc123xyz`

#### People with Access
- List of all collaborators with access
- For each person:
  - Avatar with initials
  - Name and email
  - Permission level dropdown (editable)
  - Remove access button
  - Pending status badge for new invites

#### Permission Levels
Information panel explaining:
- **Can view** (Eye icon): See all project details and recommendations
- **Can edit** (Edit icon): Modify settings and generate recommendations
- **Admin** (Shield icon): Full access including sharing and deleting

### 3. Real-Time Presence Indicators

**Status Types:**
- **Editing** (Green dot): Actively making changes
- **Viewing** (Blue dot): Viewing the project
- **Idle** (Gray dot): Inactive for a while

**Presence Information:**
- Who is currently active
- What section they're viewing
- When they were last active
- Real-time updates (simulated, ready for WebSocket integration)

## Technical Implementation

### Components Created

#### 1. `CollaborationBar.tsx`
```typescript
interface CollaboratorPresence {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'viewing' | 'editing' | 'idle';
  color: string;
  lastActive: Date;
  currentSection?: string;
}
```

**Key Features:**
- Avatar stack with overflow handling
- Hover-triggered detailed panel
- Status indicators with color coding
- Time ago calculation
- Responsive design

#### 2. `ShareModal.tsx`
**Key Features:**
- Email invitation system
- Permission management
- Link sharing with copy functionality
- Access control list
- Permission level explanations

### Integration Points

**App.tsx Updates:**
- Imported collaboration components
- Added `showShareModal` state
- Positioned CollaborationBar above Layout
- Connected Share button to modal

### Styling & UX

**Color Scheme:**
- Blue (#3B82F6): Primary collaborator color
- Green (#10B981): Active/editing status
- Amber (#F59E0B): Warning/secondary
- Purple (#8B5CF6): Accent
- Red (#EF4444): Remove/danger actions

**Animations:**
- Pulse animation on "Live" indicator
- Smooth hover transitions
- Scale effect on avatar hover
- Fade in/out for dropdowns

## Mock Data Structure

Currently using mock data for demonstration. Ready for backend integration:

```typescript
const collaborators = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'ML Engineer',
    status: 'editing',
    color: '#3B82F6',
    lastActive: new Date(),
    currentSection: 'Project Details'
  },
  // ... more collaborators
];
```

## Backend Integration Points

### Required APIs:
1. **GET /api/projects/:id/collaborators** - Fetch active collaborators
2. **POST /api/projects/:id/share** - Invite new collaborator
3. **PATCH /api/projects/:id/collaborators/:userId** - Update permissions
4. **DELETE /api/projects/:id/collaborators/:userId** - Remove access
5. **WebSocket** - Real-time presence updates

### WebSocket Events:
- `user:joined` - User opened the project
- `user:left` - User closed the project
- `user:editing` - User started editing
- `user:viewing` - User switched to viewing
- `user:section_change` - User navigated to different section
- `user:idle` - User became inactive

## User Experience Flow

### Scenario 1: Viewing Collaborators
1. User opens recommendation generator
2. Collaboration bar shows active users
3. Hover over avatars to see details
4. See who's editing what section in real-time

### Scenario 2: Inviting Collaborators
1. Click "Share" button
2. Enter email address
3. Select permission level
4. Click "Invite"
5. User receives email invitation
6. Appears in "People with access" list

### Scenario 3: Sharing via Link
1. Click "Share" button
2. Click "Copy" on share link
3. Share link via email/chat
4. Recipients can access with appropriate permissions

## Security Considerations

### Permission Levels:
- **View**: Read-only access to all project data
- **Edit**: Can modify project settings and generate recommendations
- **Admin**: Full control including sharing and deletion

### Access Control:
- Link-based sharing with unique project IDs
- Email-based invitations with verification
- Permission-based feature gating
- Audit log for access changes (future enhancement)

## Future Enhancements

### Phase 2:
- Real-time cursor tracking (show where users are clicking)
- Live editing indicators on specific form fields
- Comment/annotation system
- Version history with collaborator attribution
- Notification system for mentions and updates

### Phase 3:
- Video/audio chat integration
- Screen sharing for presentations
- Collaborative AI copilot suggestions
- Team workspaces and project folders
- Advanced analytics on collaboration patterns

## Files Created
- `src/components/collaboration/CollaborationBar.tsx`
- `src/components/collaboration/ShareModal.tsx`
- `src/components/collaboration/index.ts`

## Files Modified
- `src/App.tsx` - Added collaboration components

## Testing Checklist
- [x] Collaboration bar displays correctly
- [x] Avatar stack shows collaborators
- [x] Status indicators work (green/blue/gray dots)
- [x] Hover shows detailed collaborator panel
- [x] Share button opens modal
- [x] Email invitation form works
- [x] Permission dropdown functions
- [x] Copy link button works with feedback
- [x] Remove access button works
- [x] Permission levels display correctly
- [x] Responsive design on mobile
- [x] Build completes successfully

## Demo Collaborators
The system includes 3 mock collaborators for demonstration:
1. **Sarah Chen** (ML Engineer) - Currently editing Project Details
2. **John Doe** (Solution Architect) - Viewing Pipeline section
3. **Mike Johnson** (Project Manager) - Viewing Cost Analysis

## Benefits
1. **Real-Time Awareness** - See who's working on the project
2. **Avoid Conflicts** - Know when someone is editing
3. **Easy Sharing** - One-click invite and link sharing
4. **Permission Control** - Granular access management
5. **Team Collaboration** - Work together seamlessly
6. **Professional UX** - Familiar Google Docs-style interface
