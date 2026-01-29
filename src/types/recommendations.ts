// Import architecture and API types
import type { ArchitecturePipeline } from '../utils/architectureGenerator';
import type { APISpecification } from '../utils/apiGenerator';

// Recommendation output types
export interface ModelRecommendation {
  name: string;
  type: string;
  rationale: string;
  tags: string[];
}

export interface AlternativeModel {
  rank: number;
  name: string;
  performanceScore: number;
  latency: number;
  cost: string;
  scalability: string;
}

export interface FinetuningStrategy {
  approach: 'Full Finetuning' | 'LoRA' | 'Adapters' | 'No Finetuning';
  hyperparameters: Record<string, string | number | boolean>;
  riskNotes: string[];
}

export interface ComputeEstimate {
  gpuCount: number;
  trainingTime: string;
  monthlyCost: string;
  inferenceCost: string;
}

export interface DecisionRationale {
  constraintFit: string[];
  tradeoffs: string[];
  risks: string[];
  assumptions: string[];
}

export interface ArchitectureRecommendation {
  components: ArchitectureComponent[];
  scalabilityNotes: string[];
  securityNotes: string[];
  costImplications: string[];
}

export interface ArchitectureComponent {
  name: string;
  type: 'client' | 'gateway' | 'endpoint' | 'storage' | 'monitoring';
  description: string;
  connections: string[];
}

export interface RiskAnalysis {
  accuracyRisk: number;
  costRisk: number;
  latencyRisk: number;
  scalabilityRisk: number;
  maintenanceRisk: number;
  notes: Record<string, string>;
}

export interface CostBreakdown {
  monthlyTrainingCost: number;
  monthlyInferenceCost: number;
  storageCost: number;
  totalMonthlyCost: number;
  annualProjection: number;
  breakdown: CostItem[];
  savingsSuggestions: string[];
}

export interface CostItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface RecommendationResult {
  recommendedModel: ModelRecommendation;
  alternatives: AlternativeModel[];
  finetuningStrategy: FinetuningStrategy;
  computeEstimate: ComputeEstimate;
  rationale: DecisionRationale;
  architecture: ArchitectureRecommendation;
  riskAnalysis: RiskAnalysis;
  costBreakdown: CostBreakdown;
  instanceRecommendations: InstanceRecommendation[];
  configuration: Record<string, string | number | boolean | string[]>;
  architecturePipeline: ArchitecturePipeline;
  apiSpecification: APISpecification;
}

// Cloud provider types
export interface InstanceRecommendation {
  instanceType: string;
  gpuType: string;
  vCPU: number;
  memory: string;
  hourlyCost: number;
  spotPrice?: number;
  provider: string;
}

// Constants for finetuning approaches
export const FINETUNING_APPROACHES = ['Full Finetuning', 'LoRA', 'Adapters', 'No Finetuning'] as const;