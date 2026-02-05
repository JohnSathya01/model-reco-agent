# 🧪 Approval Workflow - Testing Guide

## Step-by-Step Testing Instructions

This guide will walk you through testing the complete approval workflow with different user roles.

---

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Available Test Accounts

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Engineer | engineer@company.com | engineer123 | Main App (Recommendation Generator) |
| Solution Architect | architect@company.com | architect123 | Architect Dashboard |
| Project Manager | pm@company.com | pm123 | PM Dashboard |
| Admin | admin@company.com | admin123 | Admin Dashboard |
| Viewer | viewer@company.com | viewer123 | Viewer Dashboard |

---

## 📋 Test Scenario 1: Complete Approval Flow (Happy Path)

### Step 1: Create Recommendation as Engineer

1. **Login**
   - Email: `engineer@company.com`
   - Password: `engineer123`
   - Click "Sign In"

2. **Generate Recommendation**
   - Fill out the form on the left:
     - Project Description: "Image Classification Model"
     - Use Case: "Computer Vision"
     - Task Type: "Classification"
     - Deployment: "AWS"
     - Dataset Size: "100GB"
     - Budget: "$10,000/month"
   - Click "Generate Recommendation"
   - Wait for results to load

3. **Verify Draft Status**
   - ✅ Check Overview tab shows "Draft" badge (gray)
   - ✅ Check "Submit for Review" button is visible
   - ✅ Check no Approval Panel is shown yet

4. **Submit for Review**
   - Click "Submit for Review" button
   - Modal opens
   - Add notes: "Ready for technical review. All requirements validated."
   - Click "Submit for Review"
   - ✅ Verify toast: "Submitted for review! Solution Architect will be notified."
   - ✅ Verify status changes to "Pending Review" (yellow)
   - ✅ Verify Approval Panel appears
   - ✅ Check Activity Log shows "Submit for Review" entry

### Step 2: Approve as Solution Architect

1. **Logout and Login as Architect**
   - Click profile icon → Logout
   - Login with: `architect@company.com` / `architect123`
   - Navigate to: `/generate` (or click "Create New Architecture")

2. **View Pending Recommendation**
   - You should see the same recommendation
   - ✅ Verify "Pending Review" status badge (yellow)
   - ✅ Verify Approval Panel shows with action buttons
   - ✅ Verify "Request Changes" and "Approve" buttons visible

3. **Approve Recommendation**
   - Click "Approve" button (green)
   - Modal opens
   - Add comment: "Architecture looks solid. GPU selection is optimal for this workload."
   - Click "Approve"
   - ✅ Verify toast: "Recommendation approved! Team has been notified."
   - ✅ Verify status changes to "Approved" (green)
   - ✅ Verify Approval Panel shows completed approval with:
     - Green checkmark icon
     - Your name (Sarah Chen)
     - Your comment
     - Timestamp
   - ✅ Check Activity Log shows "Technical Approval" entry

### Step 3: Verify as Engineer

1. **Logout and Login as Engineer**
   - Login with: `engineer@company.com` / `engineer123`

2. **View Approved Recommendation**
   - ✅ Verify "Approved" status badge (green)
   - ✅ Verify Approval Panel shows completed approval
   - ✅ Verify no action buttons (approval complete)
   - ✅ Verify Activity Log shows complete history

---

## 📋 Test Scenario 2: Change Request Flow

### Step 1: Create and Submit Recommendation

1. **Login as Engineer**
   - Email: `engineer@company.com`
   - Password: `engineer123`

2. **Generate and Submit**
   - Generate a new recommendation
   - Submit for review

### Step 2: Request Changes as Solution Architect

1. **Login as Architect**
   - Email: `architect@company.com`
   - Password: `architect123`

2. **Request Changes**
   - View the pending recommendation
   - Click "Request Changes" button
   - Add reason: "Please consider using A100 GPUs instead of V100s for better performance with this model size."
   - Select priority: "Medium"
   - Click "Request Changes"
   - ✅ Verify toast: "Change request sent! Creator will be notified."
   - ✅ Verify status changes to "Changes Requested" (red)
   - ✅ Verify change request appears in panel with:
     - Red warning icon
     - Your name
     - Reason
     - Priority level
     - Timestamp

### Step 3: View Changes as Engineer

1. **Login as Engineer**
   - Email: `engineer@company.com`
   - Password: `engineer123`

2. **Review Change Request**
   - ✅ Verify "Changes Requested" status badge (red)
   - ✅ Verify warning message in approval panel
   - ✅ Verify change request details visible
   - ✅ Verify can make changes and resubmit

---

## 📋 Test Scenario 3: Budget Approval Flow

### Step 1: Enable Budget Approval

1. **Login as Engineer**
   - Generate recommendation
   - Submit for review

2. **Modify State (Developer Testing)**
   - In browser console, set:
   ```javascript
   // This simulates a high-cost recommendation requiring budget approval
   // In production, this would be automatic based on cost threshold
   ```

### Step 2: Technical Approval

1. **Login as Architect**
   - Approve the recommendation
   - ✅ Verify technical approval completes

### Step 3: Budget Approval

1. **Login as Project Manager**
   - Email: `pm@company.com`
   - Password: `pm123`
   - Navigate to the recommendation

2. **Review Budget**
   - ✅ Verify technical approval shows as complete (green)
   - ✅ Verify budget approval section appears
   - ✅ Verify estimated cost is displayed
   - ✅ Verify "Reject" and "Approve Budget" buttons visible

3. **Approve Budget**
   - Click "Approve Budget"
   - Add comment: "Budget approved for Q1. Proceed with implementation."
   - Click "Approve"
   - ✅ Verify toast: "Budget approved! Ready for implementation."
   - ✅ Verify budget approval shows as complete
   - ✅ Verify both approvals show green checkmarks

