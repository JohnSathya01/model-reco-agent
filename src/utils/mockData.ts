import type { 
  AlternativeModel, 
  DecisionRationale, 
  RecommendationResult,
  ArchitectureRecommendation,
  RiskAnalysis,
  CostBreakdown,
  InstanceRecommendation,
  DatasetInfo,
  FormData as AppFormData 
} from '../types';
import { generateArchitecturePipeline } from './architectureGenerator';
import { generateAPISpecification } from './apiGenerator';

// Comprehensive AI model database with realistic specifications
interface ModelSpec {
  name: string;
  type: string;
  accuracy: number;
  latency: number;
  memoryUsage: number;
  cost: string;
  scalability: string;
  tags: string[];
  description: string;
}

type ModelDatabase = {
  CV: {
    Classification: ModelSpec[];
    Detection: ModelSpec[];
    Segmentation: ModelSpec[];
  };
  LLM: {
    Chat: ModelSpec[];
    Summarization: ModelSpec[];
    Extraction: ModelSpec[];
  };
};

export const MODEL_DATABASE: ModelDatabase = {
  CV: {
    Classification: [
      {
        name: 'ResNet-50',
        type: 'Convolutional Neural Network',
        accuracy: 92.1,
        latency: 45,
        memoryUsage: 2.1,
        cost: 'Low',
        scalability: 'High',
        tags: ['Accuracy', 'Proven', 'Versatile'],
        description: 'Industry-standard CNN for image classification with excellent balance of accuracy and efficiency'
      },
      {
        name: 'EfficientNet-B3',
        type: 'Efficient Architecture',
        accuracy: 94.2,
        latency: 35,
        memoryUsage: 1.8,
        cost: 'Low',
        scalability: 'High',
        tags: ['Efficiency', 'Accuracy', 'Mobile-Ready'],
        description: 'Optimized architecture achieving superior accuracy with reduced computational requirements'
      },
      {
        name: 'Vision Transformer (ViT-Base)',
        type: 'Transformer Architecture',
        accuracy: 95.8,
        latency: 120,
        memoryUsage: 4.2,
        cost: 'High',
        scalability: 'Medium',
        tags: ['State-of-Art', 'Transformer', 'High-Accuracy'],
        description: 'Cutting-edge transformer model for superior classification performance'
      }
    ],
    Detection: [
      {
        name: 'YOLOv8-Nano',
        type: 'Lightweight Object Detection',
        accuracy: 87.3,
        latency: 12,
        memoryUsage: 0.8,
        cost: 'Very Low',
        scalability: 'Very High',
        tags: ['Speed', 'Edge-Ready', 'Real-time'],
        description: 'Ultra-fast object detection optimized for edge deployment and real-time inference'
      },
      {
        name: 'YOLOv8-Medium',
        type: 'Balanced Object Detection',
        accuracy: 91.7,
        latency: 28,
        memoryUsage: 2.3,
        cost: 'Low',
        scalability: 'High',
        tags: ['Balanced', 'Accuracy', 'Performance'],
        description: 'Optimal balance between detection accuracy and inference speed'
      },
      {
        name: 'Detectron2 (Mask R-CNN)',
        type: 'Instance Segmentation',
        accuracy: 94.1,
        latency: 180,
        memoryUsage: 6.8,
        cost: 'High',
        scalability: 'Low',
        tags: ['High-Accuracy', 'Instance-Seg', 'Research-Grade'],
        description: 'State-of-the-art instance segmentation with precise object boundaries'
      }
    ],
    Segmentation: [
      {
        name: 'U-Net',
        type: 'Semantic Segmentation',
        accuracy: 89.4,
        latency: 85,
        memoryUsage: 3.2,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['Medical', 'Semantic-Seg', 'Proven'],
        description: 'Proven architecture for pixel-level segmentation, especially in medical imaging'
      },
      {
        name: 'DeepLabV3+',
        type: 'Atrous Convolution',
        accuracy: 92.6,
        latency: 110,
        memoryUsage: 4.1,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['Accuracy', 'Multi-Scale', 'Robust'],
        description: 'Advanced segmentation with multi-scale feature extraction'
      }
    ]
  },
  LLM: {
    Chat: [
      {
        name: 'Llama-2-7B-Chat',
        type: 'Conversational LLM',
        accuracy: 88.5,
        latency: 450,
        memoryUsage: 14.2,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['Open-Source', 'Conversational', 'Fine-tunable'],
        description: 'Open-source conversational model with strong instruction following capabilities'
      },
      {
        name: 'GPT-3.5-Turbo',
        type: 'API-based LLM',
        accuracy: 92.1,
        latency: 280,
        memoryUsage: 0, // API-based
        cost: 'High',
        scalability: 'Very High',
        tags: ['API', 'Reliable', 'Production-Ready'],
        description: 'Production-ready conversational AI with excellent reliability and scalability'
      },
      {
        name: 'Mistral-7B-Instruct',
        type: 'Instruction-Tuned LLM',
        accuracy: 89.7,
        latency: 380,
        memoryUsage: 13.8,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['Efficient', 'Instruction', 'European'],
        description: 'Efficient instruction-following model with strong reasoning capabilities'
      }
    ],
    Summarization: [
      {
        name: 'BART-Large',
        type: 'Encoder-Decoder',
        accuracy: 91.3,
        latency: 320,
        memoryUsage: 6.4,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['Summarization', 'Abstractive', 'Research-Proven'],
        description: 'Specialized model for high-quality abstractive text summarization'
      },
      {
        name: 'T5-Base',
        type: 'Text-to-Text Transfer',
        accuracy: 88.9,
        latency: 280,
        memoryUsage: 4.8,
        cost: 'Low',
        scalability: 'High',
        tags: ['Versatile', 'Text-to-Text', 'Efficient'],
        description: 'Versatile text-to-text model adaptable to various summarization tasks'
      }
    ],
    Extraction: [
      {
        name: 'BERT-Base-NER',
        type: 'Named Entity Recognition',
        accuracy: 94.2,
        latency: 85,
        memoryUsage: 2.1,
        cost: 'Low',
        scalability: 'High',
        tags: ['NER', 'Fast', 'Accurate'],
        description: 'Optimized BERT model for named entity recognition and information extraction'
      },
      {
        name: 'RoBERTa-Large',
        type: 'Robust BERT',
        accuracy: 96.1,
        latency: 180,
        memoryUsage: 5.2,
        cost: 'Medium',
        scalability: 'Medium',
        tags: ['High-Accuracy', 'Robust', 'Research-Grade'],
        description: 'Enhanced BERT variant with superior performance on extraction tasks'
      }
    ]
  }
};

