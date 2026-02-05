# Setup Guide - Model Retraining Workflow

Complete setup instructions for the Model Retraining Workflow with virtual environment.

## ✅ Installation Complete!

The virtual environment has been created and all dependencies are installed.

## 📁 What Was Installed

### Virtual Environment Location
```
daggr/venv/
```

### Installed Packages
- ✅ **daggr** (0.5.4) - Workflow engine
- ✅ **gradio** (6.5.1) - UI components
- ✅ **fastapi** - Web framework
- ✅ **uvicorn** - ASGI server
- ✅ **pydantic** - Data validation
- ✅ **pandas** - Data manipulation
- ✅ **numpy** - Numerical computing
- ✅ **httpx** - HTTP client
- ✅ **huggingface-hub** - HF integration
- ✅ And 40+ other dependencies

## 🚀 Quick Start

### Option 1: Using the Launch Script (Recommended)

```bash
# Launch the main retraining workflow
./daggr/run_workflow.sh

# Or launch the integrated workflow
./daggr/run_workflow.sh integrated_workflow_example.py
```

### Option 2: Manual Activation

```bash
# Activate virtual environment
source daggr/venv/bin/activate

# Run the workflow
daggr daggr/model_retraining_workflow.py

# Or run the integrated workflow
daggr daggr/integrated_workflow_example.py

# When done, deactivate
deactivate
```

### Option 3: Direct Python Execution

```bash
# Run without activating (uses venv Python directly)
daggr/venv/bin/python daggr/model_retraining_workflow.py
```

## 🧪 Testing

### Run All Tests
```bash
# Activate environment
source daggr/venv/bin/activate

# Run test suite
python daggr/test_workflow.py

# Expected output: ✓ All tests passed successfully!
```

### Test Individual Stages
```bash
source daggr/venv/bin/activate
python -c "
from daggr.model_retraining_workflow import prepare_dataset
result = prepare_dataset('s3://test/', 'llm', 0.2)
print(result)
"
```

## 📊 Workflow Options

### 1. Standalone Retraining Workflow
```bash
./daggr/run_workflow.sh
# or
daggr/venv/bin/daggr daggr/model_retraining_workflow.py
```

**Features:**
- 4-stage pipeline
- Dataset preparation from S3
- Training job configuration
- Model deployment
- Inference testing

### 2. Integrated Workflow with Recommendations
```bash
./daggr/run_workflow.sh integrated_workflow_example.py
# or
daggr/venv/bin/daggr daggr/integrated_workflow_example.py
```

**Features:**
- Model recommendations
- Performance monitoring
- Auto-triggered retraining
- Validation and comparison

## 🔧 Configuration

### Custom Port
```bash
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py --server-port 7861
```

### Share Publicly
```bash
source daggr/venv/bin/activate
# Edit the workflow file and add:
# graph.launch(share=True)
```

### Deploy to Hugging Face Spaces
```bash
source daggr/venv/bin/activate
daggr deploy daggr/model_retraining_workflow.py --name my-workflow
```

## 📝 Environment Variables

### Optional Configuration
```bash
# Set custom cache directory
export DAGGR_CACHE_DIR=~/.cache/daggr

# Enable debug mode
export DAGGR_DEBUG=1

# Set HuggingFace token (for private models)
export HF_TOKEN=hf_xxxxx
```

## 🛠️ Troubleshooting

### Virtual Environment Issues

**Problem:** `source: command not found`
```bash
# Use this instead (for some shells)
. daggr/venv/bin/activate
```

**Problem:** Permission denied on run_workflow.sh
```bash
chmod +x daggr/run_workflow.sh
```

**Problem:** Virtual environment not activating
```bash
# Recreate the virtual environment
rm -rf daggr/venv
python3 -m venv daggr/venv
source daggr/venv/bin/activate
pip install -r daggr/requirements.txt
```

### Workflow Issues

**Problem:** Port already in use
```bash
# Use a different port
daggr/venv/bin/daggr daggr/model_retraining_workflow.py --server-port 7861
```

**Problem:** Module not found
```bash
# Make sure virtual environment is activated
source daggr/venv/bin/activate
# Reinstall dependencies
pip install -r daggr/requirements.txt
```

