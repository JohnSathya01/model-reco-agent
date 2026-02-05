"""
Complete ML Workflow - Recommendations + Retraining Integration

This workflow combines:
1. Model Recommendation Generation (5 stages)
2. Model Retraining Pipeline (4 stages)

Users can:
- Generate model recommendations
- Use recommended model as base for retraining
- Deploy and test the retrained model
"""

import time
import gradio as gr
from daggr import FnNode, Graph


# ============================================================================
# PART 1: MODEL RECOMMENDATION WORKFLOW
# ============================================================================

# Stage 1: Project Requirements
def collect_requirements(
    use_case_type: str,
    task_type: str,
    dataset_size: int,
    target_accuracy: float,
    budget_level: str
) -> str:
    """Collect project requirements"""
    time.sleep(0.5)
    
    result = f"""✅ Requirements Collected

Use Case: {use_case_type}
Task: {task_type}
Dataset Size: {dataset_size:,} samples
Target Accuracy: {target_accuracy}%
Budget: {budget_level}

Status: Ready for model selection
"""
    return result


requirements_node = FnNode(
    fn=collect_requirements,
    inputs={
        "use_case_type": gr.Radio(
            choices=["LLM", "CV"],
            label="Use Case Type",
            value="LLM"
        ),
        "task_type": gr.Dropdown(
            choices=[
                "Question Answering",
                "Text Generation",
                "Image Classification",
                "Object Detection"
            ],
            label="Task Type",
            value="Question Answering"
        ),
        "dataset_size": gr.Slider(
            minimum=1000,
            maximum=100000,
            value=10000,
            step=1000,
            label="Dataset Size"
        ),
        "target_accuracy": gr.Slider(
            minimum=80.0,
            maximum=99.0,
            value=90.0,
            step=1.0,
            label="Target Accuracy (%)"
        ),
        "budget_level": gr.Radio(
            choices=["Low", "Moderate", "High"],
            label="Budget Level",
            value="Moderate"
        ),
    },
    outputs={
        "requirements": gr.Textbox(label="Requirements Summary", lines=12),
    },
)


# Stage 2: Model Selection
def select_model(requirements: str) -> str:
    """Select best model based on requirements"""
    time.sleep(1.0)
    
    # Extract use case type from requirements text
    use_case_type = "LLM" if "LLM" in requirements else "CV"
    
    if use_case_type == "LLM":
        models = [
            ("meta-llama/Llama-3.1-8B-Instruct", 92.5, 150, 850),
            ("mistralai/Mistral-7B-Instruct", 90.2, 120, 720),
            ("google/flan-t5-xl", 88.5, 100, 600),
        ]
    else:
        models = [
            ("ResNet-50", 94.5, 45, 400),
            ("EfficientNet-B0", 93.2, 30, 320),
            ("ViT-Base", 95.1, 60, 550),
        ]
    
    # Select top model
    top_model = models[0]
    
    result = f"""🎯 Model Selected

Recommended Model: {top_model[0]}

Performance Metrics:
• Accuracy: {top_model[1]}%
• Latency: {top_model[2]}ms
• Monthly Cost: ${top_model[3]}

Score: 92.5/100

Alternative Models:
1. {models[1][0]} (Score: 88.2)
2. {models[2][0]} (Score: 85.7)

✅ Ready for retraining configuration
"""
    return result


selection_node = FnNode(
    fn=select_model,
    inputs={
        "requirements": requirements_node.requirements,
    },
    outputs={
        "selection": gr.Textbox(label="Model Selection", lines=18),
    },
)


# ============================================================================
# PART 2: MODEL RETRAINING WORKFLOW
# ============================================================================

# Stage 3: Dataset Preparation
def prepare_dataset(
    selection: str,
    s3_uri: str,
    validation_split: float
) -> str:
    """Prepare dataset for retraining"""
    time.sleep(1.5)
    
    # Extract model name from selection
    model_name = "meta-llama/Llama-3.1-8B-Instruct"  # Simplified
    
    result = f"""📦 Dataset Prepared

S3 URI: {s3_uri}
Base Model: {model_name}

Dataset Statistics:
• Total Samples: 10,000
• Training: {int(10000 * (1 - validation_split)):,}
• Validation: {int(10000 * validation_split):,}
• Split Ratio: {int((1-validation_split)*100)}:{int(validation_split*100)}

Preprocessing Steps:
✓ Downloaded from S3
✓ Validated data format
✓ Applied train/val split
✓ Tokenization complete

Status: Ready for training
"""
    return result


dataset_node = FnNode(
    fn=prepare_dataset,
    inputs={
        "selection": selection_node.selection,
        "s3_uri": gr.Textbox(
            label="S3 Dataset URI",
            value="s3://ml-datasets/llm-finetuning/medical-qa/",
            lines=1
        ),
        "validation_split": gr.Slider(
            minimum=0.1,
            maximum=0.3,
            value=0.2,
            step=0.05,
            label="Validation Split"
        ),
    },
    outputs={
        "dataset_info": gr.Textbox(label="Dataset Information", lines=18),
    },
)


