import type { FormData } from '../types';

export interface PipelineNode {
  id: string;
  type: 'service' | 'data' | 'model' | 'api' | 'monitoring';
  label: string;
  service: string;
  purpose: string;
  icon: string;
  modelName?: string;
  instanceType?: string;
  costPerHour?: string;
  vcpu?: string;
  memory?: string;
  gpu?: string;
  scalingBehavior?: string;
  risks?: string[];
  securityNotes?: string[];
  lane: 'training' | 'serving' | 'both';
}

export interface PipelineConnection {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitecturePipeline {
  nodes: PipelineNode[];
  connections: PipelineConnection[];
  deploymentType: 'cloud' | 'edge' | 'hybrid';
  inferenceType: 'realtime' | 'batch' | 'streaming';
  trainingRequired: boolean;
}

interface PipelineContext {
  description: string;
  useCaseType: 'CV' | 'LLM';
  deploymentPlatform: string;
  modelName?: string;
  taskType?: string;
}

export function generateArchitecturePipeline(
  formData: FormData,
  modelName?: string
): ArchitecturePipeline {
  const context: PipelineContext = {
    description: formData.projectDescription.description.toLowerCase(),
    useCaseType: formData.projectDetails.useCaseType,
    deploymentPlatform: formData.projectDetails.deploymentPlatform,
    modelName: modelName || 'Custom Model',
    taskType: formData.projectDetails.taskType
  };

  // Detect deployment characteristics
  const isEdge = context.description.includes('edge') || 
                 context.description.includes('device') ||
                 context.description.includes('embedded');
  
  const isRealtime = context.description.includes('real-time') || 
                     context.description.includes('realtime') ||
                     context.description.includes('low latency') ||
                     context.description.includes('sub-100ms');
  
  const needsTraining = context.description.includes('train') ||
                        context.description.includes('fine-tune') ||
                        context.description.includes('finetune') ||
                        !context.description.includes('inference only');

  const isBatch = context.description.includes('batch') ||
                  context.description.includes('offline');

  const deploymentType: 'cloud' | 'edge' | 'hybrid' = 
    isEdge ? (needsTraining ? 'hybrid' : 'edge') : 'cloud';
  
  const inferenceType: 'realtime' | 'batch' | 'streaming' = 
    isRealtime ? 'realtime' : (isBatch ? 'batch' : 'streaming');

  // Generate pipeline based on platform
  if (context.deploymentPlatform.includes('AWS')) {
    return generateAWSPipeline(context, deploymentType, inferenceType, needsTraining);
  } else if (context.deploymentPlatform.includes('Azure')) {
    return generateAzurePipeline(context, deploymentType, inferenceType, needsTraining);
  } else if (context.deploymentPlatform.includes('GCP')) {
    return generateGCPPipeline(context, deploymentType, inferenceType, needsTraining);
  } else {
    return generateAWSPipeline(context, deploymentType, inferenceType, needsTraining);
  }
}

function generateAWSPipeline(
  context: PipelineContext,
  deploymentType: 'cloud' | 'edge' | 'hybrid',
  inferenceType: 'realtime' | 'batch' | 'streaming',
  needsTraining: boolean
): ArchitecturePipeline {
  const nodes: PipelineNode[] = [];
  const connections: PipelineConnection[] = [];
  let nodeId = 0;

  // Data Ingestion
  const s3RawId = `node-${nodeId++}`;
  nodes.push({
    id: s3RawId,
    type: 'data',
    label: 'Raw Data Storage',
    service: 'Amazon S3',
    purpose: 'Store raw training data and inference inputs',
    icon: '🗄️',
    costPerHour: '$0.023/GB/month',
    lane: 'both',
    securityNotes: ['Enable encryption at rest', 'Configure bucket policies', 'Enable versioning']
  });

  if (needsTraining) {
    // Training Pipeline
    const processingId = `node-${nodeId++}`;
    nodes.push({
      id: processingId,
      type: 'service',
      label: 'Data Processing',
      service: 'SageMaker Processing',
      purpose: 'Data preprocessing and feature engineering',
      icon: '⚙️',
      instanceType: 'ml.m5.xlarge',
      vcpu: '4',
      memory: '16 GB',
      costPerHour: '$0.23/hour',
      lane: 'training',
      scalingBehavior: 'On-demand, scales to zero when idle',
      risks: ['Data quality issues', 'Processing failures']
    });
    connections.push({ from: s3RawId, to: processingId, label: 'Raw Data' });

    const trainingId = `node-${nodeId++}`;
    const isGPUIntensive = context.useCaseType === 'CV' || 
                           context.description.includes('yolo') ||
                           context.description.includes('vision');
    
    nodes.push({
      id: trainingId,
      type: 'model',
      label: 'Model Training',
      service: 'SageMaker Training',
      purpose: `Train ${context.modelName} model`,
      icon: '🧠',
      modelName: context.modelName,
      instanceType: isGPUIntensive ? 'ml.g5.xlarge' : 'ml.m5.2xlarge',
      vcpu: isGPUIntensive ? '4' : '8',
      memory: isGPUIntensive ? '16 GB' : '32 GB',
      gpu: isGPUIntensive ? 'NVIDIA A10G' : undefined,
      costPerHour: isGPUIntensive ? '$1.41/hour' : '$0.46/hour',
      lane: 'training',
      scalingBehavior: 'Spot instances available for 70% cost savings',
      risks: ['Training convergence issues', 'Overfitting', 'Resource exhaustion'],
      securityNotes: ['Use VPC endpoints', 'Enable encryption', 'IAM role restrictions']
    });
    connections.push({ from: processingId, to: trainingId, label: 'Processed Data' });

    const modelRegistryId = `node-${nodeId++}`;
    nodes.push({
      id: modelRegistryId,
      type: 'model',
      label: 'Model Registry',
      service: 'SageMaker Model Registry',
      purpose: 'Version control and model governance',
      icon: '📦',
      costPerHour: 'Included',
      lane: 'training',
      securityNotes: ['Model approval workflow', 'Audit logging']
    });
    connections.push({ from: trainingId, to: modelRegistryId, label: 'Model Artifact' });
  }

  // Serving Pipeline
  const modelArtifactId = needsTraining ? nodes[nodes.length - 1].id : `node-${nodeId++}`;
  
  if (!needsTraining) {
    nodes.push({
      id: modelArtifactId,
      type: 'model',
      label: 'Pre-trained Model',
      service: 'Amazon S3',
      purpose: 'Store pre-trained model artifacts',
      icon: '📦',
      costPerHour: '$0.023/GB/month',
      lane: 'serving'
    });
  }

  if (inferenceType === 'realtime') {
    const endpointId = `node-${nodeId++}`;
    const isGPUInference = context.useCaseType === 'CV' || 
                           context.description.includes('yolo') ||
                           context.description.includes('vision');
    
    nodes.push({
      id: endpointId,
      type: 'service',
      label: 'Real-time Endpoint',
      service: 'SageMaker Endpoint',
      purpose: 'Low-latency model inference',
      icon: '🚀',
      modelName: context.modelName,
      instanceType: isGPUInference ? 'ml.g4dn.xlarge' : 'ml.m5.large',
      vcpu: isGPUInference ? '4' : '2',
      memory: isGPUInference ? '16 GB' : '8 GB',
      gpu: isGPUInference ? 'NVIDIA T4' : undefined,
      costPerHour: isGPUInference ? '$0.736/hour' : '$0.115/hour',
      lane: 'serving',
      scalingBehavior: 'Auto-scaling based on invocations',
      risks: ['Cold start latency', 'Endpoint throttling', 'Model drift'],
      securityNotes: ['VPC endpoint', 'IAM authentication', 'Encryption in transit']
    });
    connections.push({ from: modelArtifactId, to: endpointId, label: 'Deploy Model' });

    const apiGatewayId = `node-${nodeId++}`;
    nodes.push({
      id: apiGatewayId,
      type: 'api',
      label: 'API Gateway',
      service: 'Amazon API Gateway',
      purpose: 'REST API exposure and rate limiting',
      icon: '🌐',
      costPerHour: '$3.50/million requests',
      lane: 'serving',
      scalingBehavior: 'Fully managed, auto-scales',
      securityNotes: ['API keys', 'OAuth 2.0', 'WAF integration', 'Throttling']
    });
    connections.push({ from: endpointId, to: apiGatewayId, label: 'Inference' });

    const albId = `node-${nodeId++}`;
    nodes.push({
      id: albId,
      type: 'service',
      label: 'Load Balancer',
      service: 'Application Load Balancer',
      purpose: 'Distribute traffic across endpoints',
      icon: '⚖️',
      costPerHour: '$0.0225/hour + $0.008/LCU-hour',
      lane: 'serving',
      scalingBehavior: 'Automatic load distribution',
      securityNotes: ['SSL/TLS termination', 'Security groups']
    });
    connections.push({ from: apiGatewayId, to: albId, label: 'Route' });

    const clientId = `node-${nodeId++}`;
    nodes.push({
      id: clientId,
      type: 'service',
      label: 'Client Applications',
      service: 'Web/Mobile/IoT',
      purpose: 'Consume inference API',
      icon: '📱',
      lane: 'serving'
    });
    connections.push({ from: albId, to: clientId, label: 'Response' });
  } else {
    // Batch inference
    const batchTransformId = `node-${nodeId++}`;
    nodes.push({
      id: batchTransformId,
      type: 'service',
      label: 'Batch Transform',
      service: 'SageMaker Batch Transform',
      purpose: 'Process large datasets offline',
      icon: '📊',
      instanceType: 'ml.m5.xlarge',
      vcpu: '4',
      memory: '16 GB',
      costPerHour: '$0.23/hour',
      lane: 'serving',
      scalingBehavior: 'Scales to zero when idle',
      risks: ['Long processing times', 'Data skew']
    });
    connections.push({ from: modelArtifactId, to: batchTransformId, label: 'Deploy Model' });
    connections.push({ from: s3RawId, to: batchTransformId, label: 'Input Data' });

    const s3OutputId = `node-${nodeId++}`;
    nodes.push({
      id: s3OutputId,
      type: 'data',
      label: 'Results Storage',
      service: 'Amazon S3',
      purpose: 'Store batch inference results',
      icon: '💾',
      costPerHour: '$0.023/GB/month',
      lane: 'serving'
    });
    connections.push({ from: batchTransformId, to: s3OutputId, label: 'Results' });
  }

  // Monitoring
  const cloudwatchId = `node-${nodeId++}`;
  nodes.push({
    id: cloudwatchId,
    type: 'monitoring',
    label: 'Monitoring & Logging',
    service: 'Amazon CloudWatch',
    purpose: 'Track metrics, logs, and alarms',
    icon: '📈',
    costPerHour: '$0.30/GB ingested',
    lane: 'both',
    securityNotes: ['Log retention policies', 'Metric alarms', 'Anomaly detection']
  });

  // Connect monitoring to all services
  nodes.filter(n => n.type === 'service' || n.type === 'model').forEach(n => {
    connections.push({ from: n.id, to: cloudwatchId, label: 'Metrics' });
  });

  // Edge deployment additions
  if (deploymentType === 'edge' || deploymentType === 'hybrid') {
    const edgeDeviceId = `node-${nodeId++}`;
    nodes.push({
      id: edgeDeviceId,
      type: 'service',
      label: 'Edge Devices',
      service: 'AWS IoT Greengrass',
      purpose: 'Deploy models to edge devices',
      icon: '📡',
      costPerHour: '$0.16/device/month',
      lane: 'serving',
      scalingBehavior: 'Distributed across devices',
      risks: ['Device connectivity', 'Model size constraints', 'OTA update failures'],
      securityNotes: ['Device certificates', 'Secure boot', 'Encrypted storage']
    });
    
    const lastServingNode = nodes.filter(n => n.lane === 'serving' || n.lane === 'both')
      .slice(-2)[0];
    connections.push({ from: lastServingNode.id, to: edgeDeviceId, label: 'Deploy' });
  }

  return {
    nodes,
    connections,
    deploymentType,
    inferenceType,
    trainingRequired: needsTraining
  };
}

function generateAzurePipeline(
  context: PipelineContext,
  deploymentType: 'cloud' | 'edge' | 'hybrid',
  inferenceType: 'realtime' | 'batch' | 'streaming',
  needsTraining: boolean
): ArchitecturePipeline {
  const nodes: PipelineNode[] = [];
  const connections: PipelineConnection[] = [];
  let nodeId = 0;

  // Data Storage
  const blobStorageId = `node-${nodeId++}`;
  nodes.push({
    id: blobStorageId,
    type: 'data',
    label: 'Blob Storage',
    service: 'Azure Blob Storage',
    purpose: 'Store training data and model artifacts',
    icon: '🗄️',
    costPerHour: '$0.018/GB/month',
    lane: 'both'
  });

  if (needsTraining) {
    const mlPipelineId = `node-${nodeId++}`;
    nodes.push({
      id: mlPipelineId,
      type: 'service',
      label: 'ML Pipeline',
      service: 'Azure ML Pipeline',
      purpose: 'Orchestrate training workflow',
      icon: '⚙️',
      costPerHour: 'Compute-based',
      lane: 'training'
    });
    connections.push({ from: blobStorageId, to: mlPipelineId });

    const trainingClusterId = `node-${nodeId++}`;
    nodes.push({
      id: trainingClusterId,
      type: 'model',
      label: 'Training Cluster',
      service: 'Azure ML Compute',
      purpose: `Train ${context.modelName}`,
      icon: '🧠',
      modelName: context.modelName,
      instanceType: 'Standard_NC6s_v3',
      vcpu: '6',
      memory: '112 GB',
      gpu: 'NVIDIA V100',
      costPerHour: '$3.06/hour',
      lane: 'training'
    });
    connections.push({ from: mlPipelineId, to: trainingClusterId });

    const modelRegistryId = `node-${nodeId++}`;
    nodes.push({
      id: modelRegistryId,
      type: 'model',
      label: 'Model Registry',
      service: 'Azure ML Model Registry',
      purpose: 'Version and manage models',
      icon: '📦',
      lane: 'training'
    });
    connections.push({ from: trainingClusterId, to: modelRegistryId });
  }

  // Serving
  const endpointId = `node-${nodeId++}`;
  nodes.push({
    id: endpointId,
    type: 'service',
    label: 'Managed Endpoint',
    service: 'Azure ML Endpoint',
    purpose: 'Real-time inference',
    icon: '🚀',
    instanceType: 'Standard_DS3_v2',
    vcpu: '4',
    memory: '14 GB',
    costPerHour: '$0.192/hour',
    lane: 'serving'
  });

  const apiManagementId = `node-${nodeId++}`;
  nodes.push({
    id: apiManagementId,
    type: 'api',
    label: 'API Management',
    service: 'Azure API Management',
    purpose: 'API gateway and security',
    icon: '🌐',
    costPerHour: '$0.13/hour',
    lane: 'serving'
  });
  connections.push({ from: endpointId, to: apiManagementId });

  const aksId = `node-${nodeId++}`;
  nodes.push({
    id: aksId,
    type: 'service',
    label: 'Kubernetes Service',
    service: 'Azure Kubernetes Service',
    purpose: 'Container orchestration',
    icon: '☸️',
    costPerHour: '$0.10/hour',
    lane: 'serving'
  });
  connections.push({ from: apiManagementId, to: aksId });

  const monitoringId = `node-${nodeId++}`;
  nodes.push({
    id: monitoringId,
    type: 'monitoring',
    label: 'Application Insights',
    service: 'Azure Monitor',
    purpose: 'Monitoring and diagnostics',
    icon: '📈',
    costPerHour: '$2.30/GB',
    lane: 'both'
  });

  return {
    nodes,
    connections,
    deploymentType,
    inferenceType,
    trainingRequired: needsTraining
  };
}

function generateGCPPipeline(
  context: PipelineContext,
  deploymentType: 'cloud' | 'edge' | 'hybrid',
  inferenceType: 'realtime' | 'batch' | 'streaming',
  needsTraining: boolean
): ArchitecturePipeline {
  const nodes: PipelineNode[] = [];
  const connections: PipelineConnection[] = [];
  let nodeId = 0;

  // Data Storage
  const gcsId = `node-${nodeId++}`;
  nodes.push({
    id: gcsId,
    type: 'data',
    label: 'Cloud Storage',
    service: 'Google Cloud Storage',
    purpose: 'Store data and models',
    icon: '🗄️',
    costPerHour: '$0.020/GB/month',
    lane: 'both'
  });

  if (needsTraining) {
    const vertexPipelineId = `node-${nodeId++}`;
    nodes.push({
      id: vertexPipelineId,
      type: 'service',
      label: 'Vertex AI Pipeline',
      service: 'Vertex AI Pipelines',
      purpose: 'ML workflow orchestration',
      icon: '⚙️',
      lane: 'training'
    });
    connections.push({ from: gcsId, to: vertexPipelineId });

    const trainingId = `node-${nodeId++}`;
    nodes.push({
      id: trainingId,
      type: 'model',
      label: 'Training Job',
      service: 'Vertex AI Training',
      purpose: `Train ${context.modelName}`,
      icon: '🧠',
      modelName: context.modelName,
      instanceType: 'n1-standard-8',
      vcpu: '8',
      memory: '30 GB',
      gpu: 'NVIDIA T4',
      costPerHour: '$0.35/hour + $0.35/GPU/hour',
      lane: 'training'
    });
    connections.push({ from: vertexPipelineId, to: trainingId });
  }

  const endpointId = `node-${nodeId++}`;
  nodes.push({
    id: endpointId,
    type: 'service',
    label: 'Prediction Endpoint',
    service: 'Vertex AI Endpoint',
    purpose: 'Serve predictions',
    icon: '🚀',
    instanceType: 'n1-standard-4',
    vcpu: '4',
    memory: '15 GB',
    costPerHour: '$0.19/hour',
    lane: 'serving'
  });

  const apiGatewayId = `node-${nodeId++}`;
  nodes.push({
    id: apiGatewayId,
    type: 'api',
    label: 'API Gateway',
    service: 'Cloud Endpoints',
    purpose: 'API management',
    icon: '🌐',
    costPerHour: '$3.00/million calls',
    lane: 'serving'
  });
  connections.push({ from: endpointId, to: apiGatewayId });

  const monitoringId = `node-${nodeId++}`;
  nodes.push({
    id: monitoringId,
    type: 'monitoring',
    label: 'Cloud Monitoring',
    service: 'Google Cloud Monitoring',
    purpose: 'Metrics and logging',
    icon: '📈',
    costPerHour: '$0.258/GB',
    lane: 'both'
  });

  return {
    nodes,
    connections,
    deploymentType,
    inferenceType,
    trainingRequired: needsTraining
  };
}
