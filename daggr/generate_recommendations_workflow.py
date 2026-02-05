"""
Generate Recommendations Workflow - Daggr Version

This workflow mirrors the existing React app's recommendation generation logic
but provides a visual, interactive Daggr interface for exploring the recommendation
process step-by-step.

Stages:
1. Project Requirements Input
2. Model Selection & Scoring
3. Cost & Performance Analysis
4. Architecture Generation
5. Final Recommendations
"""

import time
import json
from typing import Literal
import gradio as gr

from daggr import FnNode, Graph


# ============================================================================
# Stage 1: Project Requirements Input
# ============================================================================

def collect_project_requirements(
    use_case_type: Literal["LLM", "CV"],
    task_type: str,
    deployment_platform: str,
    dataset_size: int,
    target_accuracy: float,
    latency_requirement: int,
    budget_level: Literal["Low", "Moderate", "High"]
) -> dict:
    """
    Collect and validate project requirements.
    This mirrors the form data collection in the React app.
    """
    time.sleep(0.5)
    
    requirements = {
        "project_details": {
            "use_case_type": use_case_type,
            "task_type": task_type,
            "deployment_platform": deployment_platform,
        },
        "dataset": {
            "size": dataset_size,
            "estimated_samples": dataset_size,
        },
        "constraints": {
            "target_accuracy": target_accuracy,
            "latency_requirement": latency_requirement,
            "budget_level": budget_level,
            "memory_limit": 16 if budget_level == "Low" else 32 if budget_level == "Moderate" else 64,
        },
        "status": "validated",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    
    return requirements


project_requirements = FnNode(
    fn=collect_project_requirements,
    inputs={
        "use_case_type": gr.Radio(
            choices=["LLM", "CV"],
            label="Use Case Type",
            value="LLM",
            info="Select the type of ML task"
        ),
        "task_type": gr.Dropdown(
            choices=[
                "Text Generation",
                "Question Answering",
                "Summarization",
                "Translation",
                "Image Classification",
                "Object Detection",
                "Semantic Segmentation",
                "Instance Segmentation"
            ],
            label="Task Type",
            value="Question Answering",
            info="Specific ML task to perform"
        ),
        "deployment_platform": gr.Dropdown(
            choices=["AWS SageMaker", "Azure ML", "GCP Vertex AI", "On-Premise"],
            label="Deployment Platform",
            value="AWS SageMaker",
            info="Where the model will be deployed"
        ),
        "dataset_size": gr.Slider(
            minimum=100,
            maximum=1000000,
            value=10000,
            step=100,
            label="Dataset Size",
            info="Number of training samples"
        ),
        "target_accuracy": gr.Slider(
            minimum=70.0,
            maximum=99.9,
            value=90.0,
            step=0.1,
            label="Target Accuracy (%)",
            info="Desired model accuracy"
        ),
        "latency_requirement": gr.Slider(
            minimum=10,
            maximum=5000,
            value=200,
            step=10,
            label="Latency Requirement (ms)",
            info="Maximum acceptable inference latency"
        ),
        "budget_level": gr.Radio(
            choices=["Low", "Moderate", "High"],
            label="Budget Level",
            value="Moderate",
            info="Monthly budget constraint"
        ),
    },
    outputs={
        "requirements": gr.JSON(label="Project Requirements"),
    },
)


# ============================================================================
# Stage 2: Model Selection & Scoring
# ============================================================================

def select_and_score_models(requirements: dict) -> dict:
    """
    Select candidate models and score them based on requirements.
    This mirrors the model scoring logic in mockData.ts
    """
    time.sleep(1.5)
    
    use_case = requirements["project_details"]["use_case_type"]
    task_type = requirements["project_details"]["task_type"]
    constraints = requirements["constraints"]
    
    # Mock model database (simplified from the React app)
    if use_case == "LLM":
        if "Question Answering" in task_type or "Generation" in task_type:
            candidate_models = [
                {
                    "name": "meta-llama/Llama-3.1-8B-Instruct",
                    "accuracy": 92.5,
                    "latency": 150,
                    "memory_usage": 16,
                    "cost": 850,
                    "scalability": "High"
                },
                {
                    "name": "mistralai/Mistral-7B-Instruct",
                    "accuracy": 90.2,
                    "latency": 120,
                    "memory_usage": 14,
                    "cost": 720,
                    "scalability": "High"
                },
                {
                    "name": "google/flan-t5-xl",
                    "accuracy": 88.5,
                    "latency": 100,
                    "memory_usage": 12,
                    "cost": 600,
                    "scalability": "Medium"
                },
            ]
        else:
            candidate_models = [
                {
                    "name": "bert-base-uncased",
                    "accuracy": 89.0,
                    "latency": 80,
                    "memory_usage": 8,
                    "cost": 450,
                    "scalability": "High"
                },
            ]
    else:  # CV
        if "Classification" in task_type:
            candidate_models = [
                {
                    "name": "ResNet-50",
                    "accuracy": 94.5,
                    "latency": 45,
                    "memory_usage": 8,
                    "cost": 400,
                    "scalability": "High"
                },
                {
                    "name": "EfficientNet-B0",
                    "accuracy": 93.2,
                    "latency": 30,
                    "memory_usage": 6,
                    "cost": 320,
                    "scalability": "High"
                },
                {
                    "name": "ViT-Base",
                    "accuracy": 95.1,
                    "latency": 60,
                    "memory_usage": 12,
                    "cost": 550,
                    "scalability": "Medium"
                },
            ]
        else:  # Object Detection
            candidate_models = [
                {
                    "name": "YOLOv8",
                    "accuracy": 91.5,
                    "latency": 25,
                    "memory_usage": 10,
                    "cost": 480,
                    "scalability": "High"
                },
                {
                    "name": "Faster R-CNN",
                    "accuracy": 93.0,
                    "latency": 120,
                    "memory_usage": 16,
                    "cost": 650,
                    "scalability": "Medium"
                },
            ]
    
    # Score models (same logic as React app)
    scored_models = []
    for model in candidate_models:
        score = 0
        
        # Accuracy alignment (30% weight)
        target_accuracy = constraints["target_accuracy"]
        accuracy_diff = abs(model["accuracy"] - target_accuracy)
        score += (100 - accuracy_diff) * 0.3
        
        # Latency alignment (25% weight)
        latency_req = constraints["latency_requirement"]
        if model["latency"] <= latency_req:
            latency_fit = 100
        else:
            latency_fit = max(0, 100 - ((model["latency"] - latency_req) / latency_req * 100))
        score += latency_fit * 0.25
        
        # Memory alignment (20% weight)
        memory_limit = constraints["memory_limit"]
        if model["memory_usage"] <= memory_limit:
            memory_fit = 100
        else:
            memory_fit = max(0, 100 - ((model["memory_usage"] - memory_limit) / memory_limit * 100))
        score += memory_fit * 0.2
        
        # Budget alignment (15% weight)
        budget_scores = {"Low": 80, "Moderate": 90, "High": 100}
        budget_score = budget_scores.get(constraints.get("budget_level", "Moderate"), 90)
        if model["cost"] > 700:
            budget_score *= 0.7
        score += budget_score * 0.15
        
        # Deployment fit (10% weight)
        score += 90 * 0.1  # Simplified
        
        scored_models.append({
            **model,
            "score": round(score, 2)
        })
    
    # Sort by score
    scored_models.sort(key=lambda x: x["score"], reverse=True)
    
    result = {
        "recommended_model": scored_models[0],
        "alternatives": scored_models[1:4],
        "total_candidates_evaluated": len(candidate_models),
        "selection_criteria": {
            "accuracy_weight": 0.30,
            "latency_weight": 0.25,
            "memory_weight": 0.20,
            "budget_weight": 0.15,
            "deployment_weight": 0.10,
        }
    }
    
    return result


model_selection = FnNode(
    fn=select_and_score_models,
    inputs={
        "requirements": project_requirements.requirements,
    },
    outputs={
        "selection_result": gr.JSON(label="Model Selection & Scoring"),
    },
)


# ============================================================================
# Stage 3: Cost & Performance Analysis
# ============================================================================

def analyze_cost_and_performance(
    requirements: dict,
    selection_result: dict
) -> dict:
    """
    Analyze costs and performance metrics for the selected model.
    """
    time.sleep(1.0)
    
    model = selection_result["recommended_model"]
    dataset_size = requirements["dataset"]["size"]
    budget_level = requirements["constraints"]["budget_level"]
    
    # Calculate training costs
    base_training_cost = model["cost"]
    dataset_multiplier = 1 + (dataset_size / 100000) * 0.5
    training_cost = base_training_cost * dataset_multiplier
    
    # Calculate inference costs
    monthly_requests = 100000 if budget_level == "Low" else 500000 if budget_level == "Moderate" else 2000000
    cost_per_1k_requests = 0.05 if model["latency"] < 100 else 0.10
    monthly_inference_cost = (monthly_requests / 1000) * cost_per_1k_requests
    
    # Performance metrics
    analysis = {
        "cost_breakdown": {
            "training_cost": round(training_cost, 2),
            "monthly_inference_cost": round(monthly_inference_cost, 2),
            "infrastructure_cost": round(training_cost * 0.3, 2),
            "total_first_month": round(training_cost + monthly_inference_cost + (training_cost * 0.3), 2),
        },
        "performance_metrics": {
            "expected_accuracy": model["accuracy"],
            "expected_latency_ms": model["latency"],
            "throughput_requests_per_sec": round(1000 / model["latency"], 2),
            "memory_usage_gb": model["memory_usage"],
        },
        "scalability": {
            "level": model["scalability"],
            "max_concurrent_requests": 100 if model["scalability"] == "High" else 50,
            "autoscaling_supported": True,
        },
        "risk_assessment": {
            "technical_risk": "Low" if model["score"] > 85 else "Medium",
            "cost_risk": "Low" if training_cost < 1000 else "Medium",
            "performance_risk": "Low" if model["latency"] < requirements["constraints"]["latency_requirement"] else "Medium",
        }
    }
    
    return analysis


cost_analysis = FnNode(
    fn=analyze_cost_and_performance,
    inputs={
        "requirements": project_requirements.requirements,
        "selection_result": model_selection.selection_result,
    },
    outputs={
        "analysis": gr.JSON(label="Cost & Performance Analysis"),
    },
)


# ============================================================================
# Stage 4: Architecture Generation
# ============================================================================

def generate_architecture(
    requirements: dict,
    selection_result: dict,
    analysis: dict
) -> dict:
    """
    Generate cloud architecture recommendation.
    """
    time.sleep(1.0)
    
    model = selection_result["recommended_model"]
    platform = requirements["project_details"]["deployment_platform"]
    
    # Generate architecture components
    architecture = {
        "deployment_platform": platform,
        "components": [
            {
                "name": "API Gateway",
                "type": "gateway",
                "description": "Load balancing and request routing",
                "service": "AWS API Gateway" if "AWS" in platform else "Azure API Management",
                "estimated_cost_monthly": 50,
            },
            {
                "name": "Model Endpoint",
                "type": "inference",
                "description": f"{model['name']} inference service",
                "service": "SageMaker Endpoint" if "AWS" in platform else "Azure ML Endpoint",
                "instance_type": "ml.g4dn.xlarge" if model["memory_usage"] > 12 else "ml.m5.xlarge",
                "estimated_cost_monthly": analysis["cost_breakdown"]["monthly_inference_cost"],
            },
            {
                "name": "Model Storage",
                "type": "storage",
                "description": "Model artifacts and training data",
                "service": "S3" if "AWS" in platform else "Azure Blob Storage",
                "estimated_cost_monthly": 100,
            },
            {
                "name": "Monitoring & Logging",
                "type": "monitoring",
                "description": "Performance monitoring and logging",
                "service": "CloudWatch" if "AWS" in platform else "Azure Monitor",
                "estimated_cost_monthly": 75,
            },
        ],
        "data_flow": [
            "Client → API Gateway → Model Endpoint → Response",
            "Model Endpoint → Monitoring & Logging",
            "Training Pipeline → Model Storage → Model Endpoint",
        ],
        "security": {
            "authentication": "API Key + IAM Roles",
            "encryption": "TLS 1.3 in transit, AES-256 at rest",
            "vpc_isolation": True,
        },
        "estimated_total_monthly_cost": sum(
            comp["estimated_cost_monthly"] 
            for comp in [
                {"estimated_cost_monthly": 50},
                {"estimated_cost_monthly": analysis["cost_breakdown"]["monthly_inference_cost"]},
                {"estimated_cost_monthly": 100},
                {"estimated_cost_monthly": 75},
            ]
        )
    }
    
    return architecture


architecture_generation = FnNode(
    fn=generate_architecture,
    inputs={
        "requirements": project_requirements.requirements,
        "selection_result": model_selection.selection_result,
        "analysis": cost_analysis.analysis,
    },
    outputs={
        "architecture": gr.JSON(label="Cloud Architecture"),
    },
)


# ============================================================================
# Stage 5: Final Recommendations
# ============================================================================

def generate_final_recommendations(
    requirements: dict,
    selection_result: dict,
    analysis: dict,
    architecture: dict
) -> dict:
    """
    Generate final comprehensive recommendations with rationale.
    """
    time.sleep(0.5)
    
    model = selection_result["recommended_model"]
    use_case = requirements["project_details"]["use_case_type"]
    task_type = requirements["project_details"]["task_type"]
    
    # Generate rationale
    rationale = f"""
## Recommendation Rationale

### Selected Model: {model['name']}

**Why this model was chosen:**

1. **Performance Match**: With {model['accuracy']}% accuracy, this model meets your target of {requirements['constraints']['target_accuracy']}% while maintaining {model['latency']}ms latency (requirement: {requirements['constraints']['latency_requirement']}ms).

2. **Cost Efficiency**: Total first month cost of ${analysis['cost_breakdown']['total_first_month']:.2f} aligns with your {requirements['constraints']['budget_level']} budget level.

3. **Scalability**: {model['scalability']} scalability rating ensures the model can handle production workloads on {requirements['project_details']['deployment_platform']}.

4. **Technical Fit**: Optimized for {use_case} {task_type} tasks with proven performance in production environments.

### Key Metrics:
- Overall Score: {model['score']:.1f}/100
- Expected Accuracy: {model['accuracy']}%
- Latency: {model['latency']}ms
- Memory Usage: {model['memory_usage']}GB
- Throughput: {analysis['performance_metrics']['throughput_requests_per_sec']:.2f} req/sec

### Alternative Models Considered:
"""
    
    for i, alt in enumerate(selection_result["alternatives"][:3], 1):
        rationale += f"\n{i}. **{alt['name']}** (Score: {alt['score']:.1f}) - {alt['accuracy']}% accuracy, {alt['latency']}ms latency"
    
    rationale += f"""

### Deployment Strategy:
- Platform: {architecture['deployment_platform']}
- Instance Type: {architecture['components'][1]['instance_type']}
- Autoscaling: Enabled
- Monitoring: {architecture['components'][3]['service']}

### Next Steps:
1. Review and approve this recommendation
2. Prepare training dataset ({requirements['dataset']['size']} samples)
3. Configure {architecture['deployment_platform']} environment
4. Run training job (estimated cost: ${analysis['cost_breakdown']['training_cost']:.2f})
5. Deploy to production endpoint
6. Monitor performance and costs
"""
    
    final_recommendation = {
        "recommended_model": model,
        "alternatives": selection_result["alternatives"],
        "cost_summary": analysis["cost_breakdown"],
        "performance_summary": analysis["performance_metrics"],
        "architecture_summary": {
            "platform": architecture["deployment_platform"],
            "components_count": len(architecture["components"]),
            "monthly_cost": architecture["estimated_total_monthly_cost"],
        },
        "rationale": rationale,
        "confidence_score": model["score"],
        "risk_level": analysis["risk_assessment"]["technical_risk"],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ready_for_deployment": model["score"] > 80,
    }
    
    return final_recommendation


final_recommendations = FnNode(
    fn=generate_final_recommendations,
    inputs={
        "requirements": project_requirements.requirements,
        "selection_result": model_selection.selection_result,
        "analysis": cost_analysis.analysis,
        "architecture": architecture_generation.architecture,
    },
    outputs={
        "recommendations": gr.JSON(label="Final Recommendations"),
    },
)


# ============================================================================
# Create and Launch the Graph
# ============================================================================

graph = Graph(
    name="AI Model Recommendation Generator",
    nodes=[
        project_requirements,
        model_selection,
        cost_analysis,
        architecture_generation,
        final_recommendations,
    ],
)

if __name__ == "__main__":
    graph.launch()
