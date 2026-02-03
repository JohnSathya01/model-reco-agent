// AI Copilot Mock Intelligence Engine
import type { ProposedChange, ChangeDetail, CopilotContextData } from '../types/copilot';
import type { FormData, RecommendationResult } from '../types';

export interface CopilotResponse {
  message: string;
  proposedChanges?: ProposedChange[];
}

// Mock AI responses based on context and user input
export function generateCopilotResponse(
  userMessage: string,
  context: CopilotContextData
): CopilotResponse {
  const lowerMessage = userMessage.toLowerCase();
  
  // Cost reduction queries
  if (lowerMessage.includes('reduce cost') || lowerMessage.includes('cheaper') || lowerMessage.includes('save money')) {
    return handleCostReduction(context);
  }
  
  // Deployment changes
  if (lowerMessage.includes('ecs') || lowerMessage.includes('deployment')) {
    return handleDeploymentChange(context);
  }
  
  // API requests
  if (lowerMessage.includes('api') || lowerMessage.includes('rest') || lowerMessage.includes('endpoint')) {
    return handleAPIRequest(context);
  }
  
  // Instance type changes
  if (lowerMessage.includes('instance') || lowerMessage.includes('gpu')) {
    return handleInstanceChange(context);
  }
  
  // Model changes
  if (lowerMessage.includes('model') || lowerMessage.includes('switch')) {
    return handleModelChange(context);
  }
  
  // Latency optimization
  if (lowerMessage.includes('latency') || lowerMessage.includes('faster') || lowerMessage.includes('speed')) {
    return handleLatencyOptimization(context);
  }
  
  // Spot instances
  if (lowerMessage.includes('spot')) {
    return handleSpotInstances(context);
  }
  
  // General context-aware response
  return handleGeneralQuery(userMessage, context);
}

function handleCostReduction(context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'Instance Type',
      from: 'ml.p3.2xlarge (On-Demand)',
      to: 'ml.g4dn.xlarge (Spot)',
      icon: '💰'
    },
    {
      field: 'Training Strategy',
      from: 'Full Finetuning',
      to: 'LoRA (Low-Rank Adaptation)',
      icon: '⚡'
    },
    {
      field: 'Deployment',
      from: 'SageMaker Endpoint (Always-On)',
      to: 'SageMaker Serverless',
      icon: '☁️'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'cost',
    description: 'Cost optimization strategy',
    impact: {
      cost: '↓ 42% ($1,240 → $720/month)',
      latency: '↑ 15ms (acceptable range)',
      complexity: 'Low',
    },
    changes
  };

  return {
    message: `I've reviewed your current configuration and have some suggestions for cost optimization:\n\n**Potential Approaches:**\n\nOne option would be to switch training to Spot instances, which could save approximately 60% on compute costs. The trade-off is that Spot instances may occasionally be interrupted, though this can be mitigated with checkpointing.\n\nAnother possibility is using LoRA instead of full finetuning. This approach typically reduces training time by about 70% while maintaining comparable model quality.\n\nFor deployment, you might consider SageMaker Serverless for variable workloads. This could reduce costs during low-traffic periods, though there would be a cold start delay of 2-3 seconds for the first request.\n\n**Overall Impact:**\nThese changes together could reduce monthly costs by approximately 42% while keeping latency within acceptable ranges for your ${context.formData?.projectDetails?.taskType || 'use case'}.`,
    proposedChanges: [proposedChange]
  };
}

function handleDeploymentChange(_context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'Deployment Target',
      from: 'SageMaker Endpoint',
      to: 'ECS Fargate with ALB',
      icon: '🚀'
    },
    {
      field: 'Load Balancer',
      from: 'None',
      to: 'Application Load Balancer',
      icon: '⚖️'
    },
    {
      field: 'API Gateway',
      from: 'Direct Integration',
      to: 'API Gateway → ALB → ECS',
      icon: '🔌'
    },
    {
      field: 'Auto-scaling',
      from: 'SageMaker Auto-scaling',
      to: 'ECS Service Auto-scaling',
      icon: '📈'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'deployment',
    description: 'Switch from SageMaker to ECS deployment',
    impact: {
      cost: '↓ 18% (more resource control)',
      latency: '↑ 10ms (ALB overhead)',
      complexity: 'Medium',
      scalability: 'Improved'
    },
    changes
  };

  return {
    message: `Regarding deployment options, there are a few approaches worth considering:\n\n**ECS Deployment:**\nOne alternative would be deploying on ECS Fargate instead of SageMaker endpoints. This approach could provide more flexibility and potentially reduce costs by about 18%.\n\n**Considerations:**\n- You would have more control over container configuration\n- Better integration if you already use ECS infrastructure\n- Easier to implement custom monitoring and logging\n- Requires managing Docker containers and model serving logic\n- The Application Load Balancer would add approximately 10ms latency\n\n**Architecture:**\nThe flow would be: Client → API Gateway → ALB → ECS Fargate → Response\n\nThis approach tends to work well for teams with existing ECS expertise who want more control over their deployment.`,
    proposedChanges: [proposedChange]
  };
}

