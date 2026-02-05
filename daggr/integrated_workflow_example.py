"""
Integrated Workflow Example: Model Recommendations + Retraining

This example demonstrates how to integrate the model retraining workflow
with an existing model recommendation system. The workflow:

1. Generates model recommendations based on requirements
2. Monitors model performance
3. Triggers retraining when performance degrades
4. Deploys and validates the retrained model
"""

import time
import gradio as gr
from daggr import FnNode, Graph


# ============================================================================
# Existing Recommendation Workflow (Simplified)
# ============================================================================

def generate_recommendations(
    task_type: str,
    dataset_size: int,
    latency_requirement: str,
    budget: float
) -> dict:
    """Generate model recommendations based on requirements"""
    time.sleep(1)
    
    recommendations = {
        "task_type": task_type,
        "recommended_models": [
            {
                "name": "meta-llama/Llama-3.1-8B-Instruct" if task_type == "llm" else "resnet50",
                "score": 0.92,
                "estimated_cost": budget * 0.7,
                "latency_ms": 150 if latency_requirement == "low" else 50,
            },
            {
                "name": "mistralai/Mistral-7B-Instruct" if task_type == "llm" else "efficientnet-b0",
                "score": 0.88,
                "estimated_cost": budget * 0.5,
                "latency_ms": 200 if latency_requirement == "low" else 80,
            }
        ],
        "dataset_requirements": {
            "min_samples": 1000 if task_type == "llm" else 500,
            "recommended_samples": dataset_size,
        }
    }
    
    return recommendations


recommendation_engine = FnNode(
    fn=generate_recommendations,
    inputs={
        "task_type": gr.Radio(
            choices=["llm", "cv"],
            label="Task Type",
            value="llm",
            info="Type of ML task"
        ),
        "dataset_size": gr.Slider(
            minimum=100,
            maximum=100000,
            value=10000,
            step=100,
            label="Dataset Size",
            info="Number of training samples available"
        ),
        "latency_requirement": gr.Radio(
            choices=["low", "medium", "high"],
            label="Latency Requirement",
            value="medium",
            info="Inference latency requirement"
        ),
        "budget": gr.Slider(
            minimum=100,
            maximum=10000,
            value=1000,
            step=100,
            label="Monthly Budget ($)",
            info="Budget for model training and deployment"
        ),
    },
    outputs={
        "recommendations": gr.JSON(label="Model Recommendations"),
    },
)


# ============================================================================
# Model Performance Monitoring
# ============================================================================

def monitor_model_performance(
    recommendations: dict,
    current_accuracy: float,
    current_latency: float,
    error_rate: float
) -> dict:
    """Monitor deployed model performance and determine if retraining is needed"""
    time.sleep(0.5)
    
    # Define thresholds
    accuracy_threshold = 0.85
    latency_threshold = 200  # ms
    error_rate_threshold = 0.05
    
    # Check if retraining is needed
    needs_retraining = (
        current_accuracy < accuracy_threshold or
        current_latency > latency_threshold or
        error_rate > error_rate_threshold
    )
    
    performance_report = {
        "current_metrics": {
            "accuracy": current_accuracy,
            "latency_ms": current_latency,
            "error_rate": error_rate,
        },
        "thresholds": {
            "accuracy": accuracy_threshold,
            "latency_ms": latency_threshold,
            "error_rate": error_rate_threshold,
        },
        "needs_retraining": needs_retraining,
        "reasons": [],
        "recommended_action": "retrain" if needs_retraining else "continue_monitoring",
    }
    
    # Add specific reasons for retraining
    if current_accuracy < accuracy_threshold:
        performance_report["reasons"].append(
            f"Accuracy ({current_accuracy:.2%}) below threshold ({accuracy_threshold:.2%})"
        )
    if current_latency > latency_threshold:
        performance_report["reasons"].append(
            f"Latency ({current_latency}ms) above threshold ({latency_threshold}ms)"
        )
    if error_rate > error_rate_threshold:
        performance_report["reasons"].append(
            f"Error rate ({error_rate:.2%}) above threshold ({error_rate_threshold:.2%})"
        )
    
    return performance_report


performance_monitor = FnNode(
    fn=monitor_model_performance,
    inputs={
        "recommendations": recommendation_engine.recommendations,
        "current_accuracy": gr.Slider(
            minimum=0.0,
            maximum=1.0,
            value=0.82,
            step=0.01,
            label="Current Model Accuracy",
            info="Current accuracy of deployed model"
        ),
        "current_latency": gr.Slider(
            minimum=0,
            maximum=500,
            value=180,
            step=10,
            label="Current Latency (ms)",
            info="Current inference latency"
        ),
        "error_rate": gr.Slider(
            minimum=0.0,
            maximum=0.2,
            value=0.03,
            step=0.01,
            label="Error Rate",
            info="Current error rate"
        ),
    },
    outputs={
        "performance_report": gr.JSON(label="Performance Report"),
    },
)


