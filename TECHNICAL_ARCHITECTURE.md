# Technical Architecture - Intelligent Model Recommendation Agent

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Browser    │  │   Mobile     │  │   Desktop    │             │
│  │   (Chrome,   │  │   (Safari,   │  │   (Electron) │             │
│  │   Firefox)   │  │   Chrome)    │  │              │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                     │
│                            │                                         │
│                            │ HTTPS                                   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE HOSTING LAYER                          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  CDN (Content Delivery Network)                            │   │
│  │  - Global edge locations                                   │   │
│  │  - SSL/TLS termination                                     │   │
│  │  - DDoS protection                                         │   │
│  │  - Automatic compression                                   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Static Asset Storage                                      │   │
│  │  - HTML, CSS, JavaScript bundles                           │   │
│  │  - Images, fonts, icons                                    │   │
│  │  - Service worker (PWA support)                            │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER (React)                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                      App.tsx (Root)                          │ │
│  │  - Global state management                                   │ │
│  │  - Route handling                                            │ │
│  │  - Error boundaries                                          │ │
│  └──────────────────┬───────────────────────────────────────────┘ │
│                     │                                               │
│         ┌───────────┴───────────┐                                  │
│         │                       │                                   │
│  ┌──────▼──────┐         ┌──────▼──────┐                          │
│  │  Layout     │         │   Hooks     │                          │
│  │  Component  │         │   Layer     │                          │
│  └──────┬──────┘         └──────┬──────┘                          │
│         │                       │                                   │
│    ┌────┴────┐            ┌─────┴─────┐                           │
│    │         │            │           │                            │
│ ┌──▼───┐ ┌──▼────┐   ┌───▼────┐ ┌───▼────┐                       │
│ │Input │ │Results│   │useForm │ │useReco │                       │
│ │Form  │ │Dash   │   │State   │ │mmend   │                       │
│ └──┬───┘ └───┬───┘   └───┬────┘ └───┬────┘                       │
│    │         │           │          │                              │
│    └─────────┴───────────┴──────────┘                             │
│                     │                                               │
└─────────────────────┼───────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Recommendation Engine (utils/mockData.ts)                 │   │
│  │  - Model selection algorithm                               │   │
│  │  - Cost calculation engine                                 │   │
│  │  - Risk analysis engine                                    │   │
│  │  - Alternative model ranking                               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Pipeline Generator (utils/pipelineGenerator.ts)           │   │
│  │  - CV pipeline generation                                  │   │
│  │  - LLM pipeline generation                                 │   │
│  │  - Tool selection                                          │   │
│  │  - Compute estimation                                      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Architecture Generator (utils/architectureGenerator.ts)   │   │
│  │  - AWS architecture generation                             │   │
│  │  - Azure architecture generation                           │   │
│  │  - GCP architecture generation                             │   │
│  │  - Node and connection mapping                             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  API Spec Generator (utils/apiGenerator.ts)                │   │
│  │  - REST API specification                                  │   │
│  │  - Request/response schemas                                │   │
│  │  - SLA definitions                                         │   │
│  │  - Authentication specs                                    │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Type System (TypeScript)                                  │   │
│  │  - FormData types                                          │   │
│  │  - RecommendationResult types                              │   │
│  │  - Architecture types                                      │   │
│  │  - API specification types                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Validation Layer (Zod)                                    │   │
│  │  - Schema validation                                       │   │
│  │  - Type inference                                          │   │
│  │  - Error handling                                          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Local Storage (Browser)                                   │   │
│  │  - Form state persistence                                  │   │
│  │  - Activity log                                            │   │
│  │  - User preferences                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Actions                                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   InputForm          │
              │   Component          │
              └──────────┬───────────┘
                         │
                         │ onSubmit(formData)
                         ▼
              ┌──────────────────────┐
              │   App Component      │
              │   handleFormSubmit() │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌────────────┐ ┌────────────────┐
│ generatePipeline│ │setFormData│ │ addActivityLog │
└────────┬───────┘ └────────────┘ └────────────────┘
         │
         │ pipeline
         ▼