// Cost calculation functions based on industry standards
export const calculateTrainingCost = (
  modelSize: 'Small' | 'Medium' | 'Large',
  datasetSize: number,
  budgetLevel: 'Low' | 'Moderate' | 'High'
): { gpuCount: number; trainingTime: string; monthlyCost: string; inferenceCost: string } => {
  const baseCosts = {
    Small: { gpu: 1, hours: 4, costPerHour: 2.5 },
    Medium: { gpu: 2, hours: 12, costPerHour: 5.0 },
    Large: { gpu: 4, hours: 48, costPerHour: 10.0 }
  };

  const budgetMultipliers = {
    Low: 0.7,
    Moderate: 1.0,
    High: 1.5
  };

  const datasetMultiplier = Math.log10(datasetSize / 1000) + 1;
  const budgetMultiplier = budgetMultipliers[budgetLevel];
  
  const config = baseCosts[modelSize];
  const adjustedHours = Math.ceil(config.hours * datasetMultiplier);
  const adjustedGpuCount = Math.ceil(config.gpu * budgetMultiplier);
  const totalCost = adjustedHours * config.costPerHour * adjustedGpuCount;

  return {
    gpuCount: adjustedGpuCount,
    trainingTime: adjustedHours < 24 ? `${adjustedHours} hours` : `${Math.ceil(adjustedHours / 24)} days`,
    monthlyCost: `$${Math.ceil(totalCost * 30)}`,
    inferenceCost: `$${(config.costPerHour * 0.1).toFixed(3)}/1K requests`
  };
};

