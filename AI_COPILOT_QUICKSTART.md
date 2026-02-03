# AI Copilot - Quick Start Guide

## 🚀 Getting Started

The AI Copilot is integrated into your application as a context-aware advisor. Here's how to use it:

## When Does the Copilot Appear?

**Important:** The AI Copilot only becomes available after you generate recommendations.

1. Fill out the project form on the left
2. Click **"Generate Recommendation"**
3. Once recommendations are generated, look for the **floating AI button** in the bottom-right corner
4. Click the button to open the copilot drawer

## Basic Usage

### 1. Ask for Suggestions
Type your question in the input box at the bottom:
- "How can I reduce costs?"
- "What are my deployment options?"
- "Can you suggest performance improvements?"
- "What about using Spot instances?"

### 2. Review Suggestions
The copilot will respond with:
- **Suggestions**: Advisory recommendations in soft language
- **Impact Summary**: Cost, latency, complexity effects with visual indicators
- **Optional Actions**: Checkboxes for changes you can apply

### 3. Select Changes to Apply
- Review each suggestion carefully
- Check the boxes for changes you want to apply
- Leave unchecked any changes you don't want

### 4. Apply or Cancel
- Click **"Apply Changes"** to implement selected changes
- Click **"Cancel"** to keep your current configuration
- The confirmation only appears when you've selected at least one change

### 5. Check Activity Log
- Applied changes appear in the Activity tab
- View timestamp, change summary, and impact
- Toast notification confirms successful application

## Example Conversations

### Cost Optimization
```
You: "How can I reduce costs without impacting latency too much?"

AI Copilot: [Provides suggestions]

I've reviewed your current configuration and have some suggestions 
for cost optimization:

One option would be to switch training to Spot instances, which 
could save approximately 60% on compute costs. The trade-off is 
that Spot instances may occasionally be interrupted, though this 
can be mitigated with checkpointing.

Another possibility is using LoRA instead of full finetuning...

[Suggestions Card]
💡 Suggestions
- One option is to change instance type from ml.p3.2xlarge to 
  ml.g4dn.xlarge (Spot)
- Another possibility is to change training strategy from Full 
  Finetuning to LoRA

[Impact Summary]
📉 Cost: ↓ 42% ($1,240 → $720/month)
📈 Latency: ↑ 15ms (acceptable range)
➖ Complexity: Low

[Optional Actions]
☐ Apply Instance Type change
☐ Apply Training Strategy change

[Select changes, then click "Apply Changes"]
```

### Deployment Change
```
You: "Can we deploy this on ECS instead of SageMaker?"

AI Copilot: [Proposes architecture change]
- Replaces SageMaker Endpoint with ECS Fargate
- Adds Application Load Balancer
- Updates API Gateway integration

Impact: -18% cost, +10ms latency, Medium complexity

[Accept Changes] [Reject]
```

### API Configuration
```
You: "Expose this as a REST API with authentication"

AI Copilot: [Designs API setup]
- Adds AWS API Gateway
- Configures API Key + IAM auth
- Sets rate limiting to 1000 req/sec
- Enables CloudWatch + X-Ray monitoring

Impact: +$50/month, +5ms latency

[Accept Changes] [Reject]
```

## Context Awareness

The copilot adapts to your current tab:

| Tab | Focus | Example Questions |
|-----|-------|-------------------|
| **Overview** | Model selection | "Switch to YOLOv8-Medium" |
| **Pipeline** | Architecture | "Change deployment to ECS" |
| **Analysis** | Costs & risks | "Reduce monthly costs" |
| **API** | Endpoints | "Add authentication" |
| **Activity** | History | "Explain this change" |

## Tips for Best Results

### ✅ Do
- Be specific about what you want to change
- Ask about trade-offs (cost vs latency)
- Review impact analysis carefully
- Use context from your current tab
- Ask follow-up questions to refine

### ❌ Don't
- Don't expect changes to apply automatically
- Don't skip reading the impact analysis
- Don't ignore complexity warnings
- Don't forget to check the Activity log

## Common Use Cases

### 1. Cost Reduction
**Questions to ask:**
- "How can I reduce training costs?"
- "Switch to Spot instances"
- "Use serverless deployment"
- "Optimize for budget"

### 2. Performance Optimization
**Questions to ask:**
- "Improve inference latency"
- "Optimize for throughput"
- "Add caching layer"
- "Use TensorRT optimization"

### 3. Architecture Changes
**Questions to ask:**
- "Deploy on ECS instead of SageMaker"
- "Add load balancer"
- "Change to multi-region deployment"
- "Add API Gateway"

### 4. Model Selection
**Questions to ask:**
- "Switch to a larger model"
- "Compare model alternatives"
- "Use a lighter model for edge deployment"
- "Optimize model size"

### 5. Infrastructure
**Questions to ask:**
- "Upgrade to newer GPU instances"
- "Change instance types"
- "Add auto-scaling"
- "Configure spot instances"

## Keyboard Shortcuts

- **Enter**: Send message
- **Esc**: Close copilot (when input is not focused)

## Visual Indicators

### Message Types
- **Blue bubbles (right)**: Your messages
- **White bubbles (left)**: AI responses
- **Blue cards**: Proposed changes
- **Yellow banner**: Confirmation prompt

### Impact Icons
- 📉 **Green down arrow**: Cost/latency reduction (good)
- 📈 **Orange up arrow**: Cost/latency increase (caution)
- ➖ **Gray dash**: Neutral impact

### Status Indicators
- **Animated dots**: AI is thinking
- **AI badge**: Copilot available
- **Context label**: Current tab awareness

## Troubleshooting

### Copilot not responding?
- Check that you've filled out the form on the left
- Make sure you've generated recommendations
- Try refreshing the page

### Changes not applying?
- Ensure you clicked "Accept Changes"
- Check the Activity tab for confirmation
- Note: Some changes are mock implementations

### Want to undo a change?
- Currently, changes are logged but not reversible
- Future versions will support rollback
- For now, manually adjust settings

## What's Next?

After using the copilot:
1. **Review Activity Log**: Check all applied changes
2. **Verify Configuration**: Ensure settings match your needs
3. **Export Configuration**: Download your optimized setup
4. **Iterate**: Continue refining with more questions

## Need Help?

The copilot can help itself! Try asking:
- "What can you help me with?"
- "Explain the current configuration"
- "What are my options for deployment?"
- "Show me cost optimization strategies"

---

**Remember**: The AI Copilot is a decision assistant, not an auto-pilot. Always review and approve changes before they're applied!
