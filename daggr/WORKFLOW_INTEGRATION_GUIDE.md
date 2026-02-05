# Workflow Integration Guide

## Overview

We've created an integrated workflow that combines **Model Recommendations** with **Model Retraining** in a single, seamless pipeline.

## Three Workflow Options

### Option 1: Standalone Recommendations
**File:** `generate_recommendations_workflow.py`

**Purpose:** Generate model recommendations only

**Stages (5):**
1. Project Requirements Input
2. Model Selection & Scoring
3. Cost & Performance Analysis
4. Architecture Generation
5. Final Recommendations

**Use When:** You just need recommendations without retraining

**Launch:**
```bash
source daggr/venv/bin/activate
daggr daggr/generate_recommendations_workflow.py
```

---

### Option 2: Standalone Retraining
**File:** `working_retraining_workflow.py`

**Purpose:** Retrain and deploy a model

**Stages (4):**
1. Dataset Preparation
2. Training Job
3. Model Deployment
4. Inference Testing

**Use When:** You already know which model to retrain

**Launch:**
```bash
source daggr/venv/bin/activate
daggr daggr/working_retraining_workflow.py
```

---

### Option 3: Complete Integrated Workflow ⭐
**File:** `complete_ml_workflow.py`

**Purpose:** End-to-end ML pipeline from recommendations to deployment

**Stages (6):**
1. **Requirements** - Define your ML project needs
2. **Model Selection** - Get AI-recommended model
3. **Dataset Prep** - Prepare data for retraining
4. **Training** - Fine-tune the recommended model
5. **Deployment** - Deploy to production
6. **Inference** - Test the deployed model

**Use When:** You want the complete workflow

**Launch:**
```bash
source daggr/venv/bin/activate
daggr daggr/complete_ml_workflow.py
```

## How the Integration Works

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PART 1: RECOMMENDATIONS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │ Requirements │────────▶│   Model      │                     │
│  │   Input      │         │  Selection   │                     │
│  └──────────────┘         └──────┬───────┘                     │
│                                   │                              │
│                                   │ Recommended Model            │
│                                   ↓                              │
├─────────────────────────────────────────────────────────────────┤
│                    PART 2: RETRAINING                            │
├─────────────────────────────────────────────────────────────────┤
│                                   │                              │
│  ┌──────────────┐         ┌──────┴───────┐                     │
│  │   Dataset    │◀────────│   Training   │                     │
│  │ Preparation  │         │     Job      │                     │
│  └──────┬───────┘         └──────┬───────┘                     │
│         │                        │                              │
│         │                        ↓                              │
│         │                 ┌──────────────┐                     │
│         └────────────────▶│  Deployment  │                     │
│                           └──────┬───────┘                     │
│                                  │                              │
│                                  ↓                              │
│                           ┌──────────────┐                     │
│                           │  Inference   │                     │
│                           │   Testing    │                     │
│                           └──────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Integration Points

#### 1. Model Selection → Dataset Preparation
```python
# Selection node outputs recommended model
selection_node = FnNode(
    fn=select_model,
    outputs={
        "selection": gr.Textbox(...)  # Contains model name
    }
)

# Dataset node receives the selection
dataset_node = FnNode(
    fn=prepare_dataset,
    inputs={
        "selection": selection_node.selection,  # ← Connection!
        "s3_uri": gr.Textbox(...),
    },
    outputs={...}
)
```

**What Happens:**
- User runs Requirements → Selection
- Selection outputs recommended model (e.g., "Llama-3.1-8B")
- Dataset Preparation automatically receives this model
- User can then configure S3 URI and start retraining

#### 2. Automatic Parameter Passing
```python
# Requirements node captures use case type
requirements_node = FnNode(
    inputs={
        "use_case_type": gr.Radio(choices=["LLM", "CV"], ...)
    }
)

# Selection node uses it
selection_node = FnNode(
    inputs={
        "use_case_type": requirements_node.inputs["use_case_type"],
    }
)
```

**What Happens:**
- User selects "LLM" or "CV" in Requirements
- Selection automatically knows which models to recommend
- No need to re-enter the same information

## Usage Walkthrough

### Complete Workflow Example

**Step 1: Define Requirements**
```
Node: Requirements
Inputs:
  - Use Case Type: LLM
  - Task Type: Question Answering
  - Dataset Size: 10,000
  - Target Accuracy: 90%
  - Budget: Moderate

Action: Click "Run"
Output: Requirements summary
```

**Step 2: Get Model Recommendation**
```
Node: Model Selection
Inputs: (automatically receives requirements)

Action: Click "Run"
Output: 
  - Recommended: meta-llama/Llama-3.1-8B-Instruct
  - Score: 92.5/100
  - Alternatives: Mistral-7B, Flan-T5
```