// Finetuning strategy templates
export const FINETUNING_STRATEGIES = {
  'Full Finetuning': {
    hyperparameters: {
      learningRate: 0.0001,
      batchSize: 16,
      epochs: 10,
      warmupSteps: 500,
      weightDecay: 0.01
    },
    riskNotes: [
      'Requires significant computational resources',
      'Risk of catastrophic forgetting',
      'Longer training time and higher costs'
    ]
  },
  'LoRA': {
    hyperparameters: {
      rank: 16,
      alpha: 32,
      dropout: 0.1,
      learningRate: 0.0003,
      batchSize: 32
    },
    riskNotes: [
      'May not capture all task-specific nuances',
      'Performance slightly lower than full finetuning',
      'Requires careful rank selection'
    ]
  },
  'Adapters': {
    hyperparameters: {
      adapterSize: 64,
      learningRate: 0.0005,
      batchSize: 32,
      epochs: 15,
      dropout: 0.2
    },
    riskNotes: [
      'Limited to specific model architectures',
      'May introduce latency overhead',
      'Requires adapter-compatible frameworks'
    ]
  },
  'No Finetuning': {
    hyperparameters: {
      promptTemplate: 'task-specific',
      fewShotExamples: 5,
      temperature: 0.7,
      maxTokens: 512
    },
    riskNotes: [
      'Performance may be suboptimal for specialized tasks',
      'Heavily dependent on prompt engineering',
      'Limited customization capabilities'
    ]
  }
};

// Generate realistic rationale explanations
export const generateRationale = (
  selectedModel: { name: string; latency: number; memoryUsage: number; accuracy: number; cost: string; scalability: string },
  formData: AppFormData,
  strategy: keyof typeof FINETUNING_STRATEGIES
): DecisionRationale => {
  const { projectDetails, dataset, constraints } = formData;
  
  return {
    constraintFit: [
      `Model latency of ${selectedModel.latency}ms meets requirement of ${constraints.latencyRequirement || 'flexible'}ms`,
      `Memory usage of ${selectedModel.memoryUsage}GB fits within ${constraints.memoryLimit || 'flexible'}GB limit`,
      `Expected accuracy of ${selectedModel.accuracy}% aligns with target of ${constraints.targetAccuracy || constraints.accuracyTarget || 90}%`,
      `${selectedModel.cost} cost model matches ${constraints.budgetLevel} budget constraints`
    ],
    tradeoffs: [
      strategy === 'Full Finetuning' 
        ? 'Higher accuracy but increased training time and cost'
        : 'Faster training with slightly reduced customization capability',
      `${projectDetails.deploymentPlatform} deployment optimized for ${selectedModel.scalability.toLowerCase()} scalability`,
      `${dataset?.format || 'Mixed'} format compatibility ensures seamless integration`
    ],
    risks: [
      dataset?.labelQuality === 'Low' ? 'Low label quality may impact model performance' : 'High-quality labels support reliable training',
      (dataset?.size || 0) < 1000 ? 'Small dataset size may lead to overfitting' : 'Adequate dataset size for robust training',
      projectDetails.deploymentPlatform === 'Edge Device' ? 'Edge deployment requires careful optimization' : 'Cloud deployment provides flexibility'
    ],
    assumptions: [
      `${dataset?.format || 'Mixed'} data is preprocessed and cleaned`,
      `${projectDetails.deploymentPlatform} infrastructure supports model requirements`,
      'Training data is representative of production workload',
      'Model performance metrics are measured on held-out test set'
    ]
  };
};

