# Quick Start Guide: Model Retraining Workflow

Get started with the model retraining workflow in 5 minutes!

## Prerequisites

```bash
# Install Daggr
pip install daggr

# Install Gradio (if not already installed)
pip install gradio
```

## Option 1: Standalone Retraining Workflow

Run the complete retraining workflow independently:

```bash
cd daggr
daggr model_retraining_workflow.py
```

This will launch a workflow with 4 stages:
1. **Dataset Preparation** - Enter S3 URI and configure dataset
2. **Training Job** - Configure and start model training
3. **Model Deployment** - Deploy to inference endpoint
4. **Inference** - Test the deployed model

### Example Usage Flow

1. **Stage 1: Dataset Preparation**
   - S3 URI: `s3://ml-datasets/llm-finetuning/medical-qa/`
   - Model Type: `llm`
   - Validation Split: `0.2`
   - Click "Run" → See dataset statistics

2. **Stage 2: Training Job**
   - Base Model: `meta-llama/Llama-3.1-8B-Instruct`
   - Epochs: `3`
   - Batch Size: `8`
   - Learning Rate: `2e-5`
   - Use LoRA: ✓
   - Click "Run" → See training configuration

3. **Stage 3: Model Deployment**
   - Instance Type: `ml.g4dn.xlarge`
   - Min Replicas: `1`
   - Max Replicas: `5`
   - Enable Autoscaling: ✓
   - Click "Run" → See deployment info

4. **Stage 4: Inference**
   - Input Text: `What are the symptoms of diabetes?`
   - Max Tokens: `512`
   - Temperature: `0.7`
   - Click "Run" → See inference results

## Option 2: Integrated Workflow with Recommendations

Run the integrated workflow that combines recommendations with retraining:

```bash
cd daggr
daggr integrated_workflow_example.py
```

This workflow includes:
1. **Model Recommendations** - Get model suggestions based on requirements
2. **Performance Monitoring** - Monitor deployed model metrics
3. **Retraining Decision** - Automatically decide if retraining is needed
4. **Retraining Execution** - Execute retraining pipeline
5. **Model Validation** - Validate retrained model

### Example Usage Flow

1. **Generate Recommendations**
   - Task Type: `llm`
   - Dataset Size: `10000`
   - Latency Requirement: `medium`
   - Budget: `$1000/month`
   - Click "Run" → See recommended models

2. **Monitor Performance**
   - Current Accuracy: `0.82` (below threshold!)
   - Current Latency: `180ms`
   - Error Rate: `0.03`
   - Click "Run" → See performance report (triggers retraining!)

3. **Configure Retraining**
   - S3 Dataset URI: `s3://ml-datasets/llm-finetuning/medical-qa-v2/`
   - Click "Run" → See retraining configuration

4. **Execute Retraining**
   - Click "Run" → See training results

5. **Validate Model**
   - Test Input: `What are the symptoms of diabetes?`
   - Click "Run" → See validation results and improvement metrics

## Understanding the Daggr Canvas

### Node Cards
Each stage appears as a card with:
- **Input fields** at the top
- **Run button** to execute the stage
- **Output display** at the bottom
- **Result history** (◀ ▶ arrows) to browse previous runs

### Edges (Connections)
- **Orange edges** = Fresh data (downstream used this exact upstream value)
- **Gray edges** = Stale data (upstream changed or downstream not run yet)

### Sheets
- Use sheets (top bar) to work on multiple projects
- Each sheet has independent state
- Great for comparing different configurations

## Tips & Tricks

### 1. Explore Different Configurations
```
Create multiple sheets to compare:
- Sheet 1: LLM with LoRA fine-tuning
- Sheet 2: LLM without LoRA
- Sheet 3: CV model training
```

### 2. Browse Result History
```
After running a stage multiple times:
1. Click ◀ ▶ arrows in the node footer
2. See exactly what inputs produced each result
3. Downstream nodes automatically sync
```

### 3. Rerun Individual Stages
```
No need to rerun the entire workflow!
- Change an input in any stage
- Click "Run" on just that stage
- Downstream stages show gray edges (stale)
- Rerun downstream stages as needed
```

### 4. Test Nodes Programmatically
```python
# In Python console or notebook
from model_retraining_workflow import dataset_prep

# Test with custom inputs
result = dataset_prep.test(
    s3_uri="s3://my-bucket/data/",
    model_type="cv",
    validation_split=0.3
)
print(result)
```

## Common Workflows

### Workflow 1: LLM Fine-tuning
```
1. Dataset Prep: S3 URI → LLM → 0.2 split
2. Training: Llama-3.1-8B → 3 epochs → LoRA enabled
3. Deploy: ml.g4dn.xlarge → autoscaling
4. Inference: Test with medical questions
```

### Workflow 2: Computer Vision
```
1. Dataset Prep: S3 URI → CV → 0.2 split
2. Training: ResNet50 → 10 epochs → No LoRA
3. Deploy: ml.g5.2xlarge → autoscaling
4. Inference: Upload test images
```

### Workflow 3: Performance-Triggered Retraining
```
1. Recommendations: Get model suggestions
2. Monitor: Set accuracy to 0.82 (below threshold)
3. Auto-configure: Retraining config generated
4. Execute: Training runs automatically
5. Validate: Compare old vs new model
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Run selected node |
| `←` `→` | Navigate result history |
| `Ctrl/Cmd + S` | Save current sheet |
| `Ctrl/Cmd + N` | New sheet |
| `Ctrl/Cmd + W` | Close sheet |

## Sharing Your Workflow

### Create Public URL
```python
# In your workflow file
graph.launch(share=True)
```
This creates a temporary public URL (expires in 1 week).

### Deploy to Hugging Face Spaces
```bash
# Deploy permanently
daggr deploy model_retraining_workflow.py

# Custom configuration
daggr deploy model_retraining_workflow.py \
  --name my-retraining-workflow \
  --hardware t4-small \
  --private
```

## Troubleshooting

### Workflow won't start
```bash
# Check Daggr installation
pip show daggr

# Reinstall if needed
pip install --upgrade daggr
```

### Port already in use
```bash
# Use different port
daggr model_retraining_workflow.py --server-port 7861
```

### Can't see output
```
1. Check browser console for errors
2. Try refreshing the page
3. Clear browser cache
4. Try different browser
```

## Next Steps

1. **Customize the workflow** - Modify stages for your use case
2. **Add real implementations** - Replace mocks with actual AWS/SageMaker calls
3. **Integrate with your system** - Connect to existing recommendation engine
4. **Add monitoring** - Integrate CloudWatch or custom metrics
5. **Deploy to production** - Use `daggr deploy` for permanent hosting

## Resources

- [Full Documentation](./MODEL_RETRAINING_WORKFLOW.md)
- [Daggr Documentation](https://github.com/gradio-app/daggr)
- [Example Workflows](https://github.com/gradio-app/daggr/tree/main/examples)
- [Gradio Components](https://www.gradio.app/docs/components)

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/gradio-app/daggr/issues)
- Discussions: [Ask questions](https://github.com/gradio-app/daggr/discussions)
- Discord: [Join the community](https://discord.gg/gradio)

---

**Ready to start?** Run `daggr model_retraining_workflow.py` and explore! 🚀