**Step 3: Prepare Dataset**
```
Node: Dataset Preparation
Inputs:
  - Selection: (automatically receives recommended model)
  - S3 URI: s3://ml-datasets/llm-finetuning/medical-qa/
  - Validation Split: 0.2

Action: Click "Run"
Output: Dataset statistics (8,000 train, 2,000 val)
```

**Step 4: Start Training**
```
Node: Training Job
Inputs:
  - Dataset Info: (automatically receives from previous step)
  - Epochs: 3
  - Batch Size: 8
  - Use LoRA: ✓

Action: Click "Run"
Output: Training job started, progress metrics
```

**Step 5: Deploy Model**
```
Node: Model Deployment
Inputs:
  - Training Result: (automatically receives)
  - Instance Type: ml.g4dn.xlarge
  - Enable Autoscaling: ✓

Action: Click "Run"
Output: Endpoint URL, health status, cost estimate
```

**Step 6: Test Inference**
```
Node: Inference Testing
Inputs:
  - Deployment Info: (automatically receives)
  - Test Input: "What are the symptoms of diabetes?"
  - Temperature: 0.7

Action: Click "Run"
Output: Model response, performance metrics
```

## Advantages of Integration

### 1. Seamless Data Flow
- No manual copy-paste between workflows
- Recommended model automatically becomes base model for retraining
- Requirements inform both recommendation and training

### 2. Single Interface
- One workflow instead of switching between two
- Visual representation of entire pipeline
- Easy to see dependencies

### 3. Consistent State
- All decisions and results in one place
- Can review entire pipeline history
- Easy to experiment with variations

### 4. Reduced Errors
- Automatic parameter passing reduces mistakes
- Type checking ensures compatibility
- Visual connections show data flow

## Customization Options

### Add More Stages

You can extend the workflow by adding more nodes:

```python
# Add a validation stage
validation_node = FnNode(
    fn=validate_model,
    inputs={
        "inference_result": inference_node.inference_result,
        "test_dataset": gr.File(...)
    },
    outputs={
        "validation_metrics": gr.Textbox(...)
    }
)

# Add to graph
graph = Graph(
    name="Extended Workflow",
    nodes=[
        requirements_node,
        selection_node,
        dataset_node,
        training_node,
        deployment_node,
        inference_node,
        validation_node,  # ← New stage!
    ]
)
```

### Create Parallel Paths

You can create alternative paths:

```python
# Option A: Quick deployment
quick_deploy = FnNode(...)

# Option B: Full validation
full_validation = FnNode(...)

# Both use training result
quick_deploy.inputs["training"] = training_node.training_result
full_validation.inputs["training"] = training_node.training_result
```

### Add Conditional Logic

Use Python logic in your functions:

```python
def smart_deployment(training_result: str, accuracy: float) -> str:
    if accuracy > 95:
        return deploy_to_production(training_result)
    else:
        return deploy_to_staging(training_result)
```

## Comparison with React App

### React App Approach
```
User fills form → Submit → Backend processes → Show results

Problems:
- Can't see intermediate steps
- Must rerun everything if something fails
- Hard to experiment with variations
- No visual representation
```

### Daggr Approach
```
User configures node → Run → See output → Next node

Benefits:
✅ See each step's output
✅ Rerun individual steps
✅ Visual graph of pipeline
✅ Easy experimentation
✅ State persistence
```

## When to Use Each Workflow

| Scenario | Recommended Workflow |
|----------|---------------------|
| Just need model recommendations | `generate_recommendations_workflow.py` |
| Already know which model to retrain | `working_retraining_workflow.py` |
| Complete end-to-end pipeline | `complete_ml_workflow.py` ⭐ |
| Quick testing | `minimal_workflow.py` or `simple_test_workflow.py` |
| Production deployment | `complete_ml_workflow.py` with real implementations |

## Next Steps

1. **Try the complete workflow:**
   ```bash
   source daggr/venv/bin/activate
   daggr daggr/complete_ml_workflow.py
   ```

2. **Experiment with different inputs:**
   - Try LLM vs CV use cases
   - Adjust budget levels
   - Change training parameters

3. **Customize for your needs:**
   - Add validation stages
   - Integrate with real AWS/SageMaker
   - Add monitoring and alerts

4. **Deploy to production:**
   ```bash
   daggr deploy daggr/complete_ml_workflow.py --name ml-pipeline
   ```

## Tips for Success

1. **Run nodes sequentially** - Start from the top, work your way down
2. **Check orange connections** - Ensure data is flowing correctly
3. **Use result history** - Browse previous runs with ◀ ▶ arrows
4. **Save different configurations** - Use sheets for experiments
5. **Monitor costs** - Pay attention to cost estimates in outputs

---

**You now have a complete, integrated ML workflow from recommendations to deployment!** 🎉
