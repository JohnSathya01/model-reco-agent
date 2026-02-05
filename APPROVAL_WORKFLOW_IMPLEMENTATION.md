# Approval Workflow - Phase 1 Implementation Complete

## ✅ Components Created

### 1. Type Definitions (`src/types/approval.ts`)
- `RecommendationStatus`: 6 states (draft, pending_review, approved, changes_requested, in_progress, deployed)
- `Approval`: Technical and budget approval tracking
- `ChangeRequest`: Track requested changes with priority
- `RecommendationMetadata`: Complete recommendation lifecycle data

### 2. UI Components

#### ApprovalStatusBadge (`src/components/approval/ApprovalStatusBadge.tsx`)
- Visual status indicator with icons and colors
- 3 sizes: sm, md, lg
- Color-coded by status:
  - Draft: Gray
  - Pending Review: Yellow
  - Approved: Green
  - Changes Requested: Red
  - In Progress: Blue
  - Deployed: Purple

#### ApprovalPanel (`src/components/approval/ApprovalPanel.tsx`)
- Main approval interface
- Shows technical and budget approval status
- Role-based action buttons
- Displays approver info, comments, timestamps
- Status messages for different states

#### SubmitReviewModal (`src/components/approval/SubmitReviewModal.tsx`)
- Modal for engineers to submit recommendations
- Optional notes field
- Shows who will review (Solution Architect, Project Manager)

#### RequestChangesModal (`src/components/approval/RequestChangesModal.tsx`)
- Modal for reviewers to request changes
- Required reason field
- Priority selection (low, medium, high)
- Sends feedback to original creator

#### ApproveModal (`src/components/approval/ApproveModal.tsx`)
- Modal for approving recommendations
- Supports both technical and budget approval
- Optional approval comments
- Confirmation before approval

---

## 🎯 Next Steps: Integration

### Step 1: Add Approval State to App

Update `src/App.tsx` to include approval metadata:

```typescript
const [recommendationMetadata, setRecommendationMetadata] = useState<RecommendationMetadata>({
  id: 'rec-' + Date.now(),
  title: 'ML Model Recommendation',
  status: 'draft',
  createdBy: {
    id: user?.email || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  approvals: {
    technical: null,
    budget: null
  },
  changeRequests: [],
  requiresBudgetApproval: false,
  estimatedCost: '$0'
});
```

### Step 2: Add Approval Panel to Results Dashboard

In `src/components/dashboard/ResultsDashboard.tsx`, add the approval panel:

```typescript
import { ApprovalPanel, ApprovalStatusBadge } from '../approval';

// In the Overview tab, add:
<ApprovalPanel
  metadata={recommendationMetadata}
  onApprove={handleApprove}
  onReject={handleReject}
  onRequestChanges={handleRequestChanges}
  currentUserRole={user?.role}
/>
```

### Step 3: Add Submit for Review Button

In the form or results area, add:

```typescript
import { SubmitReviewModal } from '../approval';

const [showSubmitModal, setShowSubmitModal] = useState(false);

// Button
{metadata.status === 'draft' && (
  <button
    onClick={() => setShowSubmitModal(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  >
    Submit for Review
  </button>
)}

// Modal
<SubmitReviewModal
  isOpen={showSubmitModal}
  onClose={() => setShowSubmitModal(false)}
  onSubmit={handleSubmitForReview}
  projectTitle={metadata.title}
/>
```

### Step 4: Implement Handler Functions

```typescript
const handleSubmitForReview = (notes: string) => {
  setRecommendationMetadata(prev => ({
    ...prev,
    status: 'pending_review',
    submittedAt: new Date(),
    updatedAt: new Date()
  }));
  
  // TODO: Send notification to Solution Architect
  // TODO: Save to backend
  
  setShowToast(true);
  setToastMessage('Submitted for review successfully!');
};

const handleApprove = (comment: string) => {
  const currentUser = {
    id: user?.email || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  };
  
  setRecommendationMetadata(prev => ({
    ...prev,
    status: 'approved',
    updatedAt: new Date(),
    approvals: {
      ...prev.approvals,
      technical: {
        id: 'approval-' + Date.now(),
        type: 'technical',
        approver: currentUser,
        status: 'approved',
        comment,
        timestamp: new Date()
      }
    }
  }));
  
  // TODO: Send notification to team
  // TODO: Save to backend
  
  setShowToast(true);
  setToastMessage('Recommendation approved!');
};

const handleRequestChanges = (reason: string, priority: 'low' | 'medium' | 'high') => {
  const currentUser = {
    id: user?.email || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  };
  
  setRecommendationMetadata(prev => ({
    ...prev,
    status: 'changes_requested',
    updatedAt: new Date(),
    changeRequests: [
      ...prev.changeRequests,
      {
        id: 'change-' + Date.now(),
        requestedBy: currentUser,
        reason,
        changes: [],
        priority,
        assignedTo: prev.createdBy.id,
        timestamp: new Date(),
        resolved: false
      }
    ]
  }));
  
  // TODO: Send notification to creator
  // TODO: Save to backend
  
  setShowToast(true);
  setToastMessage('Change request sent!');
};
```

### Step 5: Add Status Badge to Header

Show current status in the header or results area:

```typescript
import { ApprovalStatusBadge } from '../approval';

<div className="flex items-center space-x-3">
  <h2>ML Model Recommendation</h2>
  <ApprovalStatusBadge status={metadata.status} />
</div>
```

---

## 🎨 UI Integration Examples

### Example 1: Results Dashboard with Approval