┌────────────────────────┐
│ generateRecommendations│
│ (useRecommendations)   │
└────────┬───────────────┘
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────┐ ┌────────────┐
│ Model Selection│ │ Architecture   │ │ API Spec   │ │ Cost       │
│ Algorithm      │ │ Generation     │ │ Generation │ │ Calculation│
└────────┬───────┘ └────────┬───────┘ └──────┬─────┘ └──────┬─────┘
         │                  │                 │              │
         └──────────────────┴─────────────────┴──────────────┘
                            │
                            │ RecommendationResult
                            ▼
                 ┌──────────────────────┐
                 │  setRecommendations  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  ResultsDashboard    │
                 │  Component           │
                 └──────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│  ModelCard     │ │  Architecture  │ │  CostBreakdown │
│  Component     │ │  Visualization │ │  Component     │
└────────────────┘ └────────────────┘ └────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INPUT PHASE                                  │
└─────────────────────────────────────────────────────────────────────┘

User Input → Form Validation → State Update
     │              │                │
     │              │                └─→ formData state
     │              │
     │              └─→ Zod Schema Validation
     │                  - Type checking
     │                  - Required fields
     │                  - Range validation
     │
     └─→ Form Fields:
         - Project Description (text)
         - Use Case Type (CV/LLM)
         - Task Type (dropdown)
         - Deployment Platform (dropdown)
         - Dataset Info (conditional)
         - Constraints (sliders/inputs)
         - Cost Simulation (inputs)

┌─────────────────────────────────────────────────────────────────────┐
│                      PROCESSING PHASE                                │
└─────────────────────────────────────────────────────────────────────┘

formData
   │
   ├─→ Pipeline Generator
   │   │
   │   ├─→ Detect Use Case (CV/LLM)
   │   ├─→ Select Pipeline Template
   │   ├─→ Generate Steps
   │   │   - Data Ingestion
   │   │   - Preprocessing
   │   │   - Model Selection
   │   │   - Training
   │   │   - Evaluation
   │   │   - Deployment
   │   │   - Monitoring
   │   │
   │   └─→ Assign Resources
   │       - Tools
   │       - Compute needs
   │       - Risk notes
   │
   ├─→ Recommendation Engine
   │   │
   │   ├─→ Model Selection
   │   │   - Analyze use case
   │   │   - Check constraints
   │   │   - Match model database
   │   │   - Rank alternatives
   │   │
   │   ├─→ Fine-tuning Strategy
   │   │   - Dataset size check
   │   │   - Budget analysis
   │   │   - Select approach (Full/LoRA/Adapters)
   │   │   - Generate hyperparameters
   │   │
   │   ├─→ Compute Estimation
   │   │   - Calculate GPU requirements
   │   │   - Estimate training time
   │   │   - Estimate inference capacity
   │   │
   │   └─→ Risk Analysis
   │       - Accuracy risk
   │       - Cost risk
   │       - Latency risk
   │       - Scalability risk
   │       - Maintenance risk
   │
   ├─→ Architecture Generator
   │   │
   │   ├─→ Platform Selection (AWS/Azure/GCP)
   │   ├─→ Deployment Type (Cloud/Edge/Hybrid)
   │   ├─→ Inference Type (Realtime/Batch/Streaming)
   │   │
   │   └─→ Generate Architecture
   │       - Nodes (services, data, models, APIs)
   │       - Connections (data flow)
   │       - Instance types
   │       - Cost estimates
   │       - Security notes
   │
   ├─→ API Spec Generator
   │   │
   │   ├─→ Endpoint Definition
   │   │   - /predict (CV)
   │   │   - /completions (LLM)
   │   │   - /batch-predict
   │   │   - /health
   │   │
   │   ├─→ Schema Generation
   │   │   - Request schemas
   │   │   - Response schemas
   │   │   - Examples
   │   │
   │   └─→ SLA Definition
   │       - Latency targets
   │       - Availability
   │       - Throughput
   │
   └─→ Cost Calculator
       │
       ├─→ Training Cost
       │   = hours × instance_rate × gpu_count
       │
       ├─→ Inference Cost
       │   = hours × instance_rate × instance_count × 30
       │
       ├─→ Storage Cost
       │   = size_gb × storage_rate
       │
       ├─→ Data Transfer Cost
       │   = transfer_gb × transfer_rate
       │
       └─→ Total Monthly Cost
           = training + inference + storage + transfer

