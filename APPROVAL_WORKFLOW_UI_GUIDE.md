# 🎨 Approval Workflow - UI Guide

## Visual Walkthrough of the Approval System

---

## 1️⃣ Draft State (Engineer View)

### Overview Tab Display
```
┌─────────────────────────────────────────────────────────────┐
│  Recommendation Status                    [Submit for Review]│
│  ● Draft                                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📊 Recommended Model Card                                   │
│  GPT-4 Turbo - Best for your use case                       │
└─────────────────────────────────────────────────────────────┘
```

**What Engineer Sees:**
- Gray "Draft" status badge
- Blue "Submit for Review" button (with Send icon)
- All recommendation cards below
- No approval panel yet

---

## 2️⃣ Submit for Review Modal

```
┌──────────────────────────────────────────────────────────┐
│  Submit for Review                                    [×] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                            │
│  Project: ML Model Recommendation                          │
│                                                            │
│  📝 Add Notes (Optional)                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Ready for technical review. All requirements met.  │   │
│  │                                                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  This will notify the Solution Architect team for review.  │
│                                                            │
│                          [Cancel]  [Submit for Review]     │
└──────────────────────────────────────────────────────────┘
```

**After Submit:**
- ✅ Toast: "Submitted for review! Solution Architect will be notified."
- Status changes to "Pending Review"
- Activity log entry created

---

## 3️⃣ Pending Review State (Solution Architect View)

### Overview Tab Display
```
┌─────────────────────────────────────────────────────────────┐
│  Recommendation Status                                       │
│  ⏱ Pending Review                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Approval Status              [Request Changes]  [Approve]  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ⏱  Technical Review                                 │  │
│  │     👤 Waiting for Solution Architect review         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**What Solution Architect Sees:**
- Yellow "Pending Review" status badge
- Approval Panel with action buttons
- "Request Changes" button (gray)
- "Approve" button (green)
- Technical Review section showing pending status

---

## 4️⃣ Approve Modal

```
┌──────────────────────────────────────────────────────────┐
│  Approve Recommendation                               [×] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                            │
│  Project: ML Model Recommendation                          │
│  Approval Type: Technical Review                           │
│                                                            │
│  💬 Add Comment (Optional)                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Architecture looks solid. GPU selection is optimal.│   │
│  │                                                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ✅ By approving, you confirm this recommendation meets    │
│     technical requirements and best practices.             │
│                                                            │
│                                    [Cancel]  [Approve]     │
└──────────────────────────────────────────────────────────┘
```

**After Approve:**
- ✅ Toast: "Recommendation approved! Team has been notified."
- Status changes to "Approved"
- Approval details appear in panel

---

## 5️⃣ Approved State (All Users View)

### Overview Tab Display
```
┌─────────────────────────────────────────────────────────────┐
│  Recommendation Status                                       │
│  ✅ Approved                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Approval Status                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅  Technical Review                                │  │
│  │     👤 Approved by Sarah Chen                        │  │
│  │     💬 "Architecture looks solid. GPU selection is   │  │
│  │        optimal."                                     │  │
│  │     📅 Feb 4, 2026, 2:30 PM                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**What All Users See:**
- Green "Approved" status badge
- Approval Panel showing completed approval
- Approver name and role
- Approval comment
- Timestamp
- No action buttons (approval complete)

---

## 6️⃣ Request Changes Modal

```
┌──────────────────────────────────────────────────────────┐
│  Request Changes                                      [×] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                            │
│  Project: ML Model Recommendation                          │
│                                                            │
│  📝 Reason for Changes *                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Please consider using A100 GPUs instead of V100s   │   │
│  │ for better performance with this model size.       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ⚡ Priority                                               │
│  ○ Low    ● Medium    ○ High                              │
│                                                            │
│  The creator will be notified and can resubmit after      │
│  making the requested changes.                             │
│                                                            │
│                          [Cancel]  [Request Changes]       │
└──────────────────────────────────────────────────────────┘
```

**After Request Changes:**
- 📝 Toast: "Change request sent! Creator will be notified."
- Status changes to "Changes Requested"
- Change request appears in panel

---

## 7️⃣ Changes Requested State (Engineer View)