function handleAPIRequest(_context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'API Gateway',
      from: 'None',
      to: 'AWS API Gateway (REST)',
      icon: '🔌'
    },
    {
      field: 'Authentication',
      from: 'None',
      to: 'API Key + IAM',
      icon: '🔐'
    },
    {
      field: 'Rate Limiting',
      from: 'None',
      to: '1000 req/sec per key',
      icon: '⏱️'
    },
    {
      field: 'Monitoring',
      from: 'Basic CloudWatch',
      to: 'API Gateway Metrics + X-Ray',
      icon: '📊'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'api',
    description: 'Add REST API with authentication',
    impact: {
      cost: '↑ $50/month (API Gateway)',
      latency: '↑ 5ms (gateway overhead)',
      complexity: 'Low',
    },
    changes
  };

  return {
    message: `For API configuration, here are some options to consider:\n\n**REST API Setup:**\nYou could set up AWS API Gateway with a REST API structure. This would provide a production-ready interface with built-in features.\n\n**Authentication Options:**\nAPI Key authentication combined with IAM would offer a good balance of security and ease of use. Keys could be rotated every 90 days as a best practice.\n\n**Rate Limiting:**\nSetting a limit of 1000 requests per second per API key would help protect against abuse while allowing legitimate traffic.\n\n**Monitoring:**\nAPI Gateway metrics combined with X-Ray tracing would give you visibility into request patterns and performance.\n\n**Cost Consideration:**\nThis setup would add approximately $50 per month for the API Gateway service, with minimal latency overhead (around 5ms).`,
    proposedChanges: [proposedChange]
  };
}

function handleInstanceChange(_context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'Training Instance',
      from: 'ml.p3.2xlarge (V100)',
      to: 'ml.g5.2xlarge (A10G)',
      icon: '🖥️'
    },
    {
      field: 'Inference Instance',
      from: 'ml.m5.xlarge',
      to: 'ml.g4dn.xlarge (T4)',
      icon: '⚡'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'instance',
    description: 'Upgrade to newer GPU instances',
    impact: {
      cost: '-15% (better price/performance)',
      latency: '-25% (faster inference)',
      complexity: 'None (drop-in replacement)',
    },
    changes
  };

  return {
    message: `I recommend upgrading to newer generation GPU instances for better performance and cost efficiency:\n\n**Training:**\n- ml.g5.2xlarge with NVIDIA A10G GPU\n- 24GB GPU memory (vs 16GB on V100)\n- Better FP16/INT8 performance\n- 15% cheaper than P3 instances\n\n**Inference:**\n- ml.g4dn.xlarge with NVIDIA T4\n- Optimized for inference workloads\n- Supports TensorRT acceleration\n- 40% cheaper than M5 + better latency\n\nThese newer instances provide better price/performance for modern deep learning workloads.`,
    proposedChanges: [proposedChange]
  };
}

function handleModelChange(context: CopilotContextData): CopilotResponse {
  const currentModel = context.recommendations?.recommendedModel?.name || 'Current Model';
  
  const changes: ChangeDetail[] = [
    {
      field: 'Model',
      from: currentModel,
      to: 'YOLOv8-Medium',
      icon: '🤖'
    },
    {
      field: 'Parameters',
      from: '25M',
      to: '50M',
      icon: '📊'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'model',
    description: 'Switch to YOLOv8-Medium',
    impact: {
      accuracy: '+5% mAP',
      latency: '+8ms',
      cost: '+$120/month (larger model)',
    },
    changes
  };

  return {
    message: `Based on your requirements, YOLOv8-Medium offers a better accuracy/speed trade-off:\n\n**Performance Improvements:**\n- +5% mAP on COCO dataset\n- Better small object detection\n- Improved generalization\n\n**Trade-offs:**\n- Slightly higher latency (+8ms)\n- Requires more GPU memory\n- Longer training time\n\nThis model is ideal if accuracy is more important than the absolute lowest latency.`,
    proposedChanges: [proposedChange]
  };
}

function handleLatencyOptimization(_context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'Model Optimization',
      from: 'FP32',
      to: 'TensorRT INT8',
      icon: '⚡'
    },
    {
      field: 'Batch Size',
      from: '1',
      to: 'Dynamic (1-8)',
      icon: '📦'
    },
    {
      field: 'Caching',
      from: 'None',
      to: 'Redis Cache',
      icon: '💾'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'pipeline',
    description: 'Latency optimization strategy',
    impact: {
      latency: '-60% (50ms → 20ms)',
      accuracy: '-1% (minimal)',
      cost: '+$30/month (Redis)',
    },
    changes
  };

  return {
    message: `I can significantly reduce latency with these optimizations:\n\n**Model Optimization:**\n- Convert to TensorRT INT8 quantization\n- 3-4x faster inference\n- Minimal accuracy loss (<1%)\n\n**Infrastructure:**\n- Enable dynamic batching (process multiple requests together)\n- Add Redis cache for common requests\n- Use GPU instances for inference\n\n**Expected Results:**\n- Latency: 50ms → 20ms (60% reduction)\n- Throughput: 20 → 80 requests/sec\n- Cost increase: ~$30/month for caching\n\nThis is ideal for latency-sensitive applications.`,
    proposedChanges: [proposedChange]
  };
}