# ============================================================================
# Retraining Decision & Configuration
# ============================================================================

def configure_retraining(
    performance_report: dict,
    recommendations: dict,
    s3_dataset_uri: str
) -> dict:
    """Configure retraining parameters based on performance issues"""
    time.sleep(0.5)
    
    if not performance_report.get("needs_retraining"):
        return {
            "status": "skipped",
            "message": "Model performance is acceptable. No retraining needed.",
        }
    
    # Extract recommended model
    top_model = recommendations["recommended_models"][0]
    task_type = recommendations["task_type"]
    
    # Configure retraining based on performance issues
    retraining_config = {
        "status": "configured",
        "trigger_reasons": performance_report["reasons"],
        "dataset": {
            "s3_uri": s3_dataset_uri,
            "model_type": task_type,
            "validation_split": 0.2,
        },
        "training": {
            "base_model": top_model["name"],
            "epochs": 5,  # More epochs if accuracy is low
            "batch_size": 8,
            "learning_rate": 2e-5,
            "use_lora": task_type == "llm",
        },
        "deployment": {
            "instance_type": "ml.g4dn.xlarge",
            "min_replicas": 1,
            "max_replicas": 5,
            "enable_autoscaling": True,
        }
    }
    
    # Adjust epochs based on accuracy gap
    accuracy_gap = 0.85 - performance_report["current_metrics"]["accuracy"]
    if accuracy_gap > 0.1:
        retraining_config["training"]["epochs"] = 10
    
    return retraining_config


retraining_config = FnNode(
    fn=configure_retraining,
    inputs={
        "performance_report": performance_monitor.performance_report,
        "recommendations": recommendation_engine.recommendations,
        "s3_dataset_uri": gr.Textbox(
            label="S3 Dataset URI for Retraining",
            value="s3://ml-datasets/llm-finetuning/medical-qa-v2/",
            info="S3 path to updated training dataset"
        ),
    },
    outputs={
        "config": gr.JSON(label="Retraining Configuration"),
    },
)


# ============================================================================
# Retraining Execution (Simplified from main workflow)
# ============================================================================

def execute_retraining(config: dict) -> dict:
    """Execute the retraining pipeline"""
    if config.get("status") == "skipped":
        return config
    
    time.sleep(3)  # Simulate training time
    
    result = {
        "status": "completed",
        "training_job_id": f"retrain-job-{int(time.time())}",
        "original_config": config,
        "results": {
            "final_accuracy": 0.91,
            "final_loss": 0.45,
            "training_time_minutes": 45,
            "improvement": "+9% accuracy",
        },
        "deployment": {
            "endpoint_url": f"https://api.example.com/models/retrain-job-{int(time.time())}/predict",
            "status": "deployed",
            "health": "healthy",
        }
    }
    
    return result


retraining_execution = FnNode(
    fn=execute_retraining,
    inputs={
        "config": retraining_config.config,
    },
    outputs={
        "result": gr.JSON(label="Retraining Result"),
    },
)


# ============================================================================
# Post-Retraining Validation
# ============================================================================

def validate_retrained_model(
    retraining_result: dict,
    test_input: str
) -> dict:
    """Validate the retrained model with test inputs"""
    if retraining_result.get("status") != "completed":
        return {
            "status": "skipped",
            "message": "No retraining was performed",
        }
    
    time.sleep(1)  # Simulate inference
    
    validation_result = {
        "status": "validated",
        "test_input": test_input,
        "prediction": "The retrained model shows improved performance. "
                     "Accuracy increased from 82% to 91%. "
                     "Ready for production deployment.",
        "metrics": {
            "accuracy": 0.91,
            "latency_ms": 145,
            "error_rate": 0.01,
        },
        "comparison": {
            "old_model_accuracy": 0.82,
            "new_model_accuracy": 0.91,
            "improvement": "+9%",
        },
        "recommendation": "Deploy to production",
    }
    
    return validation_result


model_validation = FnNode(
    fn=validate_retrained_model,
    inputs={
        "retraining_result": retraining_execution.result,
        "test_input": gr.Textbox(
            label="Test Input",
            value="What are the symptoms of diabetes?",
            lines=3,
            info="Test input to validate the retrained model"
        ),
    },
    outputs={
        "validation": gr.JSON(label="Validation Result"),
    },
)


# ============================================================================
# Create Integrated Graph
# ============================================================================

graph = Graph(
    name="Intelligent Model Recommendation with Auto-Retraining",
    nodes=[
        recommendation_engine,
        performance_monitor,
        retraining_config,
        retraining_execution,
        model_validation,
    ],
)

if __name__ == "__main__":
    graph.launch()