---

## 📋 Test Scenario 4: Role-Based Permissions

### Test 1: Engineer Cannot Approve

1. **Login as Engineer**
   - Generate and submit recommendation
   - ✅ Verify "Approve" button is NOT visible
   - ✅ Verify only "Submit for Review" button available in draft state

### Test 2: Viewer Cannot Submit

1. **Login as Viewer**
   - Email: `viewer@company.com`
   - Password: `viewer123`
   - Navigate to a recommendation
   - ✅ Verify no action buttons visible
   - ✅ Verify can only view status and details

### Test 3: Admin Has All Permissions

1. **Login as Admin**
   - Email: `admin@company.com`
   - Password: `admin123`
   - Navigate to a recommendation
   - ✅ Verify can submit for review
   - ✅ Verify can approve technical
   - ✅ Verify can approve budget
   - ✅ Verify can request changes

---

## 🔍 Visual Verification Checklist

### Status Badges
- [ ] Draft: Gray background, gray text, 📝 icon
- [ ] Pending Review: Yellow background, yellow text, ⏱ icon
- [ ] Approved: Green background, green text, ✅ icon
- [ ] Changes Requested: Red background, red text, ⚠️ icon

### Approval Panel
- [ ] Shows correct approval type (Technical/Budget)
- [ ] Displays approver name and role
- [ ] Shows approval comment
- [ ] Displays timestamp
- [ ] Icons match status (✅ approved, ⏱ pending, ❌ rejected)

### Modals
- [ ] Submit Review Modal: Blue gradient header, optional notes field
- [ ] Approve Modal: Green gradient header, optional comment field
- [ ] Request Changes Modal: Red gradient header, required reason, priority selector

### Buttons
- [ ] Submit for Review: Blue, with Send icon
- [ ] Approve: Green, prominent
- [ ] Request Changes: Gray, secondary style
- [ ] Cancel: Gray, secondary style

### Toast Notifications
- [ ] Appears in bottom-right corner
- [ ] Auto-dismisses after 3 seconds
- [ ] Shows appropriate icon (✅, 📝, etc.)
- [ ] Clear, concise message

---

## 🐛 Common Issues and Solutions

### Issue 1: Status Not Updating
**Symptom**: Status badge doesn't change after action
**Solution**: 
- Check browser console for errors
- Verify state is updating in React DevTools
- Refresh the page

### Issue 2: Buttons Not Visible
**Symptom**: Action buttons don't appear
**Solution**:
- Verify user role is correct
- Check `currentUserRole` prop is passed correctly
- Verify status matches expected state

### Issue 3: Modal Not Opening
**Symptom**: Click button but modal doesn't appear
**Solution**:
- Check browser console for errors
- Verify modal state is updating
- Check z-index conflicts

### Issue 4: Toast Not Showing
**Symptom**: Action completes but no notification
**Solution**:
- Verify `showToast` state is updating
- Check toast component is rendered
- Verify toast message is set

---

## 📊 Activity Log Verification

After each test scenario, verify the Activity Log (in Profile Modal) shows:

### For Submit for Review:
```
User Action: Submit for Review
Input Summary: [Your notes]
Recommendation Summary: Awaiting Solution Architect approval
Cost Estimate: [Estimated cost]
Export Status: pending
```

### For Approval:
```
User Action: Technical Approval
Input Summary: [Approval comment]
Recommendation Summary: Recommendation approved
Cost Estimate: [Estimated cost]
Export Status: completed
```

### For Change Request:
```
User Action: Changes Requested
Input Summary: [Change reason]
Recommendation Summary: [Approver name] requested changes (priority)
Cost Estimate: [Estimated cost]
Export Status: pending
```

---

## 🎯 Performance Testing

### Load Time
- [ ] Approval Panel renders in < 100ms
- [ ] Status badge updates immediately
- [ ] Modals open in < 50ms

### Responsiveness
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## ✅ Final Verification Checklist

### Functionality
- [ ] Can create recommendation as Engineer
- [ ] Can submit for review
- [ ] Can approve as Solution Architect
- [ ] Can request changes
- [ ] Can approve budget as Project Manager
- [ ] Status updates correctly
- [ ] Activity log records all actions
- [ ] Toast notifications appear

### UI/UX
- [ ] All colors match design
- [ ] Icons display correctly
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Modals are centered
- [ ] Responsive on all devices

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Screen reader announces status
- [ ] Focus states are visible
- [ ] Color contrast is sufficient

### Integration
- [ ] Works with existing tabs
- [ ] Doesn't break other features
- [ ] Activity log integration works
- [ ] Toast system works
- [ ] Collaboration features still work

---

## 📝 Test Report Template

```markdown
# Approval Workflow Test Report

**Date**: [Date]
**Tester**: [Your Name]
**Build**: [Build Number]

## Test Results

### Scenario 1: Complete Approval Flow
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Scenario 2: Change Request Flow
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Scenario 3: Budget Approval Flow
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Scenario 4: Role-Based Permissions
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Overall Assessment
- [ ] Ready for production
- [ ] Needs minor fixes
- [ ] Needs major fixes
```

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass**:
   - Mark feature as complete
   - Update documentation
   - Deploy to staging
   - Schedule user training

2. **If Issues Found**:
   - Document issues in detail
   - Prioritize fixes
   - Create bug tickets
   - Retest after fixes

3. **User Acceptance Testing**:
   - Share with stakeholders
   - Gather feedback
   - Make adjustments
   - Final approval

---

**Last Updated**: February 4, 2026
**Version**: 1.0
**Status**: Ready for Testing