// Recommendation engine logic
export const generateRecommendation = (formData: AppFormData): RecommendationResult => {
  const { projectDetails, dataset, constraints } = formData;
  
  // Get available models for the use case and task type
  let availableModels: ModelSpec[] = [];
  
  if (projectDetails.useCaseType === 'CV') {
    const cvModels = MODEL_DATABASE.CV[projectDetails.taskType as keyof typeof MODEL_DATABASE.CV];
    availableModels = cvModels || [];
  } else if (projectDetails.useCaseType === 'LLM') {
    const llmModels = MODEL_DATABASE.LLM[projectDetails.taskType as keyof typeof MODEL_DATABASE.LLM];
    availableModels = llmModels || [];
  }
  
  if (availableModels.length === 0) {
    throw new Error(`No models available for ${projectDetails.useCaseType} - ${projectDetails.taskType}`);
  }

  // Score models based on constraints
  const scoredModels = availableModels.map((model: ModelSpec) => {
    let score = 0;
    
    // Accuracy alignment (30% weight)
    const targetAccuracy = constraints.targetAccuracy || constraints.accuracyTarget || 90;
    const accuracyDiff = Math.abs(model.accuracy - targetAccuracy);
    score += (100 - accuracyDiff) * 0.3;
    
    // Latency alignment (25% weight)
    const latencyRequirement = constraints.latencyRequirement || 1000;
    const latencyFit = model.latency <= latencyRequirement ? 100 : 
                      Math.max(0, 100 - ((model.latency - latencyRequirement) / latencyRequirement * 100));
    score += latencyFit * 0.25;
    
    // Memory alignment (20% weight)
    const memoryLimit = constraints.memoryLimit || 16;
    const memoryFit = model.memoryUsage <= memoryLimit ? 100 :
                     Math.max(0, 100 - ((model.memoryUsage - memoryLimit) / memoryLimit * 100));
    score += memoryFit * 0.2;
    
    // Budget alignment (15% weight)
    const budgetScore = getBudgetScore(model.cost, constraints.budgetLevel);
    score += budgetScore * 0.15;
    
    // Deployment environment fit (10% weight)
    const deploymentScore = getDeploymentScore(model, projectDetails.deploymentPlatform);
    score += deploymentScore * 0.1;
    
    return { ...model, score: Math.round(score) };
  });

  // Sort by score and select top model
  scoredModels.sort((a: ModelSpec & { score: number }, b: ModelSpec & { score: number }) => b.score - a.score);
  const selectedModel = scoredModels[0];
  
  // Determine finetuning strategy
  const strategy = selectFinetuningStrategy(dataset, constraints);
  
  // Calculate compute estimates
  const modelSize = getModelSize(selectedModel);
  const computeEstimate = calculateTrainingCost(modelSize, dataset?.size || 1000, constraints.budgetLevel);
  
  // Generate alternatives table
  const alternatives: AlternativeModel[] = scoredModels.slice(0, 5).map((model: ModelSpec & { score: number }, index: number) => ({
    rank: index + 1,
    name: model.name,
    performanceScore: model.score,
    latency: model.latency,
    cost: model.cost,
    scalability: model.scalability
  }));
  
  // Generate rationale
  const rationale = generateRationale(selectedModel, formData, strategy);
  
  // Create mock architecture recommendation
  const architecture: ArchitectureRecommendation = {
    components: [
      {
        name: 'API Gateway',
        type: 'gateway',
        description: 'Load balancing and request routing',
        connections: ['Model Endpoint']
      },
      {
        name: 'Model Endpoint',
        type: 'endpoint',
        description: `${selectedModel.name} inference service`,
        connections: ['Storage', 'Monitoring']
      },
      {
        name: 'Storage',
        type: 'storage',
        description: 'Model artifacts and data storage',
        connections: []
      },
      {
        name: 'Monitoring',
        type: 'monitoring',
        description: 'Performance and health monitoring',
        connections: []
      }
    ],
    scalabilityNotes: [
      'Auto-scaling based on request volume',
      'Load balancing across multiple instances',
      'Caching for frequently requested predictions'
    ],
    securityNotes: [
      'API authentication and authorization',
      'Data encryption in transit and at rest',
      'Network security groups and VPC isolation'
    ],
    costImplications: [
      'Pay-per-use pricing model available',
      'Reserved instances for predictable workloads',
      'Storage costs scale with data volume'
    ]
  };

  // Create mock risk analysis
  const riskAnalysis: RiskAnalysis = {
    accuracyRisk: selectedModel.accuracy < 90 ? 0.3 : 0.1,
    costRisk: constraints.budgetLevel === 'Low' ? 0.4 : 0.2,
    latencyRisk: selectedModel.latency > (constraints.latencyRequirement || 1000) ? 0.5 : 0.1,
    scalabilityRisk: selectedModel.scalability === 'Low' ? 0.6 : 0.2,
    maintenanceRisk: 0.3,
    notes: {
      accuracy: 'Model performance may vary with production data',
      cost: 'Costs may increase with scale and usage',
      latency: 'Network latency may affect response times',
      scalability: 'Scaling limitations may impact peak performance',
      maintenance: 'Regular model updates and monitoring required'
    }
  };

  // Create mock cost breakdown
  const costBreakdown: CostBreakdown = {
    monthlyTrainingCost: parseInt(computeEstimate.monthlyCost),
    monthlyInferenceCost: 500,
    storageCost: 100,
    totalMonthlyCost: parseInt(computeEstimate.monthlyCost) + 600,
    annualProjection: (parseInt(computeEstimate.monthlyCost) + 600) * 12,
    breakdown: [
      { category: 'Training', amount: parseInt(computeEstimate.monthlyCost), percentage: 60 },
      { category: 'Inference', amount: 500, percentage: 30 },
      { category: 'Storage', amount: 100, percentage: 10 }
    ],
    savingsSuggestions: [
      'Use spot instances for training workloads',
      'Implement model caching to reduce inference costs',
      'Archive old training data to cheaper storage tiers'
    ]
  };

  // Create mock instance recommendations
  const instanceRecommendations: InstanceRecommendation[] = [
    {
      instanceType: 'ml.g4dn.xlarge',
      gpuType: 'NVIDIA T4',
      vCPU: 4,
      memory: '16 GB',
      hourlyCost: 0.526,
      spotPrice: 0.158,
      provider: 'AWS'
    },
    {
      instanceType: 'ml.p3.2xlarge',
      gpuType: 'NVIDIA V100',
      vCPU: 8,
      memory: '61 GB',
      hourlyCost: 3.06,
      spotPrice: 0.918,
      provider: 'AWS'
    }
  ];
  
  // Create configuration export
  const configuration: Record<string, string | number | boolean | string[]> = {
    model: selectedModel.name,
    task: projectDetails.taskType,
    useCase: projectDetails.useCaseType,
    deployment: projectDetails.deploymentPlatform,
    finetuningStrategy: strategy,
    datasetSize: dataset?.size || 1000,
    datasetFormat: dataset?.format || 'Mixed',
    targetAccuracy: constraints.targetAccuracy || constraints.accuracyTarget || 90,
    latencyRequirement: constraints.latencyRequirement || 1000,
    budgetLevel: constraints.budgetLevel,
    memoryLimit: constraints.memoryLimit || 16,
    estimatedCost: computeEstimate.monthlyCost,
    trainingTime: computeEstimate.trainingTime,
    // Flatten hyperparameters for compatibility
    ...Object.fromEntries(
      Object.entries(FINETUNING_STRATEGIES[strategy].hyperparameters).map(([key, value]) => [
        `hyperparameter_${key}`, 
        typeof value === 'object' ? JSON.stringify(value) : value
      ])
    )
  };

  // Generate architecture pipeline and API specification
  const architecturePipeline = generateArchitecturePipeline(formData, selectedModel.name);
  const apiSpecification = generateAPISpecification(formData, selectedModel.name);

  return {
    recommendedModel: {
      name: selectedModel.name,
      type: selectedModel.type,
      rationale: selectedModel.description,
      tags: selectedModel.tags
    },
    alternatives,
    finetuningStrategy: {
      approach: strategy,
      hyperparameters: FINETUNING_STRATEGIES[strategy].hyperparameters,
      riskNotes: FINETUNING_STRATEGIES[strategy].riskNotes
    },
    computeEstimate,
    rationale,
    architecture,
    riskAnalysis,
    costBreakdown,
    instanceRecommendations,
    configuration,
    architecturePipeline,
    apiSpecification
  };
};

