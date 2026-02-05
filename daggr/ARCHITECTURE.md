# Model Retraining Workflow - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Daggr Canvas)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Node 1  │→ │  Node 2  │→ │  Node 3  │→ │  Node 4  │               │
│  │ Dataset  │  │ Training │  │  Deploy  │  │ Inference│               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         DAGGR WORKFLOW ENGINE                            │
│  • Node execution management                                            │
│  • State persistence                                                    │
│  • Result caching                                                       │
│  • Dependency resolution                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW FUNCTIONS                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │ prepare_dataset  │  │start_training_job│  │  deploy_model    │     │
│  │                  │  │                  │  │                  │     │
│  │ • S3 download    │  │ • Configure job  │  │ • Create endpoint│     │
│  │ • Validation     │  │ • Start training │  │ • Setup scaling  │     │
│  │ • Preprocessing  │  │ • Monitor metrics│  │ • Health checks  │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                          │
│  ┌──────────────────┐                                                   │
│  │  run_inference   │                                                   │
│  │                  │                                                   │
│  │ • Call endpoint  │                                                   │
│  │ • Format input   │                                                   │
│  │ • Parse output   │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLOUD INFRASTRUCTURE                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │   Amazon S3      │  │   SageMaker      │  │   EC2/Lambda     │     │
│  │                  │  │                  │  │                  │     │
│  │ • Dataset storage│  │ • Training jobs  │  │ • Inference      │     │
│  │ • Model artifacts│  │ • Hyperparameter │  │ • Autoscaling    │     │
│  │ • Checkpoints    │  │   tuning         │  │ • Load balancing │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Standalone Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  USER INPUT                                                              │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ • S3 URI: s3://bucket/dataset/                             │         │
│  │ • Model Type: LLM or CV                                    │         │
│  │ • Validation Split: 0.2                                    │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 1: DATASET PREPARATION                                           │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Output: dataset_info                                       │         │
│  │ {                                                          │         │
│  │   "s3_uri": "s3://...",                                   │         │
│  │   "total_samples": 10000,                                 │         │
│  │   "train_samples": 8000,                                  │         │
│  │   "validation_samples": 2000,                             │         │
│  │   "status": "prepared"                                    │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 2: TRAINING JOB                                                  │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Input: dataset_info + hyperparameters                      │         │
│  │ Output: training_config                                    │         │
│  │ {                                                          │         │
│  │   "job_id": "training-job-123",                           │         │
│  │   "status": "running",                                    │         │
│  │   "metrics": {                                            │         │
│  │     "train_loss": 2.45,                                   │         │
│  │     "validation_loss": 2.52                               │         │
│  │   }                                                        │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 3: MODEL DEPLOYMENT                                              │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Input: training_config + infrastructure settings           │         │
│  │ Output: deployment_info                                    │         │
│  │ {                                                          │         │
│  │   "endpoint_name": "endpoint-123",                        │         │
│  │   "endpoint_url": "https://api.../predict",              │         │
│  │   "status": "deployed",                                   │         │
│  │   "health_status": "healthy"                              │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 4: INFERENCE                                                     │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Input: deployment_info + user input (text/image)           │         │
│  │ Output: predictions                                        │         │
│  │ {                                                          │         │
│  │   "output": "Generated text..." (LLM)                     │         │
│  │   OR                                                       │         │
│  │   "predictions": [                                        │         │
│  │     {"class": "cat", "confidence": 0.92}                 │         │
│  │   ] (CV)                                                  │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Integrated Workflow with Performance Monitoring

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  STAGE 1: GENERATE RECOMMENDATIONS                                      │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Input: Task type, dataset size, latency, budget            │         │
│  │ Output: Recommended models with scores                     │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 2: MONITOR PERFORMANCE                                           │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Input: Current metrics (accuracy, latency, error rate)     │         │
│  │ Output: Performance report + retraining trigger            │         │
│  │                                                            │         │
│  │ IF accuracy < 0.85 OR latency > 200ms OR error_rate > 5%: │         │
│  │   → needs_retraining = TRUE                               │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 3: CONFIGURE RETRAINING                                          │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ IF needs_retraining:                                       │         │
│  │   • Select top recommended model as base                   │         │
│  │   • Adjust epochs based on accuracy gap                    │         │
│  │   • Configure infrastructure                               │         │
│  │ ELSE:                                                      │         │
│  │   • Skip retraining                                        │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 4: EXECUTE RETRAINING                                            │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ Run complete training pipeline:                            │         │
│  │ • Dataset preparation                                      │         │
│  │ • Training job                                             │         │
│  │ • Model deployment                                         │         │
│  └────────────────────────────────────────────────────────────┘         │
│                              ↓                                           │
│  STAGE 5: VALIDATE RETRAINED MODEL                                      │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ • Run test inference                                       │         │
│  │ • Compare old vs new metrics                              │         │
│  │ • Generate improvement report                              │         │
│  │ • Recommend production deployment                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Interactions

### Node Communication

```
┌──────────────┐
│   Node A     │
│              │
│ Outputs:     │
│ • output_1   │───┐
│ • output_2   │   │
└──────────────┘   │
                   │  Edge (data flow)
                   │
                   ↓
┌──────────────┐   │
│   Node B     │   │
│              │   │
│ Inputs:      │←──┘
│ • input_1 ───────── Connected to Node A's output_1
│ • input_2 ────────── User input (Gradio component)
│ • input_3 ────────── Fixed value
└──────────────┘
```

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      DAGGR STATE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sheet 1: "Medical LLM Training"                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Input values for all nodes                       │     │
│  │ • Cached results (with timestamps)                 │     │
│  │ • Canvas position (zoom, pan)                      │     │
│  │ • Result history per node                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Sheet 2: "Image Classification"                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Different input values                           │     │
│  │ • Independent cached results                       │     │
│  │ • Separate canvas state                            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    Persisted to
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              ~/.cache/huggingface/daggr/                     │
│                   sessions.db                                │
└─────────────────────────────────────────────────────────────┘
```

## Execution Flow

### Sequential Execution

```
Time →

Node 1: ████████ (2s)
                 ↓
Node 2:          ████████████ (3s)
                              ↓
Node 3:                       ████████ (2s)
                                       ↓
Node 4:                                ██████ (1.5s)

Total: 8.5 seconds
```

### Parallel Execution (when possible)

```
Time →

Node 1: ████████ (2s)
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
Node 2: ████████████      Node 3: ████████
        (3s)                      (2s)
        ↓                         ↓
        └────────┬────────────────┘
                 ↓
Node 4:          ██████ (1.5s)

Total: 6.5 seconds (25% faster!)
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  • Gradio UI Components                                     │
│  • Daggr Canvas Visualization                               │
│  • Interactive Node Cards                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  • Daggr Workflow Engine                                    │
│  • FnNode (Python functions)                                │
│  • GradioNode (Gradio Spaces)                               │
│  • InferenceNode (HF models)                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  • Dataset preparation logic                                │
│  • Training configuration                                   │
│  • Deployment management                                    │
│  • Inference handling                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                      │
│  • AWS S3 (storage)                                         │
│  • SageMaker (training)                                     │
│  • EC2/Lambda (inference)                                   │
│  • CloudWatch (monitoring)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Instance 1       Instance 2       Instance 3
   (ml.g4dn)        (ml.g4dn)        (ml.g4dn)
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                  Shared Storage
                    (S3, EFS)
```

### Autoscaling Rules

```
┌─────────────────────────────────────────────────────────────┐
│  IF requests_per_second > 100:                              │
│    → Scale up (add instance)                                │
│                                                              │
│  IF requests_per_second < 20 AND instances > min_replicas:  │
│    → Scale down (remove instance)                           │
│                                                              │
│  IF cpu_utilization > 80%:                                  │
│    → Scale up                                               │
│                                                              │
│  IF memory_utilization > 85%:                               │
│    → Scale up                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER ACCESS                             │
│  • Authentication (HF token)                                │
│  • Authorization (IAM roles)                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    NETWORK SECURITY                          │
│  • VPC isolation                                            │
│  • Security groups                                          │
│  • HTTPS/TLS encryption                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA SECURITY                             │
│  • S3 encryption at rest                                    │
│  • Encryption in transit                                    │
│  • Access logging                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    COMPLIANCE                                │
│  • Audit trails                                             │
│  • Data retention policies                                  │
│  • GDPR/HIPAA compliance                                    │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                      METRICS                                 │
│  • Training loss/accuracy                                   │
│  • Inference latency                                        │
│  • Request throughput                                       │
│  • Error rates                                              │
│  • Cost per request                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      LOGGING                                 │
│  • Application logs                                         │
│  • Training logs                                            │
│  • Inference logs                                           │
│  • Error logs                                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      ALERTING                                │
│  • Performance degradation                                  │
│  • Error rate spikes                                        │
│  • Cost overruns                                            │
│  • Resource exhaustion                                      │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Local Machine
  ↓
Daggr Dev Server (localhost:7860)
  ↓
Mock implementations
```

### Staging
```
HF Spaces (CPU)
  ↓
Daggr Server
  ↓
AWS Staging Environment
  ↓
Mock + Real implementations
```

### Production
```
HF Spaces (GPU) or Custom Server
  ↓
Daggr Server (production mode)
  ↓
AWS Production Environment
  ↓
Full implementations + monitoring
```

---

This architecture supports:
- ✅ Scalability (horizontal and vertical)
- ✅ Reliability (autoscaling, health checks)
- ✅ Security (encryption, IAM, VPC)
- ✅ Observability (metrics, logs, alerts)
- ✅ Cost optimization (autoscaling, spot instances)
