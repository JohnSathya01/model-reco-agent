# Model Retraining & Deployment Workflow

A Daggr-based workflow for retraining and deploying machine learning models, supporting both LLM fine-tuning and Computer Vision models.

## Overview

This workflow provides an end-to-end pipeline for:
1. **Dataset Preparation** - Load and preprocess data from S3
2. **Training Job Initiation** - Configure and start model training
3. **Model Deployment** - Deploy trained models to inference endpoints
4. **Inference** - Run predictions using the deployed model

## Architecture

```
┌─────────────────────┐
│ Dataset Preparation │
│   (S3 URI Input)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Training Job      │
│  (LLM/CV Support)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Model Deployment   │
│  (Auto-scaling)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Inference       │
│  (Text/Image Input) │
└─────────────────────┘
```

## Installation

1. Install Daggr:
```bash
pip install daggr
```

2. Install additional dependencies:
```bash
pip install gradio
```

## Usage

### Running the Workflow

```bash
# With hot reloading
daggr model_retraining_workflow.py

# Or standard execution
python model_retraining_workflow.py
```

The workflow will launch in your browser at `http://localhost:7860`.

### Workflow Stages

#### 1. Dataset Preparation

**Inputs:**
- **S3 Dataset URI**: S3 path to your training data (e.g., `s3://my-bucket/datasets/training-data/`)
- **Model Type**: Choose between `llm` (Language Model) or `cv` (Computer Vision)
- **Validation Split**: Percentage of data for validation (0.1 - 0.4)

**Outputs:**
- Dataset statistics (total samples, train/validation split)
- Preprocessing steps applied
- Dataset status

**Example S3 URIs:**
- LLM: `s3://ml-datasets/llm-finetuning/medical-qa/`
- CV: `s3://ml-datasets/computer-vision/image-classification/`

#### 2. Training Job Initiation

**Inputs:**
- **Dataset Info**: Automatically connected from Stage 1
- **Base Model**: HuggingFace model ID (e.g., `meta-llama/Llama-3.1-8B-Instruct`)
- **Epochs**: Number of training epochs (1-20)
- **Batch Size**: Training batch size (1-64)
- **Learning Rate**: Learning rate for optimization
- **Use LoRA**: Enable Low-Rank Adaptation for efficient LLM fine-tuning

**Outputs:**
- Training job ID and status
- Hyperparameter configuration
- Real-time training metrics (loss, accuracy)
- Estimated training duration

**Supported Base Models:**
- **LLM**: Llama, GPT, Mistral, Falcon, etc.
- **CV**: ResNet, EfficientNet, ViT, YOLO, etc.

#### 3. Model Deployment

**Inputs:**
- **Training Config**: Automatically connected from Stage 2
- **Instance Type**: EC2 instance for deployment
  - `ml.t3.medium` - CPU, low cost
  - `ml.m5.xlarge` - CPU, balanced
  - `ml.g4dn.xlarge` - GPU, cost-effective
  - `ml.g5.2xlarge` - GPU, high performance
  - `ml.p3.2xlarge` - GPU, maximum performance
- **Min/Max Replicas**: Autoscaling configuration
- **Enable Autoscaling**: Automatic scaling based on traffic

**Outputs:**
- Endpoint URL for inference
- Deployment status and health
- Infrastructure configuration
- Estimated cost per hour

#### 4. Model Inference

**Inputs:**
- **Deployment Info**: Automatically connected from Stage 3
- **Input Text**: For LLM models (e.g., questions, prompts)
- **Input Image**: For CV models (upload image file)
- **Max Tokens**: Maximum tokens to generate (LLM only)
- **Temperature**: Sampling temperature (LLM only, 0.0-2.0)

**Outputs:**
- **LLM**: Generated text, token count, inference time
- **CV**: Class predictions with confidence scores, inference time

## Integration with Existing Workflows

### Connecting to Generate Recommendations Workflow

This retraining workflow can be integrated with your existing recommendation system:

```python
from daggr import Graph, FnNode
import gradio as gr

# Import nodes from both workflows
from model_retraining_workflow import dataset_prep, training_job, model_deployment, inference
from generate_recommendations_workflow import recommendation_engine

# Create a conditional node to trigger retraining
def should_retrain(model_performance: dict) -> bool:
    """Decide if model needs retraining based on performance metrics"""
    return model_performance.get("accuracy", 1.0) < 0.85

retrain_trigger = FnNode(
    fn=should_retrain,
    inputs={"model_performance": recommendation_engine.metrics},
    outputs={"trigger": gr.Checkbox(label="Trigger Retraining")},
)

# Connect workflows
combined_graph = Graph(
    name="Intelligent Model Recommendation with Auto-Retraining",
    nodes=[
        recommendation_engine,
        retrain_trigger,
        dataset_prep,
        training_job,
        model_deployment,
        inference,
    ],
)
```

## Mock Implementation Details

