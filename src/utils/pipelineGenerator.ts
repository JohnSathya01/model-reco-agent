import type { PipelineStep } from '../types';

export const generatePipeline = (description: string, useCaseType?: 'CV' | 'LLM'): PipelineStep[] => {
  const lowerDesc = description.toLowerCase();
  
  // Detect use case from description if not provided
  const detectedUseCase = useCaseType || detectUseCase(lowerDesc);
  
  if (detectedUseCase === 'CV') {
    return generateCVPipeline(lowerDesc);
  } else {
    return generateLLMPipeline(lowerDesc);
  }
};

const detectUseCase = (description: string): 'CV' | 'LLM' => {
  const cvKeywords = ['image', 'video', 'detection', 'segmentation', 'classification', 'visual', 'camera', 'drone', 'photo'];
  const llmKeywords = ['text', 'chat', 'language', 'summarization', 'conversation', 'document', 'nlp', 'chatbot'];
  
  const cvScore = cvKeywords.reduce((score, keyword) => 
    score + (description.includes(keyword) ? 1 : 0), 0);
  const llmScore = llmKeywords.reduce((score, keyword) => 
    score + (description.includes(keyword) ? 1 : 0), 0);
  
  return cvScore > llmScore ? 'CV' : 'LLM';
};

const generateCVPipeline = (description: string): PipelineStep[] => {
  const steps: PipelineStep[] = [
    {
      id: 'data-ingestion',
      name: 'Data Ingestion',
      tools: ['AWS S3', 'OpenCV', 'PIL'],
      computeNeeds: 'CPU: 2-4 cores, RAM: 8GB',
      riskNotes: ['Data quality validation required'],
      status: 'pending'
    },
    {
      id: 'data-validation',
      name: 'Data Validation',
      tools: ['Great Expectations', 'Custom Scripts'],
      computeNeeds: 'CPU: 2 cores, RAM: 4GB',
      riskNotes: ['Manual review for edge cases'],
      status: 'pending'
    },
    {
      id: 'preprocessing',
      name: 'Preprocessing',
      tools: ['OpenCV', 'Albumentations', 'PIL'],
      computeNeeds: 'CPU: 4-8 cores, RAM: 16GB',
      riskNotes: ['Augmentation may affect model performance'],
      status: 'pending'
    }
  ];

  // Add task-specific steps
  if (description.includes('detection')) {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['YOLOv8', 'Detectron2', 'EfficientDet'],
      computeNeeds: 'GPU: V100/A100, RAM: 32GB',
      riskNotes: ['Model size vs accuracy tradeoff'],
      status: 'pending'
    });
  } else if (description.includes('classification')) {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['ResNet', 'EfficientNet', 'Vision Transformer'],
      computeNeeds: 'GPU: T4/V100, RAM: 16GB',
      riskNotes: ['Transfer learning recommended'],
      status: 'pending'
    });
  } else {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['CNN Models', 'Transfer Learning'],
      computeNeeds: 'GPU: T4/V100, RAM: 16GB',
      riskNotes: ['Architecture selection critical'],
      status: 'pending'
    });
  }

  // Add common final steps
  steps.push(
    {
      id: 'finetuning',
      name: 'Finetuning',
      tools: ['PyTorch', 'TensorFlow', 'Weights & Biases'],
      computeNeeds: 'GPU: V100/A100, RAM: 32GB',
      riskNotes: ['Overfitting risk with small datasets'],
      status: 'pending'
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      tools: ['MLflow', 'TensorBoard', 'Custom Metrics'],
      computeNeeds: 'GPU: T4, RAM: 16GB',
      riskNotes: ['Test set must be representative'],
      status: 'pending'
    }
  );

  // Add deployment step based on requirements
  if (description.includes('edge')) {
    steps.push({
      id: 'deployment',
      name: 'Edge Deployment',
      tools: ['TensorRT', 'ONNX', 'Edge TPU'],
      computeNeeds: 'Edge Device: Jetson/RPi',
      riskNotes: ['Model optimization required'],
      status: 'pending'
    });
  } else {
    steps.push({
      id: 'deployment',
      name: 'Cloud Deployment',
      tools: ['AWS SageMaker', 'Docker', 'Kubernetes'],
      computeNeeds: 'Cloud Instance: ml.g4dn.xlarge',
      riskNotes: ['Auto-scaling configuration needed'],
      status: 'pending'
    });
  }

  steps.push({
    id: 'monitoring',
    name: 'Monitoring',
    tools: ['CloudWatch', 'Prometheus', 'Grafana'],
    computeNeeds: 'Monitoring Instance: t3.medium',
    riskNotes: ['Data drift detection essential'],
    status: 'pending'
  });

  return steps;
};

