#!/bin/bash

# Model Retraining Workflow - Launch Script
# This script activates the virtual environment and runs the workflow

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Activate virtual environment
source "$SCRIPT_DIR/venv/bin/activate"

# Check if a workflow file is specified
if [ $# -eq 0 ]; then
    echo "🚀 Available Workflows:"
    echo ""
    echo "1. generate_recommendations_workflow.py - AI Model Recommendation Generator"
    echo "2. model_retraining_workflow.py - Model Retraining & Deployment"
    echo "3. integrated_workflow_example.py - Integrated with Performance Monitoring"
    echo ""
    echo "Launching default: AI Model Recommendation Generator..."
    echo ""
    daggr "$SCRIPT_DIR/generate_recommendations_workflow.py"
else
    # Run the specified workflow
    echo "🚀 Launching $1..."
    echo ""
    daggr "$SCRIPT_DIR/$1"
fi