```typescript
<ResultsDashboard>
  {/* Status Badge */}
  <div className="mb-4">
    <ApprovalStatusBadge status={metadata.status} size="lg" />
  </div>
  
  {/* Approval Panel */}
  <ApprovalPanel
    metadata={metadata}
    onApprove={() => setShowApproveModal(true)}
    onRequestChanges={() => setShowRequestChangesModal(true)}
    currentUserRole={user?.role}
  />
  
  {/* Submit Button for Engineers */}
  {metadata.status === 'draft' && user?.role === 'engineer' && (
    <button onClick={() => setShowSubmitModal(true)}>
      Submit for Review
    </button>
  )}
  
  {/* Existing recommendation content */}
  <RecommendationContent />
</ResultsDashboard>
```

### Example 2: Notification System

```typescript
// When status changes, show notifications
useEffect(() => {
  if (metadata.status === 'pending_review') {
    // Notify Solution Architect
    console.log('📧 Notification sent to Solution Architect');
  }
  if (metadata.status === 'approved') {
    // Notify team
    console.log('✅ Team notified of approval');
  }
  if (metadata.status === 'changes_requested') {
    // Notify creator
    console.log('📝 Change request sent to creator');
  }
}, [metadata.status]);
```

---

## 🔐 Role-Based Permissions

### Engineer
- ✅ Create recommendations (draft)
- ✅ Edit own drafts
- ✅ Submit for review
- ✅ View approval status
- ✅ Respond to change requests
- ❌ Cannot approve
- ❌ Cannot edit after submission

### Solution Architect
- ✅ All Engineer permissions
- ✅ Approve/reject recommendations
- ✅ Request changes
- ✅ Edit any recommendation
- ✅ View all recommendations
- ✅ Technical approval authority

### Project Manager
- ✅ View all recommendations
- ✅ Approve budgets
- ✅ View cost reports
- ✅ Add comments
- ❌ Cannot edit technical details
- ❌ Cannot approve technical aspects

### Admin
- ✅ All permissions
- ✅ Override any approval
- ✅ Delete recommendations
- ✅ Manage users

---

## 📊 Workflow States

```
┌─────────┐
│  DRAFT  │ ← Engineer creates recommendation
└────┬────┘
     │ Submit for Review
     ↓
┌──────────────────┐
│ PENDING_REVIEW   │ ← Solution Architect reviews
└────┬─────────────┘
     │
     ├─→ Approve ──→ ┌──────────┐
     │               │ APPROVED │
     │               └────┬─────┘
     │                    │
     │                    ├─→ Budget Approval (if needed)
     │                    │
     │                    ↓
     │               ┌──────────────┐
     │               │ IN_PROGRESS  │
     │               └──────┬───────┘
     │                      │
     │                      ↓
     │               ┌──────────┐
     │               │ DEPLOYED │
     │               └──────────┘
     │
     └─→ Request Changes ──→ ┌────────────────────┐
                             │ CHANGES_REQUESTED  │
                             └─────────┬──────────┘
                                       │
                                       └─→ Back to DRAFT
```

---

## 🧪 Testing Checklist

### Component Tests
- [ ] ApprovalStatusBadge renders all 6 states correctly
- [ ] ApprovalPanel shows correct buttons based on role
- [ ] SubmitReviewModal validates input
- [ ] RequestChangesModal requires reason
- [ ] ApproveModal allows optional comments

### Integration Tests
- [ ] Engineer can submit for review
- [ ] Solution Architect can approve
- [ ] Solution Architect can request changes
- [ ] Project Manager can approve budget
- [ ] Status updates correctly
- [ ] Notifications trigger on state changes

### User Flow Tests
- [ ] Complete workflow: Draft → Pending → Approved
- [ ] Change request workflow: Pending → Changes Requested → Draft
- [ ] Budget approval workflow: Approved → Budget Approved
- [ ] Role permissions enforced correctly

---

## 🚀 Deployment Checklist

- [ ] All components built successfully
- [ ] Types exported correctly
- [ ] No TypeScript errors
- [ ] Components integrated into main app
- [ ] Handler functions implemented
- [ ] State management working
- [ ] Notifications system ready
- [ ] Role-based permissions enforced
- [ ] UI/UX tested
- [ ] Documentation updated

---

## 📝 Usage Example

```typescript
import { 
  ApprovalPanel, 
  ApprovalStatusBadge,
  SubmitReviewModal,
  RequestChangesModal,
  ApproveModal
} from './components/approval';
import type { RecommendationMetadata } from './types/approval';

function RecommendationPage() {
  const [metadata, setMetadata] = useState<RecommendationMetadata>({...});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  
  return (
    <div>
      {/* Status Badge */}
      <ApprovalStatusBadge status={metadata.status} />
      
      {/* Approval Panel */}
      <ApprovalPanel
        metadata={metadata}
        onApprove={() => setShowApproveModal(true)}
        onRequestChanges={() => setShowRequestChangesModal(true)}
        currentUserRole={user?.role}
      />
      
      {/* Modals */}
      <SubmitReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmit}
        projectTitle={metadata.title}
      />
      
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
        projectTitle={metadata.title}
        approvalType="technical"
      />
      
      <RequestChangesModal
        isOpen={showRequestChangesModal}
        onClose={() => setShowRequestChangesModal(false)}
        onSubmit={handleRequestChanges}
        projectTitle={metadata.title}
      />
    </div>
  );
}
```

---

## 🎉 Phase 1 Complete!

All approval workflow components are built and ready for integration. The next step is to integrate these components into your existing App.tsx and ResultsDashboard.tsx.

**Would you like me to proceed with the integration into the existing components?**