# Stage 4: Training Job
def start_training(
    dataset_info: str,
    epochs: int,
    batch_size: int,
    use_lora: bool
) -> str:
    """Start model training"""
    time.sleep(2.0)
    
    job_id = f"training-{int(time.time())}"
    
    result = f"""🚀 Training Job Started

Job ID: {job_id}
Status: Running

Configuration:
• Epochs: {epochs}
• Batch Size: {batch_size}
• Learning Rate: 2e-5
• LoRA: {'Enabled' if use_lora else 'Disabled'}

Progress:
• Current Epoch: 1/{epochs}
• Train Loss: 2.45
• Val Loss: 2.52
• Estimated Time: {epochs * 15} minutes

Hardware:
• Instance: ml.p3.2xlarge
• GPUs: 1x V100 (16GB)

✅ Training in progress...
"""
    return result


training_node = FnNode(
    fn=start_training,
    inputs={
        "dataset_info": dataset_node.dataset_info,
        "epochs": gr.Slider(
            minimum=1,
            maximum=10,
            value=3,
            step=1,
            label="Training Epochs"
        ),
        "batch_size": gr.Slider(
            minimum=4,
            maximum=32,
            value=8,
            step=4,
            label="Batch Size"
        ),
        "use_lora": gr.Checkbox(
            value=True,
            label="Use LoRA Fine-tuning"
        ),
    },
    outputs={
        "training_result": gr.Textbox(label="Training Status", lines=20),
    },
)


# Stage 5: Model Deployment
def deploy_model(
    training_result: str,
    instance_type: str,
    enable_autoscaling: bool
) -> str:
    """Deploy trained model"""
    time.sleep(1.5)
    
    endpoint_id = f"endpoint-{int(time.time())}"
    
    result = f"""🌐 Model Deployed

Endpoint: {endpoint_id}
URL: https://api.example.com/models/{endpoint_id}/predict

Configuration:
• Instance: {instance_type}
• Autoscaling: {'Enabled' if enable_autoscaling else 'Disabled'}
• Min Replicas: 1
• Max Replicas: {5 if enable_autoscaling else 1}

Status: ✅ Healthy
Health Check: Passing
Response Time: 145ms

Cost Estimate:
• Hourly: ${'0.74' if 'g4dn' in instance_type else '1.21'}
• Monthly: ${'533' if 'g4dn' in instance_type else '871'}

✅ Ready for inference
"""
    return result


deployment_node = FnNode(
    fn=deploy_model,
    inputs={
        "training_result": training_node.training_result,
        "instance_type": gr.Dropdown(
            choices=["ml.g4dn.xlarge", "ml.g5.2xlarge", "ml.p3.2xlarge"],
            value="ml.g4dn.xlarge",
            label="Instance Type"
        ),
        "enable_autoscaling": gr.Checkbox(
            value=True,
            label="Enable Autoscaling"
        ),
    },
    outputs={
        "deployment_info": gr.Textbox(label="Deployment Information", lines=20),
    },
)


# Stage 6: Inference Testing
def run_inference(
    deployment_info: str,
    test_input: str,
    temperature: float
) -> str:
    """Test the deployed model"""
    time.sleep(1.0)
    
    result = f"""🔮 Inference Result

Input Query:
"{test_input}"

Model Response:
"Based on the fine-tuned medical model, the main symptoms of diabetes 
include increased thirst, frequent urination, extreme hunger, unexplained 
weight loss, and fatigue. It's important to consult a healthcare provider 
for proper diagnosis and treatment."

Metrics:
• Tokens Generated: 87
• Inference Time: 1,234ms
• Temperature: {temperature}
• Confidence: 0.92

Performance:
✓ Latency within target
✓ Response quality: High
✓ Model health: Excellent

Status: ✅ Model performing as expected
"""
    return result


inference_node = FnNode(
    fn=run_inference,
    inputs={
        "deployment_info": deployment_node.deployment_info,
        "test_input": gr.Textbox(
            label="Test Input",
            value="What are the symptoms of diabetes?",
            lines=3
        ),
        "temperature": gr.Slider(
            minimum=0.0,
            maximum=1.0,
            value=0.7,
            step=0.1,
            label="Temperature"
        ),
    },
    outputs={
        "inference_result": gr.Textbox(label="Inference Result", lines=22),
    },
)


# ============================================================================
# Create Complete Workflow Graph
# ============================================================================

graph = Graph(
    name="Complete ML Workflow: Recommendations → Retraining → Deployment",
    nodes=[
        # Part 1: Recommendations (2 nodes)
        requirements_node,
        selection_node,
        
        # Part 2: Retraining Pipeline (4 nodes)
        dataset_node,
        training_node,
        deployment_node,
        inference_node,
    ],
)

if __name__ == "__main__":
    graph.launch()