const generateLLMPipeline = (description: string): PipelineStep[] => {
  const steps: PipelineStep[] = [
    {
      id: 'data-ingestion',
      name: 'Data Ingestion',
      tools: ['Hugging Face Datasets', 'AWS S3', 'Data Loaders'],
      computeNeeds: 'CPU: 4 cores, RAM: 16GB',
      riskNotes: ['Text encoding validation required'],
      status: 'pending'
    },
    {
      id: 'data-validation',
      name: 'Data Validation',
      tools: ['Text Quality Checks', 'Language Detection'],
      computeNeeds: 'CPU: 2 cores, RAM: 8GB',
      riskNotes: ['Content filtering may be needed'],
      status: 'pending'
    },
    {
      id: 'preprocessing',
      name: 'Text Preprocessing',
      tools: ['Tokenizers', 'spaCy', 'NLTK'],
      computeNeeds: 'CPU: 4 cores, RAM: 16GB',
      riskNotes: ['Tokenization strategy affects performance'],
      status: 'pending'
    }
  ];

  // Add task-specific model selection
  if (description.includes('chat')) {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['Llama-2', 'GPT-3.5', 'Claude'],
      computeNeeds: 'GPU: A100 (40GB), RAM: 64GB',
      riskNotes: ['Context length limitations'],
      status: 'pending'
    });
  } else if (description.includes('summarization')) {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['BART', 'T5', 'Pegasus'],
      computeNeeds: 'GPU: V100, RAM: 32GB',
      riskNotes: ['Abstractive vs extractive choice'],
      status: 'pending'
    });
  } else {
    steps.push({
      id: 'model-selection',
      name: 'Model Selection',
      tools: ['BERT', 'RoBERTa', 'DeBERTa'],
      computeNeeds: 'GPU: V100, RAM: 32GB',
      riskNotes: ['Model size vs performance tradeoff'],
      status: 'pending'
    });
  }

  // Add finetuning approach
  if (description.includes('large') || description.includes('1000')) {
    steps.push({
      id: 'finetuning',
      name: 'LoRA Finetuning',
      tools: ['LoRA', 'PEFT', 'Hugging Face'],
      computeNeeds: 'GPU: A100, RAM: 80GB',
      riskNotes: ['Parameter efficient but may limit adaptation'],
      status: 'pending'
    });
  } else {
    steps.push({
      id: 'finetuning',
      name: 'Full Finetuning',
      tools: ['PyTorch', 'Transformers', 'DeepSpeed'],
      computeNeeds: 'GPU: A100 x2, RAM: 128GB',
      riskNotes: ['High compute requirements'],
      status: 'pending'
    });
  }

  // Add common final steps
  steps.push(
    {
      id: 'evaluation',
      name: 'Evaluation',
      tools: ['BLEU', 'ROUGE', 'Human Eval'],
      computeNeeds: 'GPU: T4, RAM: 16GB',
      riskNotes: ['Human evaluation recommended'],
      status: 'pending'
    },
    {
      id: 'deployment',
      name: 'API Deployment',
      tools: ['FastAPI', 'vLLM', 'TGI'],
      computeNeeds: 'GPU: A100, RAM: 80GB',
      riskNotes: ['Inference optimization critical'],
      status: 'pending'
    },
    {
      id: 'monitoring',
      name: 'LLM Monitoring',
      tools: ['LangSmith', 'Weights & Biases', 'Custom Metrics'],
      computeNeeds: 'Monitoring Instance: t3.large',
      riskNotes: ['Response quality monitoring essential'],
      status: 'pending'
    }
  );

  return steps;
};