Currently, all stages use mock implementations for demonstration:

### Dataset Preparation
- Simulates S3 download and preprocessing
- Returns mock dataset statistics
- Validates S3 URI format

### Training Job
- Simulates training job initialization
- Returns mock training metrics
- Supports both LLM and CV configurations

### Model Deployment
- Simulates endpoint creation
- Returns mock endpoint URL
- Calculates estimated costs

### Inference
- Simulates model predictions
- Returns mock results based on model type
- Handles both text and image inputs

## Production Implementation

To convert to production, replace mock functions with actual implementations:

### 1. Dataset Preparation
```python
import boto3
import sagemaker

def prepare_dataset(s3_uri: str, model_type: str, validation_split: float):
    # Download from S3
    s3 = boto3.client('s3')
    # ... actual S3 download logic
    
    # Preprocess data
    if model_type == "llm":
        # Tokenization, formatting for instruction tuning
        pass
    else:
        # Image preprocessing, augmentation
        pass
    
    return dataset_info
```

### 2. Training Job
```python
import sagemaker
from sagemaker.huggingface import HuggingFace

def start_training_job(dataset_info: dict, base_model: str, ...):
    # Configure SageMaker training job
    huggingface_estimator = HuggingFace(
        entry_point='train.py',
        base_job_name='model-retraining',
        role=sagemaker_role,
        instance_type='ml.p3.2xlarge',
        instance_count=1,
        hyperparameters={
            'epochs': epochs,
            'batch_size': batch_size,
            'learning_rate': learning_rate,
        }
    )
    
    # Start training
    huggingface_estimator.fit({'train': dataset_info['s3_uri']})
    
    return training_config
```

### 3. Model Deployment
```python
def deploy_model(training_config: dict, instance_type: str, ...):
    # Deploy to SageMaker endpoint
    predictor = huggingface_estimator.deploy(
        initial_instance_count=min_replicas,
        instance_type=instance_type,
        endpoint_name=f"endpoint-{job_id}"
    )
    
    # Configure autoscaling
    if enable_autoscaling:
        client = boto3.client('application-autoscaling')
        # ... autoscaling configuration
    
    return deployment_info
```

### 4. Inference
```python
def run_inference(deployment_info: dict, input_text: str, ...):
    # Call SageMaker endpoint
    predictor = sagemaker.predictor.Predictor(
        endpoint_name=deployment_info['endpoint_name']
    )
    
    result = predictor.predict({
        'inputs': input_text,
        'parameters': {
            'max_tokens': max_tokens,
            'temperature': temperature,
        }
    })
    
    return result
```

## Cost Estimation

Approximate AWS costs for different configurations:

| Instance Type | Cost/Hour | Use Case |
|--------------|-----------|----------|
| ml.t3.medium | $0.05 | Development/Testing |
| ml.m5.xlarge | $0.23 | CPU inference |
| ml.g4dn.xlarge | $0.74 | GPU inference (cost-effective) |
| ml.g5.2xlarge | $1.21 | GPU inference (high performance) |
| ml.p3.2xlarge | $3.82 | Training/Heavy inference |

**Training Costs:**
- LLM fine-tuning (3 epochs): ~$15-50 depending on model size
- CV training (10 epochs): ~$5-20 depending on dataset size

## Features

✅ **Dual Model Support**: LLM fine-tuning and Computer Vision models
✅ **S3 Integration**: Direct dataset loading from S3
✅ **Flexible Training**: Configurable hyperparameters and LoRA support
✅ **Auto-scaling**: Automatic scaling based on traffic
✅ **Cost Tracking**: Real-time cost estimation
✅ **Visual Workflow**: Interactive Daggr canvas for monitoring
✅ **State Persistence**: Resume workflows across sessions
✅ **Result History**: Browse previous training runs

## Troubleshooting

### S3 Access Issues
```bash
# Configure AWS credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### GPU Out of Memory
- Reduce batch size
- Enable gradient checkpointing
- Use LoRA for LLM fine-tuning
- Choose smaller base model

### Deployment Failures
- Check IAM permissions for SageMaker
- Verify instance type availability in your region
- Ensure model artifacts are accessible

## Next Steps

1. **Replace mock implementations** with actual AWS/SageMaker calls
2. **Add monitoring** with CloudWatch metrics
3. **Implement cost alerts** for budget management
4. **Add model versioning** with MLflow or SageMaker Model Registry
5. **Create training scripts** for custom model architectures
6. **Add data validation** with Great Expectations or similar
7. **Implement A/B testing** for model comparison

## Resources

- [Daggr Documentation](https://github.com/gradio-app/daggr)
- [SageMaker Training](https://docs.aws.amazon.com/sagemaker/latest/dg/train-model.html)
- [HuggingFace Fine-tuning](https://huggingface.co/docs/transformers/training)
- [LoRA Paper](https://arxiv.org/abs/2106.09685)

## License

MIT License - See LICENSE file for details