┌─────────────────────────────────────────────────────────────────────┐
│                         OUTPUT PHASE                                 │
└─────────────────────────────────────────────────────────────────────┘

RecommendationResult
   │
   ├─→ Model Card
   │   - Recommended model
   │   - Rationale
   │   - Tags
   │   - Alternatives
   │
   ├─→ Architecture Visualization
   │   - Interactive diagram (ReactFlow)
   │   - Node details
   │   - Connection flows
   │   - Cost per component
   │
   ├─→ Cost Breakdown
   │   - Pie chart
   │   - Monthly/Annual projections
   │   - Breakdown by category
   │   - Savings suggestions
   │
   ├─→ API Documentation
   │   - Endpoint list
   │   - Request/Response examples
   │   - Authentication details
   │   - Rate limits
   │
   ├─→ Risk Analysis
   │   - Risk scores (0-100)
   │   - Risk notes
   │   - Mitigation strategies
   │
   └─→ Export Options
       - JSON download
       - PDF report (future)
       - Terraform/CloudFormation (future)
```

## State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      React State Tree                                │
└─────────────────────────────────────────────────────────────────────┘

App Component (Root State)
│
├─ formData: FormData
│  ├─ projectDescription
│  │  ├─ description: string
│  │  └─ generatedPipeline: PipelineStep[]
│  ├─ projectDetails
│  │  ├─ useCaseType: 'CV' | 'LLM'
│  │  ├─ taskType: string
│  │  └─ deploymentPlatform: string
│  ├─ dataset: DatasetInfo
│  │  ├─ size: number
│  │  ├─ format: string
│  │  └─ labelQuality: string
│  ├─ constraints: Constraints
│  │  ├─ budgetLevel: string
│  │  ├─ latencyRequirement: number
│  │  └─ targetAccuracy: number
│  └─ costSimulation: CostSimulation
│     ├─ trainingHoursPerMonth: number
│     ├─ inferenceHoursPerDay: number
│     └─ requestsPerSecond: number
│
├─ recommendations: RecommendationResult | null
│  ├─ recommendedModel: ModelRecommendation
│  ├─ alternatives: AlternativeModel[]
│  ├─ finetuningStrategy: FinetuningStrategy
│  ├─ computeEstimate: ComputeEstimate
│  ├─ rationale: DecisionRationale
│  ├─ architecture: ArchitectureRecommendation
│  ├─ riskAnalysis: RiskAnalysis
│  ├─ costBreakdown: CostBreakdown
│  ├─ architecturePipeline: ArchitecturePipeline
│  └─ apiSpecification: APISpecification
│
├─ loading: boolean
├─ error: string | null
└─ activityLog: ActivityLogEntry[]
   └─ [
       {
         id: string,
         timestamp: Date,
         userAction: string,
         inputSummary: string,
         recommendationSummary: string,
         costEstimate: string,
         exportStatus: 'pending' | 'completed' | 'failed'
       }
     ]

┌─────────────────────────────────────────────────────────────────────┐
│                      State Update Flow                               │
└─────────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
Event Handler (e.g., handleFormSubmit)
    │
    ├─→ setFormData(newData)
    │   └─→ Triggers re-render of InputForm
    │
    ├─→ setLoading(true)
    │   └─→ Shows loading spinner
    │
    ├─→ generateRecommendations(formData)
    │   │
    │   ├─→ Async processing
    │   │   └─→ Business logic execution
    │   │
    │   └─→ setRecommendations(result)
    │       └─→ Triggers re-render of ResultsDashboard
    │
    ├─→ setActivityLog([newEntry, ...prev])
    │   └─→ Updates activity log
    │
    └─→ setLoading(false)
        └─→ Hides loading spinner
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Security Layers                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Layer 1: Transport Security                                         │
│  - HTTPS/TLS 1.3                                                    │
│  - Certificate management (Firebase)                                 │
│  - HSTS headers                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 2: CDN Security                                              │
│  - DDoS protection                                                  │
│  - Rate limiting                                                    │
│  - Geographic restrictions (optional)                               │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 3: Application Security                                      │
│  - Input validation (Zod schemas)                                   │
│  - XSS protection (React escaping)                                  │
│  - CSRF protection                                                  │
│  - Content Security Policy                                          │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 4: Data Security                                             │
│  - Client-side validation                                           │
│  - Type safety (TypeScript)                                         │
│  - Local storage encryption (future)                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CI/CD Pipeline                                  │
└─────────────────────────────────────────────────────────────────────┘

Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    │ Webhook trigger
    ▼
GitHub Actions
    │
    ├─→ Pull Request Workflow
    │   ├─ Checkout code
    │   ├─ Install dependencies (npm ci)
    │   ├─ Run linter (ESLint)
    │   ├─ Type check (TypeScript)
    │   ├─ Build (npm run build)
    │   └─ Deploy to preview channel
    │       └─→ Firebase Hosting Preview
    │           └─→ https://model-reco-agent--pr-123.web.app
    │
    └─→ Production Workflow (on merge to prod)
        ├─ Checkout code
        ├─ Install dependencies (npm ci)
        ├─ Run tests (future)
        ├─ Build production bundle
        │   ├─ TypeScript compilation
        │   ├─ Vite bundling
        │   ├─ Code splitting
        │   ├─ Minification
        │   └─ Asset optimization
        │
        └─ Deploy to Firebase Hosting
            │
            ├─→ Upload to Firebase CDN
            │   └─→ Global edge locations
            │
            └─→ Live at https://model-reco-agent.web.app
                └─→ Automatic SSL
                └─→ HTTP/2 support
                └─→ Compression enabled

┌─────────────────────────────────────────────────────────────────────┐
│                      Production Infrastructure                       │
└─────────────────────────────────────────────────────────────────────┘

Firebase Hosting
    │
    ├─→ CDN Edge Locations (Global)
    │   ├─ North America
    │   ├─ Europe
    │   ├─ Asia Pacific
    │   └─ Other regions
    │
    ├─→ Static Asset Storage
    │   ├─ HTML files
    │   ├─ JavaScript bundles
    │   ├─ CSS files
    │   ├─ Images
    │   └─ Fonts
    │
    └─→ Configuration
        ├─ Rewrites (SPA routing)
        ├─ Headers (security, caching)
        ├─ Redirects
        └─ Custom domain (optional)
```

