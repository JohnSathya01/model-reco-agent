# Intelligent Model & Finetuning Strategy Recommendation Agent

An AI-powered application that helps you select the optimal machine learning model, finetuning strategy, and deployment architecture for your specific use case.

## 🌟 Features

### Core Functionality
- **Smart Model Recommendations**: Get AI-driven suggestions for the best ML models based on your requirements
- **Finetuning Strategy**: Receive tailored finetuning approaches (Full Finetuning, LoRA, Adapters)
- **Cost Estimation**: Detailed compute cost analysis for training and inference
- **Architecture Pipeline**: Visual ML pipeline with deployment recommendations
- **Risk Analysis**: Comprehensive risk assessment across multiple dimensions
- **API Specification**: Auto-generated API definitions for your ML service
- **Activity Tracking**: Complete audit log of all decisions and changes

### 🤖 AI Copilot (NEW!)
A persistent, context-aware chatbot that acts as your ML solution architect:

- **Context Awareness**: Understands your current tab, inputs, and recommendations
- **Decision Assistant**: Proposes changes with detailed impact analysis
- **Change Management**: Never auto-applies changes - always requires your approval
- **Cost Optimization**: Suggests ways to reduce costs while maintaining performance
- **Deployment Strategies**: Recommends optimal deployment architectures
- **Performance Tuning**: Helps optimize latency and throughput
- **Activity Integration**: All changes are logged for audit trail

[Learn more about AI Copilot →](./AI_COPILOT_QUICKSTART.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

### AI Copilot
- [Quick Start Guide](./AI_COPILOT_QUICKSTART.md) - Get started with the AI Copilot
- [Full Documentation](./AI_COPILOT_DOCUMENTATION.md) - Comprehensive feature documentation
- [UI Guide](./AI_COPILOT_UI_GUIDE.md) - Visual design reference
- [Implementation Summary](./AI_COPILOT_IMPLEMENTATION_SUMMARY.md) - Technical details

### Project Documentation
- [Project Overview](./PROJECT_DOCUMENTATION.md)
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [Solution Requirements](./SOLUTION_REQUIREMENTS.md)

## 🎯 Use Cases

### Computer Vision (CV)
- Image Classification
- Object Detection
- Image Segmentation
- Custom vision tasks

### Large Language Models (LLM)
- Chat applications
- Text summarization
- Information extraction
- RAG (Retrieval-Augmented Generation)
- Complex reasoning tasks

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Type Safety**: Full TypeScript coverage

### Project Structure
```
src/
├── components/
│   ├── copilot/          # AI Copilot chatbot
│   ├── dashboard/        # Results dashboard & tabs
│   ├── forms/            # Input forms
│   ├── layout/           # Layout components
│   ├── pipeline/         # Pipeline visualization
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Utility functions & generators
└── index.css             # Global styles
```

## 🎨 Features by Tab

### Overview Tab
- Recommended model card
- Alternative models comparison
- Finetuning strategy details
- Cost estimation
- Decision rationale
- Configuration export

### Pipeline Tab
- Visual ML pipeline diagram
- Stage-by-stage breakdown
- Deployment architecture
- Training workflow
- Inference flow

### Analysis Tab
- Architecture recommendations
- Risk analysis dashboard
- Detailed cost breakdown
- Instance recommendations
- Scalability assessment

### API Tab
- REST API specification
- Endpoint definitions
- Request/response schemas
- Authentication setup
- Integration examples

### Activity Tab
- Complete audit log
- Timestamp tracking
- Change history
- Export status
- User actions

## 🤖 Using the AI Copilot

### Opening the Copilot
1. Click the floating AI button in the bottom-right corner
2. The copilot drawer slides in from the right
3. Start asking questions!

### Example Questions
- "Reduce costs without impacting latency"
- "Deploy on ECS instead of SageMaker"
- "Add API Gateway with authentication"
- "Switch to Spot instances for training"
- "Improve inference latency"
- "Upgrade to newer GPU instances"

### Change Approval Flow
1. Ask a question
2. Review the AI's proposal and impact analysis
3. Click "Accept Changes" or "Reject"
4. Check the Activity tab for confirmation

[See more examples →](./AI_COPILOT_QUICKSTART.md)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR

# Building
npm run build            # Type check + production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

### Environment Setup

This project uses:
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling

### Adding New Features

1. Create components in `src/components/`
2. Add types in `src/types/`
3. Add utilities in `src/utils/`
4. Update documentation

## 🎨 Customization

### Styling
- Tailwind configuration: `tailwind.config.js`
- Global styles: `src/index.css`
- Component styles: Inline Tailwind classes

### AI Copilot Responses
- Edit `src/utils/copilotEngine.ts` to customize AI responses
- Add new response handlers for different query types
- Modify impact analysis calculations

### Form Options
- Update `src/types/forms.ts` for new options
- Modify `src/components/forms/` for UI changes

## 📊 Mock Data

This application uses mock data and logic for demonstration purposes:
- AI responses are generated client-side
- No backend API required
- All recommendations are simulated
- Cost estimates are illustrative

For production use, integrate with:
- Real AI services (OpenAI, Anthropic, etc.)
- Cloud provider APIs (AWS, Azure, GCP)
- Cost calculation services
- Model registry APIs

## 🔒 Security

- No external API calls in current implementation
- All data stays client-side
- No sensitive information stored
- User approval required for all changes

## 🚀 Deployment

### Firebase Hosting (Configured)
```bash
npm run build
firebase deploy
```

### Other Platforms
The built files in `dist/` can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 📝 License

This project is provided as-is for demonstration purposes.

## 🤝 Contributing

This is a demonstration project. For production use:
1. Integrate real AI backend
2. Add authentication
3. Implement data persistence
4. Add comprehensive testing
5. Set up CI/CD pipeline

## 📞 Support

For questions or issues:
1. Check the [documentation](./AI_COPILOT_DOCUMENTATION.md)
2. Review [example interactions](./AI_COPILOT_QUICKSTART.md)
3. Examine the [implementation details](./AI_COPILOT_IMPLEMENTATION_SUMMARY.md)

## 🎉 Acknowledgments

Built with:
- React + TypeScript + Vite
- Tailwind CSS
- Lucide Icons
- Modern web development best practices

---

**Ready to optimize your ML pipeline?** Start the dev server and open the AI Copilot! 🚀
