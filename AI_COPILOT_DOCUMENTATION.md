# AI Copilot - Context-Aware Decision Assistant

## Overview

The AI Copilot is a persistent, context-aware chatbot that exists across all tabs and acts as a decision assistant for your ML pipeline configuration. It can propose and apply changes to the live UI state upon user approval.

## Key Features

### 🧠 Context Awareness
The copilot is aware of:
- **Current Tab**: Overview / Pipeline / Analysis / API / Activity
- **User Inputs**: Project details, constraints, dataset info
- **Generated Recommendations**: Model selection, finetuning strategy
- **Pipeline State**: Architecture, deployment, training configuration

### 🔄 Change Proposal Flow

1. **User Asks a Question**
   - Example: "Can we deploy this on ECS instead of SageMaker?"

2. **Copilot Responds with Proposal**
   - Explanation of what will change and why
   - Impact analysis (cost, latency, complexity)
   - Structured list of proposed changes

3. **Confirmation Required**
   - User must explicitly accept or reject changes
   - No auto-apply functionality

4. **Apply Changes (On Accept)**
   - Updates architecture diagram
   - Modifies deployment flow
   - Updates cost estimation
   - Logs activity entry

5. **Reject Changes**
   - No UI mutation
   - Logs rejection

## Copilot Capabilities

The chatbot can help with:

### Cost Optimization
- "Reduce costs without impacting latency"
- "Switch to Spot instances"
- Suggests instance downgrades, LoRA finetuning, serverless deployment

### Deployment Changes
- "Deploy on ECS instead of SageMaker"
- "Add API Gateway with authentication"
- Modifies deployment architecture and integration patterns

### Performance Optimization
- "Improve latency"
- "Optimize for throughput"
- Suggests TensorRT optimization, dynamic batching, caching

### Model Selection
- "Switch to a different model"
- "Compare alternatives"
- Updates model selection and parameters

### Infrastructure
- "Change instance types"
- "Use newer GPU instances"
- Recommends optimal compute resources

## UI Components

### Floating Toggle Button
- Fixed position: bottom-right corner
- Gradient blue-purple background
- AI badge indicator
- Opens copilot drawer on click

### Copilot Drawer
- **Position**: Fixed right side, full height
- **Width**: 384px (24rem)
- **Sections**:
  - Header with context indicator
  - Scrollable message area
  - Sticky confirmation actions (when changes pending)
  - Input box at bottom

### Message Types
- **User Messages**: Blue background, right-aligned
- **Assistant Messages**: White background with border, left-aligned
- **Proposed Changes**: Embedded cards with structured change details
- **Typing Indicator**: Animated dots while AI is "thinking"

## Context-Aware Behavior

### Overview Tab
- Focus: Model choice, task clarity
- Suggestions: Alternative models, finetuning strategies

### Pipeline Tab
- Focus: Architecture, training, deployment
- Suggestions: Deployment changes, pipeline optimization

### Analysis Tab
- Focus: Trade-offs, risks, costs
- Suggestions: Cost reduction, risk mitigation

### API Tab
- Focus: Endpoints, payloads, SLA
- Suggestions: API configuration, authentication, rate limiting

### Activity Tab
- Focus: Audit explanation
- Suggestions: Explain past decisions, revert changes

## Example Interactions

### Example 1: Cost Reduction
**User**: "Reduce cost without impacting latency too much"

**Copilot Response**:
- Suggests instance downgrade (ml.p3.2xlarge → ml.g4dn.xlarge)
- Proposes Spot training
- Recommends LoRA instead of full finetuning
- Shows impact: -42% cost, +15ms latency

**Proposed Changes**:
```
✓ Instance Type: ml.p3.2xlarge → ml.g4dn.xlarge (Spot)
✓ Training Strategy: Full Finetuning → LoRA
✓ Deployment: SageMaker Endpoint → Serverless

Impact:
💰 Cost: -42% ($1,240 → $720/month)
⏱️ Latency: +15ms (acceptable)
🔧 Complexity: Low
```

### Example 2: Deployment Change
**User**: "Deploy on ECS instead of SageMaker"

**Copilot Response**:
- Explains ECS benefits (cost control, flexibility)
- Shows architecture flow: API Gateway → ALB → ECS Fargate
- Highlights considerations (container management, operational overhead)

**Proposed Changes**:
```
✓ Deployment Target: SageMaker Endpoint → ECS Fargate
✓ Load Balancer: None → Application Load Balancer
✓ API Gateway: Direct → API Gateway → ALB → ECS
✓ Auto-scaling: SageMaker → ECS Service Auto-scaling

Impact:
💰 Cost: -18%
⏱️ Latency: +10ms (ALB overhead)
🔧 Complexity: Medium
📈 Scalability: Improved
```

