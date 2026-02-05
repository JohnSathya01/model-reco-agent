# Model Retraining Workflow with Daggr

A complete, production-ready workflow for retraining and deploying machine learning models using Daggr. Supports both LLM fine-tuning and Computer Vision models.

## 🚀 Quick Start

### ✅ Virtual Environment Already Set Up!

All dependencies are installed in `daggr/venv/`. You can start immediately:

```bash
# Option 1: Use the launch script (easiest)
./daggr/run_workflow.sh

# Option 2: Activate virtual environment manually
source daggr/venv/bin/activate
daggr model_retraining_workflow.py

# Option 3: Run directly without activating
daggr/venv/bin/daggr model_retraining_workflow.py
```

### First Time Setup (if needed)

If you need to recreate the environment:

```bash
# Create virtual environment
python3 -m venv daggr/venv

# Activate it
source daggr/venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 📁 Files

| File | Description |
|------|-------------|
| `model_retraining_workflow.py` | Main 4-stage retraining workflow |
| `integrated_workflow_example.py` | Complete integration with recommendations |
| `test_workflow.py` | Test suite to verify functionality |
| `MODEL_RETRAINING_WORKFLOW.md` | Comprehensive documentation |
| `QUICKSTART.md` | 5-minute getting started guide |

## 🎯 Features

- ✅ **Dual Model Support**: LLM fine-tuning and Computer Vision
- ✅ **S3 Integration**: Direct dataset loading from S3
- ✅ **Flexible Training**: Configurable hyperparameters, LoRA support
- ✅ **Smart Deployment**: Autoscaling, multiple instance types
- ✅ **Interactive UI**: Visual workflow canvas with Daggr
- ✅ **State Persistence**: Resume workflows across sessions
- ✅ **Cost Tracking**: Real-time cost estimation

## 📊 Workflow Stages

### Standalone Workflow
1. **Dataset Preparation** - S3 URI input, validation, preprocessing
2. **Training Job** - Configure and start model training
3. **Model Deployment** - Deploy to inference endpoint
4. **Inference** - Test the deployed model

### Integrated Workflow
1. **Model Recommendations** - Get model suggestions
2. **Performance Monitoring** - Track deployed model metrics
3. **Retraining Decision** - Auto-trigger based on thresholds
4. **Retraining Execution** - Run training pipeline
5. **Model Validation** - Compare old vs new model

## 🧪 Testing

```bash
# Run test suite
python3 test_workflow.py

# Expected output:
# ✓ All tests passed successfully!
# Workflow stages tested:
#   1. ✓ Dataset Preparation (LLM & CV)
#   2. ✓ Training Job Initiation (LLM & CV)
#   3. ✓ Model Deployment (LLM & CV)
#   4. ✓ Inference (LLM & CV)
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[MODEL_RETRAINING_WORKFLOW.md](./MODEL_RETRAINING_WORKFLOW.md)** - Full documentation
- **[Daggr Examples](./daggr/examples/)** - More workflow examples

## 💡 Example Usage

### LLM Fine-tuning
```python
# Stage 1: Dataset Preparation
s3_uri = "s3://ml-datasets/llm-finetuning/medical-qa/"
model_type = "llm"
validation_split = 0.2

# Stage 2: Training
base_model = "meta-llama/Llama-3.1-8B-Instruct"
epochs = 3
use_lora = True

# Stage 3: Deployment
instance_type = "ml.g4dn.xlarge"
enable_autoscaling = True

# Stage 4: Inference
input_text = "What are the symptoms of diabetes?"
```

### Computer Vision
```python
# Stage 1: Dataset Preparation
s3_uri = "s3://ml-datasets/computer-vision/image-classification/"
model_type = "cv"

# Stage 2: Training
base_model = "resnet50"
epochs = 10

# Stage 3: Deployment
instance_type = "ml.g5.2xlarge"

# Stage 4: Inference
input_image = "test_image.jpg"
```

## 🔧 Production Setup

Currently uses mock implementations. To convert to production:

1. **Install AWS SDK**
   ```bash
   pip install boto3 sagemaker
   ```

2. **Configure AWS Credentials**
   ```bash
   aws configure
   ```

3. **Replace Mock Functions**
   - See `MODEL_RETRAINING_WORKFLOW.md` for implementation examples
   - Update `prepare_dataset()` with actual S3 download
   - Update `start_training_job()` with SageMaker training
   - Update `deploy_model()` with SageMaker endpoints
   - Update `run_inference()` with real model calls

## 💰 Cost Estimates

| Instance Type | Cost/Hour | Use Case |
|--------------|-----------|----------|
| ml.t3.medium | $0.05 | Development |
| ml.m5.xlarge | $0.23 | CPU inference |
| ml.g4dn.xlarge | $0.74 | GPU inference |
| ml.g5.2xlarge | $1.21 | High performance |
| ml.p3.2xlarge | $3.82 | Training |

## 🔗 Integration

### With Existing Recommendation System

```python
from model_retraining_workflow import dataset_prep, training_job
from your_system import recommendation_engine

# Use recommended model as base
training_job.inputs["base_model"] = recommendation_engine.outputs["top_model"]

# Trigger retraining based on performance
if model_accuracy < 0.85:
    trigger_retraining(s3_uri="s3://updated-dataset/")
```

## 📦 Dependencies

```bash
# Required
pip install daggr>=0.1.0
pip install gradio>=4.0.0

# For production
pip install boto3>=1.26.0
pip install sagemaker>=2.150.0

# For audio processing (integrated workflow)
pip install pydub>=0.25.0
```

## 🎨 Daggr Canvas Features

- **Visual Workflow**: See all stages and connections
- **Result History**: Browse previous runs with ◀ ▶ arrows
- **Staleness Tracking**: Orange edges = fresh, gray = stale
- **Sheets**: Work on multiple projects simultaneously
- **State Persistence**: Resume where you left off

## 🚢 Deployment

### Share Temporarily
```python
graph.launch(share=True)  # Creates public URL (expires in 1 week)
```

### Deploy to Hugging Face Spaces
```bash
daggr deploy model_retraining_workflow.py --name my-workflow --hardware t4-small
```

## 🐛 Troubleshooting

### Module Not Found
```bash
pip install daggr gradio
```

### Port Already in Use
```bash
daggr model_retraining_workflow.py --server-port 7861
```

### AWS Credentials
```bash
aws configure
# Or set environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

## 📚 Resources

- [Daggr Documentation](https://github.com/gradio-app/daggr)
- [Gradio Components](https://www.gradio.app/docs/components)
- [SageMaker Training](https://docs.aws.amazon.com/sagemaker/latest/dg/train-model.html)
- [HuggingFace Fine-tuning](https://huggingface.co/docs/transformers/training)

## 🤝 Contributing

Contributions welcome! Please:
1. Test your changes with `python3 test_workflow.py`
2. Update documentation as needed
3. Follow existing code style

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Next Steps

1. ✅ Test the workflows
2. ⬜ Replace mock implementations
3. ⬜ Add AWS/SageMaker integration
4. ⬜ Deploy to production
5. ⬜ Add monitoring and alerts

---

**Ready to start?** Run `daggr model_retraining_workflow.py` 🚀
