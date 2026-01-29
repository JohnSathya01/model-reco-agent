// Form input types
export interface ProjectDetails {
  useCaseType: 'CV' | 'LLM';
  taskType: 'Classification' | 'Detection' | 'Segmentation' | 'Chat' | 'Summarization' | 'Extraction' | 'RAG' | 'Reasoning';
  deploymentPlatform: 'AWS SageMaker' | 'Azure ML' | 'GCP Vertex AI' | 'On-Prem' | 'Edge Device';
}

export interface DatasetInfo {
  size?: number;
  format?: 'Images' | 'Text' | 'Video' | 'Mixed';
  labelQuality?: 'High' | 'Medium' | 'Low';
  resolution?: string;
  augmentationLevel?: 'None' | 'Basic' | 'Advanced';
  fpsRequirement?: number;
}

export interface LLMConstraints {
  contextLength?: number;
  tokensPerRequest?: number;
  concurrentUsers?: number;
  accuracyTarget?: number;
}

export interface CVConstraints {
  targetAccuracy?: number;
  latencyRequirement?: number;
  budgetLevel: 'Low' | 'Moderate' | 'High';
  memoryLimit?: number;
}

export interface Constraints extends Partial<LLMConstraints>, Partial<CVConstraints> {
  budgetLevel: 'Low' | 'Moderate' | 'High';
}

export interface ProjectDescription {
  description: string;
  generatedPipeline?: PipelineStep[];
}

export interface PipelineStep {
  id: string;
  name: string;
  tools: string[];
  computeNeeds: string;
  riskNotes: string[];
  status: 'pending' | 'active' | 'completed';
}

export interface CostSimulation {
  trainingHoursPerMonth: number;
  inferenceHoursPerDay: number;
  requestsPerSecond: number;
  storageSize: number;
  dataTransfer: number;
  environments: number;
}

export interface FormData {
  projectDescription: ProjectDescription;
  projectDetails: ProjectDetails;
  dataset?: DatasetInfo;
  constraints: Constraints;
  costSimulation: CostSimulation;
}

// Activity log types
export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  userAction: string;
  inputSummary: string;
  recommendationSummary: string;
  costEstimate: string;
  exportStatus: 'pending' | 'completed' | 'failed';
}

// Form option types for dropdowns
export const USE_CASE_OPTIONS = ['CV', 'LLM'] as const;
export const CV_TASK_OPTIONS = ['Classification', 'Detection', 'Segmentation'] as const;
export const LLM_TASK_OPTIONS = ['Chat', 'Summarization', 'Extraction', 'RAG', 'Reasoning'] as const;
export const TASK_TYPE_OPTIONS = [...CV_TASK_OPTIONS, ...LLM_TASK_OPTIONS] as const;
export const DEPLOYMENT_PLATFORM_OPTIONS = ['AWS SageMaker', 'Azure ML', 'GCP Vertex AI', 'On-Prem', 'Edge Device'] as const;
export const DEPLOYMENT_OPTIONS = DEPLOYMENT_PLATFORM_OPTIONS;
export const FORMAT_OPTIONS = ['Images', 'Text', 'Video', 'Mixed'] as const;
export const QUALITY_OPTIONS = ['High', 'Medium', 'Low'] as const;
export const BUDGET_OPTIONS = ['Low', 'Moderate', 'High'] as const;
export const AUGMENTATION_OPTIONS = ['None', 'Basic', 'Advanced'] as const;