### Example 3: API Configuration
**User**: "Expose this as a REST API with authentication"

**Copilot Response**:
- Adds API Gateway with REST endpoints
- Configures API Key + IAM authentication
- Sets up rate limiting (1000 req/sec)
- Enables monitoring with X-Ray

**Proposed Changes**:
```
✓ API Gateway: None → AWS API Gateway (REST)
✓ Authentication: None → API Key + IAM
✓ Rate Limiting: None → 1000 req/sec per key
✓ Monitoring: Basic CloudWatch → API Gateway + X-Ray

Impact:
💰 Cost: +$50/month
⏱️ Latency: +5ms
🔧 Complexity: Low
```

## State Management

### Copilot State
```typescript
interface CopilotState {
  isOpen: boolean;
  messages: CopilotMessage[];
  currentContext: TabContext;
  pendingChanges: ProposedChange | null;
  conversationHistory: CopilotMessage[];
}
```

### Context Data
```typescript
interface CopilotContextData {
  activeTab: TabContext;
  formData: FormData | null;
  recommendations: RecommendationResult | null;
  activityLog: ActivityLogEntry[];
}
```

### Change Application
When user accepts changes:
1. `applyChanges()` function processes the change
2. Updates form data and recommendations (mock)
3. Creates activity log entry
4. Shows confirmation message
5. Clears pending changes

## Activity Log Integration

Each accepted change creates an entry:
```typescript
{
  id: string;
  timestamp: Date;
  userAction: 'AI Copilot Change';
  inputSummary: change.description;
  recommendationSummary: result.summary;
  costEstimate: change.impact.cost;
  exportStatus: 'completed';
}
```

## Visual Design

### Color Scheme
- **Primary**: Blue-600 to Purple-600 gradient
- **Success**: Green-600 (accept button)
- **Warning**: Yellow-50 background (confirmation area)
- **Neutral**: Gray-600 (reject button)

### Icons
- **Sparkles**: AI indicator
- **CheckCircle**: Accepted changes
- **XCircle**: Rejected changes
- **AlertCircle**: Confirmation prompt
- **TrendingDown**: Cost/latency reduction
- **TrendingUp**: Cost/latency increase
- **Minus**: Neutral impact

### Animations
- **slideInRight**: Drawer entrance (0.3s ease-out)
- **fadeIn**: Message appearance
- **bounce**: Typing indicator dots
- **pulse**: AI badge on toggle button

## Technical Implementation

### Files Created
1. `src/types/copilot.ts` - TypeScript types
2. `src/utils/copilotEngine.ts` - Mock AI logic
3. `src/components/copilot/AICopilot.tsx` - Main component
4. `src/components/copilot/index.ts` - Exports

### Files Modified
1. `src/App.tsx` - Integration and state management
2. `src/components/dashboard/ResultsDashboard.tsx` - Tab state sharing
3. `src/types/index.ts` - Export copilot types
4. `src/index.css` - Animations

### Key Functions

#### `generateCopilotResponse()`
Generates AI responses based on user input and context:
- Analyzes user message for keywords
- Determines appropriate response type
- Creates proposed changes with impact analysis
- Returns structured response

#### `applyChanges()`
Applies accepted changes to application state:
- Updates form data and recommendations
- Creates activity log entry
- Returns summary of changes

## Future Enhancements

### Optional Next-Level Features
- **Versioned Architecture Snapshots**: Save configuration versions
- **Diff Viewer**: Before/after comparison
- **Rollback**: Revert to previous state
- **Confidence Scores**: Show AI confidence per recommendation
- **Multi-Agent Copilot**: Specialized agents (Cost / Infra / ML)
- **Conversation Export**: Save chat history
- **Voice Input**: Speech-to-text for queries
- **Proactive Suggestions**: AI suggests improvements without prompting

## Usage Tips

1. **Be Specific**: Ask clear questions about what you want to change
2. **Review Carefully**: Always review proposed changes before accepting
3. **Check Impact**: Pay attention to cost, latency, and complexity impacts
4. **Use Context**: The copilot adapts to your current tab
5. **Iterate**: Reject and refine if the first suggestion isn't perfect

## Accessibility

- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Auto-focus on input when opened
- **Screen Reader**: Proper semantic HTML and ARIA attributes

## Performance

- **Lazy Loading**: Copilot only loads when opened
- **Optimized Rendering**: Messages use React keys for efficient updates
- **Debounced Typing**: Prevents excessive re-renders
- **Auto-scroll**: Smooth scroll to latest message

---

**Note**: This is a mock implementation. In production, you would integrate with a real AI backend (OpenAI, Anthropic, etc.) for intelligent responses.
