import { z } from 'zod';

// Project description schema
const projectDescriptionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  generatedPipeline: z.array(z.object({
    id: z.string(),
    name: z.string(),
    tools: z.array(z.string()),
    computeNeeds: z.string(),
    riskNotes: z.array(z.string()),
    status: z.enum(['pending', 'active', 'completed'])
  })).optional()
});

// Project details schema
const projectDetailsSchema = z.object({
  useCaseType: z.enum(['CV', 'LLM'], {
    message: 'Please select a use case type'
  }),
  taskType: z.enum(['Classification', 'Detection', 'Segmentation', 'Chat', 'Summarization', 'Extraction', 'RAG', 'Reasoning'], {
    message: 'Please select a task type'
  }),
  deploymentPlatform: z.enum(['AWS SageMaker', 'Azure ML', 'GCP Vertex AI', 'On-Prem', 'Edge Device'], {
    message: 'Please select a deployment platform'
  })
});

// Dataset schema (optional for LLM)
const datasetSchema = z.object({
  size: z.number().min(1, 'Dataset size must be at least 1').optional(),
  format: z.enum(['Images', 'Text', 'Video', 'Mixed']).optional(),
  labelQuality: z.enum(['High', 'Medium', 'Low']).optional(),
  resolution: z.string().optional(),
  augmentationLevel: z.enum(['None', 'Basic', 'Advanced']).optional(),
  fpsRequirement: z.number().min(1).optional()
}).optional();

// Constraints schema with conditional fields
const constraintsSchema = z.object({
  budgetLevel: z.enum(['Low', 'Moderate', 'High'], {
    message: 'Please select a budget level'
  }),
  // CV-specific fields
  targetAccuracy: z.number().min(70).max(99).optional(),
  latencyRequirement: z.number().min(1).optional(),
  memoryLimit: z.number().min(1).optional(),
  // LLM-specific fields
  contextLength: z.number().min(1).optional(),
  tokensPerRequest: z.number().min(1).optional(),
  concurrentUsers: z.number().min(1).optional(),
  accuracyTarget: z.number().min(70).max(99).optional()
});

// Cost simulation schema with conditional validation
const costSimulationSchema = z.object({
  workloadType: z.enum(['both', 'training-only', 'inference-only']),
  trainingHoursPerMonth: z.number().min(1, 'Training hours must be at least 1').optional(),
  inferenceHoursPerDay: z.number().min(1, 'Inference hours must be at least 1').optional(),
  requestsPerSecond: z.number().min(1, 'RPS must be at least 1'),
  storageSize: z.number().min(1, 'Storage size must be at least 1'),
  dataTransfer: z.number().min(0, 'Data transfer cannot be negative'),
  environments: z.number().min(1, 'Must have at least 1 environment')
}).refine((data) => {
  // If workloadType is 'both' or 'training-only', trainingHoursPerMonth is required
  if ((data.workloadType === 'both' || data.workloadType === 'training-only') && !data.trainingHoursPerMonth) {
    return false;
  }
  // If workloadType is 'both' or 'inference-only', inferenceHoursPerDay is required
  if ((data.workloadType === 'both' || data.workloadType === 'inference-only') && !data.inferenceHoursPerDay) {
    return false;
  }
  return true;
}, {
  message: 'Please provide the required hours based on your workload type',
  path: ['workloadType']
});

// Main form schema with conditional validation
export const formSchema = z.object({
  projectDescription: projectDescriptionSchema,
  projectDetails: projectDetailsSchema,
  dataset: datasetSchema,
  constraints: constraintsSchema,
  costSimulation: costSimulationSchema
}).refine((data) => {
  // CV-specific validation
  if (data.projectDetails.useCaseType === 'CV') {
    return (
      data.dataset?.size !== undefined &&
      data.dataset?.format !== undefined &&
      data.dataset?.labelQuality !== undefined &&
      data.constraints.targetAccuracy !== undefined &&
      data.constraints.latencyRequirement !== undefined &&
      data.constraints.memoryLimit !== undefined
    );
  }
  
  // LLM-specific validation
  if (data.projectDetails.useCaseType === 'LLM') {
    return (
      data.constraints.contextLength !== undefined &&
      data.constraints.tokensPerRequest !== undefined &&
      data.constraints.concurrentUsers !== undefined &&
      data.constraints.accuracyTarget !== undefined
    );
  }
  
  return true;
}, {
  message: 'Please fill in all required fields for the selected use case type'
});

// Export individual schemas for reuse
export { projectDetailsSchema, datasetSchema, constraintsSchema, costSimulationSchema };

// Type inference from schemas
export type FormSchemaType = z.infer<typeof formSchema>;
export type ProjectDetailsSchemaType = z.infer<typeof projectDetailsSchema>;
export type DatasetSchemaType = z.infer<typeof datasetSchema>;
export type ConstraintsSchemaType = z.infer<typeof constraintsSchema>;

// Validation helper functions
export const validateFormData = (data: unknown) => {
  return formSchema.safeParse(data);
};

export const validateProjectDetails = (data: unknown) => {
  return projectDetailsSchema.safeParse(data);
};

export const validateDataset = (data: unknown) => {
  return datasetSchema.safeParse(data);
};

export const validateConstraints = (data: unknown) => {
  return constraintsSchema.safeParse(data);
};