// Helper functions for scoring
const getBudgetScore = (modelCost: string, budgetLevel: string): number => {
  const costLevels = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
  const budgetLevels = { 'Low': 2, 'Moderate': 3, 'High': 4 };
  
  const modelCostLevel = costLevels[modelCost as keyof typeof costLevels] || 3;
  const userBudgetLevel = budgetLevels[budgetLevel as keyof typeof budgetLevels] || 3;
  
  return modelCostLevel <= userBudgetLevel ? 100 : Math.max(0, 100 - (modelCostLevel - userBudgetLevel) * 25);
};

const getDeploymentScore = (model: { memoryUsage: number; latency: number; scalability: string }, deployment: string): number => {
  if (deployment === 'Edge Device') {
    return model.memoryUsage < 2 && model.latency < 50 ? 100 : 50;
  } else if (deployment.includes('Cloud') || deployment.includes('AWS') || deployment.includes('Azure') || deployment.includes('GCP')) {
    return model.scalability === 'High' || model.scalability === 'Very High' ? 100 : 75;
  } else { // On-Prem or other
    return 85; // Neutral score for other deployment types
  }
};

const getModelSize = (model: { memoryUsage: number }): 'Small' | 'Medium' | 'Large' => {
  if (model.memoryUsage < 2) return 'Small';
  if (model.memoryUsage < 5) return 'Medium';
  return 'Large';
};

