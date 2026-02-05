"""
Model Retraining Workflow - Fixed version with simpler components
"""

import time
import gradio as gr
from daggr import FnNode, Graph


# Stage 1: Dataset Preparation
def prepare_dataset(s3_uri: str, model_type: str) -> str:
    """Prepare dataset from S3"""
    time.sleep(1)
    result = f"""Dataset Prepared Successfully!
    
S3 URI: {s3_uri}
Model Type: {model_type}
Total Samples: 10000
Train Samples: 8000
Validation Samples: 2000
Status: Ready for training
"""
    return result


dataset_prep = FnNode(
    fn=prepare_dataset,
    inputs={
        "s3_uri": gr.Textbox(
            label="S3 Dataset URI",
            value="s3://ml-datasets/llm-finetuning/medical-qa/",
            lines=1
        ),
        "model_type": gr.Radio(
            choices=["llm", "cv"],
            label="Model Type",
            value="llm"
        ),
    },
    outputs={
        "dataset_info": gr.Textbox(label="Dataset Information", lines=8),
    },
)


# Stage 2: Training Job
def start_training(dataset_info: str, base_model: str, epochs: int) -> str:
    """Start training job"""
    time.sleep(2)
    result = f"""Training Job Started!
    
Job ID: training-job-{int(time.time())}
Base Model: {base_model}
Epochs: {epochs}
Status: Running
Current Epoch: 1/3
Train Loss: 2.45
Validation Loss: 2.52
Estimated Time: {epochs * 15} minutes
"""
    return result


training_job = FnNode(
    fn=start_training,
    inputs={
        "dataset_info": dataset_prep.dataset_info,
        "base_model": gr.Textbox(
            label="Base Model",
            value="meta-llama/Llama-3.1-8B-Instruct",
            lines=1
        ),
        "epochs": gr.Slider(
            minimum=1,
            maximum=10,
            value=3,
            step=1,
            label="Training Epochs"
        ),
    },
    outputs={
        "training_result": gr.Textbox(label="Training Status", lines=10),
    },
)


# Stage 3: Model Deployment
def deploy_model(training_result: str, instance_type: str) -> str:
    """Deploy the trained model"""
    time.sleep(1)
    result = f"""Model Deployed Successfully!
    
Endpoint Name: endpoint-{int(time.time())}
Endpoint URL: https://api.example.com/models/predict
Instance Type: {instance_type}
Status: Deployed
Health: Healthy
Min Replicas: 1
Max Replicas: 5
Estimated Cost: $0.74/hour
"""
    return result


model_deployment = FnNode(
    fn=deploy_model,
    inputs={
        "training_result": training_job.training_result,
        "instance_type": gr.Dropdown(
            choices=["ml.t3.medium", "ml.g4dn.xlarge", "ml.g5.2xlarge"],
            value="ml.g4dn.xlarge",
            label="Instance Type"
        ),
    },
    outputs={
        "deployment_info": gr.Textbox(label="Deployment Information", lines=10),
    },
)


# Stage 4: Inference
def run_inference(deployment_info: str, input_text: str) -> str:
    """Run inference on deployed model"""
    time.sleep(1)
    result = f"""Inference Result:
    
Input: {input_text}

Output: Based on the fine-tuned medical model, the main symptoms include 
increased thirst, frequent urination, extreme hunger, unexplained weight 
loss, and fatigue. It's important to consult a healthcare provider for 
proper diagnosis.

Tokens Generated: 87
Inference Time: 1234ms
Model Confidence: 0.92
"""
    return result


inference = FnNode(
    fn=run_inference,
    inputs={
        "deployment_info": model_deployment.deployment_info,
        "input_text": gr.Textbox(
            label="Input Text",
            value="What are the symptoms of diabetes?",
            lines=3
        ),
    },
    outputs={
        "result": gr.Textbox(label="Inference Result", lines=12),
    },
)


# Create graph
graph = Graph(
    name="Model Retraining Workflow",
    nodes=[dataset_prep, training_job, model_deployment, inference],
)

if __name__ == "__main__":
    graph.launch()