## Performance Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Performance Optimization                        │
└─────────────────────────────────────────────────────────────────────┘

Build Time Optimizations
    │
    ├─→ Code Splitting
    │   ├─ Route-based splitting
    │   ├─ Component lazy loading
    │   └─ Vendor bundle separation
    │
    ├─→ Tree Shaking
    │   └─ Remove unused code
    │
    ├─→ Minification
    │   ├─ JavaScript (Terser)
    │   ├─ CSS (cssnano)
    │   └─ HTML
    │
    └─→ Asset Optimization
        ├─ Image compression
        ├─ Font subsetting
        └─ SVG optimization

Runtime Optimizations
    │
    ├─→ React Optimizations
    │   ├─ React.memo (prevent re-renders)
    │   ├─ useMemo (expensive calculations)
    │   ├─ useCallback (function memoization)
    │   └─ Virtual DOM diffing
    │
    ├─→ Lazy Loading
    │   ├─ Component lazy loading
    │   ├─ Image lazy loading
    │   └─ Route lazy loading
    │
    └─→ Caching Strategy
        ├─ Browser cache (static assets)
        ├─ Service worker (future PWA)
        └─ Local storage (form state)

Network Optimizations
    │
    ├─→ CDN Delivery
    │   ├─ Edge caching
    │   ├─ Geographic proximity
    │   └─ HTTP/2 multiplexing
    │
    ├─→ Compression
    │   ├─ Gzip
    │   └─ Brotli
    │
    └─→ Resource Hints
        ├─ Preconnect
        ├─ Prefetch
        └─ Preload
```

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026