### Overview Tab Display
```
┌─────────────────────────────────────────────────────────────┐
│  Recommendation Status                                       │
│  ⚠️ Changes Requested                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Approval Status                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│  ⚠️ Changes Requested: Please review the feedback and make  │
│     the requested changes before resubmitting.               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ❌  Technical Review                                │  │
│  │     👤 Changes requested by Sarah Chen               │  │
│  │     💬 "Please consider using A100 GPUs instead of   │  │
│  │        V100s for better performance."                │  │
│  │     ⚡ Priority: Medium                               │  │
│  │     📅 Feb 4, 2026, 2:30 PM                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**What Engineer Sees:**
- Red "Changes Requested" status badge
- Warning message in approval panel
- Change request details with priority
- Can make changes and resubmit

---

## 8️⃣ Budget Approval (Project Manager View)

### When Budget Approval Required
```
┌─────────────────────────────────────────────────────────────┐
│  Approval Status                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅  Technical Review                                │  │
│  │     👤 Approved by Sarah Chen                        │  │
│  │     📅 Feb 4, 2026, 2:30 PM                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ⏱  Budget Approval                [Reject] [Approve]│  │
│  │     👤 Waiting for Project Manager approval          │  │
│  │     💰 Estimated Cost: $12,450/month                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**What Project Manager Sees:**
- Technical approval completed (green checkmark)
- Budget approval section with pending status
- Estimated cost displayed
- "Reject" and "Approve Budget" buttons

---

## 🎨 Color Coding Reference

### Status Badge Colors
| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Draft | Gray-100 | Gray-700 | 📝 |
| Pending Review | Yellow-100 | Yellow-700 | ⏱ |
| Approved | Green-100 | Green-700 | ✅ |
| Changes Requested | Red-100 | Red-700 | ⚠️ |
| In Progress | Blue-100 | Blue-700 | 🔄 |
| Deployed | Purple-100 | Purple-700 | 🚀 |

### Button Colors
| Button | Background | Hover | Text |
|--------|-----------|-------|------|
| Submit for Review | Blue-600 | Blue-700 | White |
| Approve | Green-600 | Green-700 | White |
| Request Changes | White | Gray-50 | Gray-700 |
| Cancel | White | Gray-50 | Gray-700 |

### Approval Panel Icons
| Status | Icon | Color |
|--------|------|-------|
| Approved | ✅ CheckCircle | Green-600 |
| Pending | ⏱ Clock | Yellow-600 |
| Rejected | ❌ XCircle | Red-600 |

---

## 📱 Responsive Behavior

### Desktop (>1024px)
- Full-width approval panel
- Side-by-side buttons
- Expanded comments

### Tablet (768px-1024px)
- Stacked approval sections
- Full-width buttons
- Truncated long comments

### Mobile (<768px)
- Single column layout
- Full-width buttons
- Collapsed approval details (expandable)

---

## ♿ Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals

### Screen Reader Support
- ARIA labels on all buttons
- Status announcements
- Form field descriptions
- Error messages

### Visual Indicators
- High contrast colors
- Clear focus states
- Icon + text labels
- Status badges with icons

---

## 🎯 User Interaction Flow

```
Engineer                Solution Architect         Project Manager
   │                           │                          │
   ├─ Generate Rec             │                          │
   ├─ Review Results           │                          │
   ├─ Submit for Review ──────>│                          │
   │                           ├─ Review Details          │
   │                           ├─ Approve/Request Changes │
   │<──────────────────────────┤                          │
   │                           │                          │
   │ (if approved & budget)    │                          │
   │                           ├─────────────────────────>│
   │                           │                          ├─ Review Cost
   │                           │                          ├─ Approve Budget
   │<──────────────────────────┴──────────────────────────┤
   │                                                       │
   ├─ Implement                                           │
   └─ Deploy                                              │
```

---

## 💡 Tips for Users

### For Engineers
- Add detailed notes when submitting for review
- Check approval status in Overview tab
- Review change requests carefully before resubmitting

### For Solution Architects
- Review all technical details before approving
- Provide constructive feedback in change requests
- Set appropriate priority levels

### For Project Managers
- Review cost estimates carefully
- Consider budget impact before approving
- Add budget-related comments for tracking

---

**Last Updated**: February 4, 2026
**Version**: 1.0
**Status**: ✅ Complete