const selectFinetuningStrategy = (
  dataset: DatasetInfo | undefined, 
  constraints: { budgetLevel: string; latencyRequirement?: number }
): keyof typeof FINETUNING_STRATEGIES => {
  const datasetSize = dataset?.size || 1000;
  const latencyRequirement = constraints.latencyRequirement || 1000;
  
  // Decision logic for finetuning strategy
  if (datasetSize < 1000) {
    return 'No Finetuning'; // Too small for effective finetuning
  } else if (constraints.budgetLevel === 'Low' || latencyRequirement < 100) {
    return 'LoRA'; // Budget or latency constrained
  } else if (datasetSize > 10000 && constraints.budgetLevel === 'High') {
    return 'Full Finetuning'; // Large dataset with high budget
  } else {
    return 'Adapters'; // Balanced approach
  }
};

// Export utility for generating mock data on demand
export const generateMockRecommendation = (formData?: Partial<AppFormData>): RecommendationResult => {
  const defaultFormData: AppFormData = {
    projectDescription: {
      description: 'Sample AI project for testing',
      generatedPipeline: []
    },
    projectDetails: {
      useCaseType: 'CV',
      taskType: 'Classification',
      deploymentPlatform: 'AWS SageMaker'
    },
    dataset: {
      size: 5000,
      format: 'Images',
      labelQuality: 'High'
    },
    constraints: {
      targetAccuracy: 90,
      latencyRequirement: 100,
      budgetLevel: 'Moderate',
      memoryLimit: 4
    },
    costSimulation: {
      trainingHoursPerMonth: 100,
      inferenceHoursPerDay: 24,
      requestsPerSecond: 10,
      storageSize: 100,
      dataTransfer: 50,
      environments: 3
    }
  };

  const mergedFormData = {
    projectDescription: { ...defaultFormData.projectDescription, ...formData?.projectDescription },
    projectDetails: { ...defaultFormData.projectDetails, ...formData?.projectDetails },
    dataset: { ...defaultFormData.dataset, ...formData?.dataset },
    constraints: { ...defaultFormData.constraints, ...formData?.constraints },
    costSimulation: { ...defaultFormData.costSimulation, ...formData?.costSimulation }
  };

  return generateRecommendation(mergedFormData);
};