**Problem:** Gradio component errors
```bash
# Update gradio
source daggr/venv/bin/activate
pip install --upgrade gradio
```

## 📦 Adding More Dependencies

### For Production AWS Integration
```bash
source daggr/venv/bin/activate
pip install boto3 sagemaker
```

### For Audio Processing
```bash
source daggr/venv/bin/activate
pip install pydub
```

### For Advanced ML Features
```bash
source daggr/venv/bin/activate
pip install transformers torch torchvision
```

### Save Updated Requirements
```bash
source daggr/venv/bin/activate
pip freeze > daggr/requirements-full.txt
```

## 🔄 Updating Dependencies

```bash
source daggr/venv/bin/activate

# Update all packages
pip install --upgrade -r daggr/requirements.txt

# Update specific package
pip install --upgrade daggr

# Check for outdated packages
pip list --outdated
```

## 🗑️ Cleanup

### Remove Virtual Environment
```bash
rm -rf daggr/venv
```

### Clean Cache
```bash
rm -rf ~/.cache/huggingface/daggr
```

### Full Reset
```bash
# Remove everything and start fresh
rm -rf daggr/venv
rm -rf ~/.cache/huggingface/daggr
python3 -m venv daggr/venv
source daggr/venv/bin/activate
pip install -r daggr/requirements.txt
```

## 📚 Next Steps

1. ✅ **Test the workflow** - Run `./daggr/run_workflow.sh`
2. ⬜ **Explore the UI** - Try different configurations
3. ⬜ **Review documentation** - Read `MODEL_RETRAINING_WORKFLOW.md`
4. ⬜ **Customize workflows** - Modify for your use case
5. ⬜ **Add production code** - Replace mock implementations
6. ⬜ **Deploy** - Share or deploy to HF Spaces

## 🎯 Usage Examples

### Example 1: LLM Fine-tuning
```bash
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py

# In the UI:
# 1. S3 URI: s3://ml-datasets/llm-finetuning/medical-qa/
# 2. Model Type: llm
# 3. Base Model: meta-llama/Llama-3.1-8B-Instruct
# 4. Epochs: 3
# 5. Use LoRA: ✓
# 6. Click "Run" on each stage
```

### Example 2: Computer Vision
```bash
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py

# In the UI:
# 1. S3 URI: s3://ml-datasets/computer-vision/images/
# 2. Model Type: cv
# 3. Base Model: resnet50
# 4. Epochs: 10
# 5. Click "Run" on each stage
```

### Example 3: Performance-Triggered Retraining
```bash
source daggr/venv/bin/activate
daggr daggr/integrated_workflow_example.py

# In the UI:
# 1. Set task type and requirements
# 2. Set current accuracy to 0.82 (below threshold)
# 3. Watch automatic retraining trigger
# 4. Review validation results
```

## 💡 Tips

### Keyboard Shortcuts in Daggr UI
- `Space` - Run selected node
- `←` `→` - Navigate result history
- `Ctrl/Cmd + S` - Save current sheet
- `Ctrl/Cmd + N` - New sheet

### Working with Sheets
- Create multiple sheets for different experiments
- Each sheet has independent state
- Great for comparing configurations

### Result History
- Use ◀ ▶ arrows to browse previous runs
- See exactly what inputs produced each result
- Downstream nodes automatically sync

## 🔐 Security Notes

### Virtual Environment Isolation
- Dependencies are isolated from system Python
- Safe to experiment without affecting other projects
- Easy to delete and recreate

### API Keys and Secrets
```bash
# Never commit secrets to git
# Use environment variables instead
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=yyy
export HF_TOKEN=zzz
```

## 📞 Support

### Documentation
- `README.md` - Project overview
- `QUICKSTART.md` - 5-minute guide
- `MODEL_RETRAINING_WORKFLOW.md` - Full documentation
- `ARCHITECTURE.md` - System architecture

### Resources
- [Daggr Documentation](https://github.com/gradio-app/daggr)
- [Gradio Documentation](https://www.gradio.app/docs)
- [HuggingFace Hub](https://huggingface.co/docs/hub)

### Getting Help
- Check documentation first
- Review example workflows
- Test with mock implementations
- Ask in Daggr/Gradio communities

---

**Setup Complete!** 🎉

Run `./daggr/run_workflow.sh` to get started!
