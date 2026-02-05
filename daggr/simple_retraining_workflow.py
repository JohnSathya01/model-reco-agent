"""
Simplified Model Retraining Workflow - 2 stages for testing
"""

import time
import gradio as gr
from daggr import FnNode, Graph


# Stage 1: Dataset Preparation
def prepare_dataset(s3_uri: str, model_type: str) -> dict:
    """Prepare dataset from S3"""
    time.sleep(1)
    return {
        "s3_uri": s3_uri,
        "model_type": model_type,
        "total_samples": 10000,
        "status": "prepared"
    }


dataset_prep = FnNode(
    fn=prepare_dataset,
    inputs={
        "s3_uri": gr.Textbox(
            label="S3 Dataset URI",
            value="s3://ml-datasets/training-data/"
        ),
        "model_type": gr.Radio(
            choices=["llm", "cv"],
            label="Model Type",
            value="llm"
        ),
    },
    outputs={
        "dataset_info": gr.JSON(label="Dataset Info"),
    },
)


# Stage 2: Training Job
def start_training(dataset_info: dict, epochs: int) -> dict:
    """Start training job"""
    time.sleep(2)
    return {
        "job_id": f"job-{int(time.time())}",
        "status": "running",
        "epochs": epochs,
        "model_type": dataset_info.get("model_type"),
        "train_loss": 2.45
    }


training_job = FnNode(
    fn=start_training,
    inputs={
        "dataset_info": dataset_prep.dataset_info,
        "epochs": gr.Slider(
            minimum=1,
            maximum=10,
            value=3,
            step=1,
            label="Epochs"
        ),
    },
    outputs={
        "training_result": gr.JSON(label="Training Result"),
    },
)


# Create graph
graph = Graph(
    name="Simple Retraining Workflow",
    nodes=[dataset_prep, training_job],
)

if __name__ == "__main__":
    graph.launch()