function handleSpotInstances(_context: CopilotContextData): CopilotResponse {
  const changes: ChangeDetail[] = [
    {
      field: 'Training Instances',
      from: 'On-Demand',
      to: 'Spot Instances',
      icon: '💰'
    },
    {
      field: 'Checkpointing',
      from: 'Every 10 epochs',
      to: 'Every epoch + on interruption',
      icon: '💾'
    },
    {
      field: 'Retry Logic',
      from: 'None',
      to: 'Auto-retry with fallback',
      icon: '🔄'
    }
  ];

  const proposedChange: ProposedChange = {
    id: `change-${Date.now()}`,
    type: 'cost',
    description: 'Enable Spot instances for training',
    impact: {
      cost: '-70% on training',
      complexity: 'Medium (requires checkpointing)',
    },
    changes
  };

  return {
    message: `Spot instances can dramatically reduce training costs:\n\n**Cost Savings:**\n- 70% discount vs On-Demand\n- Training cost: $800 → $240/month\n\n**Implementation:**\n- Frequent checkpointing (every epoch)\n- Automatic retry on interruption\n- Fallback to On-Demand if needed\n- SageMaker managed spot training\n\n**Considerations:**\n- Training may take 10-20% longer due to interruptions\n- Not suitable for time-critical training\n- Works best for jobs >1 hour\n\nFor your use case, this is a great way to reduce costs without significant downsides.`,
    proposedChanges: [proposedChange]
  };
}

function handleGeneralQuery(_userMessage: string, context: CopilotContextData): CopilotResponse {
  const { activeTab, recommendations } = context;
  
  let contextInfo = '';
  
  switch (activeTab) {
    case 'overview':
      contextInfo = recommendations 
        ? `I can see you're reviewing the ${recommendations.recommendedModel?.name} recommendation. I'm here to help with any questions or suggest optimizations.`
        : 'Once you generate recommendations, I can help you understand and optimize your configuration.';
      break;
    case 'pipeline':
      contextInfo = 'I can help you understand the ML pipeline stages or suggest modifications to the deployment, training, or inference configuration.';
      break;
    case 'analysis':
      contextInfo = 'I can provide suggestions for optimizing costs, mitigating risks, or improving the overall architecture.';
      break;
    case 'api':
      contextInfo = 'I can suggest improvements to the API configuration, authentication setup, or integration patterns.';
      break;
    case 'activity':
      contextInfo = 'I can help explain past decisions or provide context about previous changes.';
      break;
  }
  
  return {
    message: `${contextInfo}\n\n**Areas I Can Help With:**\n\n**Cost Optimization:**\nI can suggest ways to reduce costs, such as using Spot instances or adjusting deployment strategies.\n\n**Performance Tuning:**\nI can provide options for improving latency or throughput.\n\n**Deployment Strategies:**\nI can discuss different deployment approaches and their trade-offs.\n\n**Model Selection:**\nI can help you understand alternative models or configurations.\n\nWhat would you like to explore?`
  };
}

// Apply changes to form data and recommendations
export function applyChanges(
  change: ProposedChange,
  formData: FormData | null,
  recommendations: RecommendationResult | null
): { formData: FormData | null; recommendations: RecommendationResult | null; summary: string } {
  // This is a mock implementation - in a real app, this would update the actual state
  let summary = '';
  
  switch (change.type) {
    case 'cost':
      summary = 'Updated cost optimization settings';
      break;
    case 'deployment':
      summary = 'Changed deployment architecture';
      break;
    case 'api':
      summary = 'Updated API configuration';
      break;
    case 'instance':
      summary = 'Changed instance types';
      break;
    case 'model':
      summary = 'Switched model selection';
      break;
    case 'pipeline':
      summary = 'Optimized pipeline configuration';
      break;
    default:
      summary = 'Applied changes';
  }
  
  return {
    formData,
    recommendations,
    summary
  };
}
