"""
Test script to verify the model retraining workflow functions correctly.
Run this to test all workflow stages without launching the UI.
"""

import sys
from model_retraining_workflow import (
    prepare_dataset,
    start_training_job,
    deploy_model,
    run_inference
)


def test_dataset_preparation():
    """Test Stage 1: Dataset Preparation"""
    print("\n" + "="*60)
    print("Testing Stage 1: Dataset Preparation")
    print("="*60)
    
    result = prepare_dataset(
        s3_uri="s3://ml-datasets/llm-finetuning/medical-qa/",
        model_type="llm",
        validation_split=0.2
    )
    
    print(f"✓ Dataset prepared successfully")
    print(f"  - Total samples: {result['total_samples']}")
    print(f"  - Train samples: {result['train_samples']}")
    print(f"  - Validation samples: {result['validation_samples']}")
    print(f"  - Status: {result['status']}")
    
    return result


def test_training_job(dataset_info):
    """Test Stage 2: Training Job Initiation"""
    print("\n" + "="*60)
    print("Testing Stage 2: Training Job Initiation")
    print("="*60)
    
    result = start_training_job(
        dataset_info=dataset_info,
        base_model="meta-llama/Llama-3.1-8B-Instruct",
        epochs=3,
        batch_size=8,
        learning_rate=2e-5,
        use_lora=True
    )
    
    print(f"✓ Training job started successfully")
    print(f"  - Job ID: {result['job_id']}")
    print(f"  - Status: {result['status']}")
    print(f"  - Base model: {result['base_model']}")
    print(f"  - Estimated duration: {result['estimated_duration_minutes']} minutes")
    print(f"  - Current epoch: {result['metrics']['current_epoch']}")
    print(f"  - Train loss: {result['metrics']['train_loss']}")
    
    return result


def test_model_deployment(training_config):
    """Test Stage 3: Model Deployment"""
    print("\n" + "="*60)
    print("Testing Stage 3: Model Deployment")
    print("="*60)
    
    result = deploy_model(
        training_config=training_config,
        instance_type="ml.g4dn.xlarge",
        min_replicas=1,
        max_replicas=5,
        enable_autoscaling=True
    )
    
    print(f"✓ Model deployed successfully")
    print(f"  - Endpoint name: {result['endpoint_name']}")
    print(f"  - Endpoint URL: {result['endpoint_url']}")
    print(f"  - Status: {result['status']}")
    print(f"  - Health: {result['health_status']}")
    print(f"  - Instance type: {result['infrastructure']['instance_type']}")
    print(f"  - Estimated cost: ${result['estimated_cost_per_hour']:.2f}/hour")
    
    return result


def test_inference_llm(deployment_info):
    """Test Stage 4: Inference (LLM)"""
    print("\n" + "="*60)
    print("Testing Stage 4: Inference (LLM)")
    print("="*60)
    
    result = run_inference(
        deployment_info=deployment_info,
        input_text="What are the symptoms of diabetes?",
        max_tokens=512,
        temperature=0.7
    )
    
    print(f"✓ Inference completed successfully")
    print(f"  - Model type: {result['model_type']}")
    print(f"  - Input: {result['input'][:50]}...")
    print(f"  - Output: {result['output'][:100]}...")
    print(f"  - Tokens generated: {result['tokens_generated']}")
    print(f"  - Inference time: {result['inference_time_ms']}ms")
    
    return result


def test_inference_cv():
    """Test Stage 4: Inference (CV)"""
    print("\n" + "="*60)
    print("Testing Stage 4: Inference (CV) - Separate Test")
    print("="*60)
    
    # Create CV-specific dataset and training
    dataset_info = prepare_dataset(
        s3_uri="s3://ml-datasets/computer-vision/image-classification/",
        model_type="cv",
        validation_split=0.2
    )
    
    training_config = start_training_job(
        dataset_info=dataset_info,
        base_model="resnet50",
        epochs=10,
        batch_size=32,
        learning_rate=1e-4,
        use_lora=False
    )
    
    deployment_info = deploy_model(
        training_config=training_config,
        instance_type="ml.g5.2xlarge",
        min_replicas=1,
        max_replicas=3,
        enable_autoscaling=True
    )
    
    result = run_inference(
        deployment_info=deployment_info,
        input_image="test_image.jpg"
    )
    
    print(f"✓ CV Inference completed successfully")
    print(f"  - Model type: {result['model_type']}")
    print(f"  - Predictions:")
    for pred in result['predictions']:
        print(f"    - {pred['class']}: {pred['confidence']:.2%}")
    print(f"  - Inference time: {result['inference_time_ms']}ms")
    
    return result


def run_all_tests():
    """Run all workflow tests"""
    print("\n" + "="*60)
    print("MODEL RETRAINING WORKFLOW - TEST SUITE")
    print("="*60)
    
    try:
        # Test LLM workflow
        print("\n>>> Testing LLM Fine-tuning Workflow")
        dataset_info = test_dataset_preparation()
        training_config = test_training_job(dataset_info)
        deployment_info = test_model_deployment(training_config)
        inference_result = test_inference_llm(deployment_info)
        
        # Test CV workflow
        print("\n>>> Testing Computer Vision Workflow")
        cv_result = test_inference_cv()
        
        # Summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print("✓ All tests passed successfully!")
        print("\nWorkflow stages tested:")
        print("  1. ✓ Dataset Preparation (LLM & CV)")
        print("  2. ✓ Training Job Initiation (LLM & CV)")
        print("  3. ✓ Model Deployment (LLM & CV)")
        print("  4. ✓ Inference (LLM & CV)")
        print("\nThe workflow is ready to use!")
        print("\nTo launch the interactive UI, run:")
        print("  daggr model_retraining_workflow.py")
        print("="*60 + "\n")
        
        return True
        
    except Exception as e:
        print("\n" + "="*60)
        print("TEST FAILED")
        print("="*60)
        print(f"Error: {str(e)}")
        print("\nPlease check the error message above and fix any issues.")
        print("="*60 + "\n")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
