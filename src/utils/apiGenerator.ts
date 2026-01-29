import type { FormData } from '../types';

export interface APIEndpoint {
  method: 'POST' | 'GET';
  path: string;
  description: string;
  authentication: string;
  rateLimit: string;
  sla: {
    latency: string;
    availability: string;
    throughput: string;
  };
  request: {
    contentType: string;
    schema: Record<string, any>;
    example: Record<string, any>;
  };
  response: {
    contentType: string;
    schema: Record<string, any>;
    example: Record<string, any>;
  };
}

export interface APIFlow {
  steps: Array<{
    name: string;
    description: string;
    latency: string;
  }>;
}

export interface APISpecification {
  baseUrl: string;
  version: string;
  endpoints: APIEndpoint[];
  flow: APIFlow;
}

export function generateAPISpecification(formData: FormData, modelName?: string): APISpecification {
  const useCaseType = formData.projectDetails.useCaseType;
  const taskType = formData.projectDetails.taskType;
  const platform = formData.projectDetails.deploymentPlatform;
  
  const isCV = useCaseType === 'CV';
  const isLLM = useCaseType === 'LLM';

  // Determine base URL based on platform
  let baseUrl = 'https://api.example.com/v1';
  if (platform.includes('AWS')) {
    baseUrl = 'https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod';
  } else if (platform.includes('Azure')) {
    baseUrl = 'https://your-endpoint.azurewebsites.net/api';
  } else if (platform.includes('GCP')) {
    baseUrl = 'https://your-project.uc.r.appspot.com/v1';
  }

  const endpoints: APIEndpoint[] = [];

  if (isCV) {
    // Computer Vision Endpoint
    endpoints.push({
      method: 'POST',
      path: '/predict',
      description: `Perform ${taskType} on uploaded images`,
      authentication: 'API Key (X-API-Key header)',
      rateLimit: '1000 requests/minute',
      sla: {
        latency: 'p95 < 200ms',
        availability: '99.9%',
        throughput: '10,000 requests/second'
      },
      request: {
        contentType: 'multipart/form-data',
        schema: {
          type: 'object',
          required: ['image'],
          properties: {
            image: {
              type: 'string',
              format: 'binary',
              description: 'Image file (JPEG, PNG)'
            },
            confidence_threshold: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              default: 0.5,
              description: 'Minimum confidence score for predictions'
            },
            return_visualization: {
              type: 'boolean',
              default: false,
              description: 'Return annotated image with predictions'
            }
          }
        },
        example: {
          image: '<binary data>',
          confidence_threshold: 0.7,
          return_visualization: true
        }
      },
      response: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            request_id: {
              type: 'string',
              description: 'Unique request identifier'
            },
            model_version: {
              type: 'string',
              description: 'Model version used for inference'
            },
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  class: { type: 'string' },
                  confidence: { type: 'number' },
                  bounding_box: {
                    type: 'object',
                    properties: {
                      x: { type: 'number' },
                      y: { type: 'number' },
                      width: { type: 'number' },
                      height: { type: 'number' }
                    }
                  }
                }
              }
            },
            inference_time_ms: {
              type: 'number',
              description: 'Time taken for inference in milliseconds'
            },
            visualization_url: {
              type: 'string',
              description: 'URL to annotated image (if requested)'
            }
          }
        },
        example: {
          request_id: 'req_abc123xyz',
          model_version: modelName || 'yolov8-v1.2.0',
          predictions: [
            {
              class: 'damaged_pole',
              confidence: 0.92,
              bounding_box: {
                x: 120,
                y: 80,
                width: 200,
                height: 350
              }
            },
            {
              class: 'damaged_pole',
              confidence: 0.87,
              bounding_box: {
                x: 450,
                y: 100,
                width: 180,
                height: 320
              }
            }
          ],
          inference_time_ms: 45,
          visualization_url: 'https://s3.amazonaws.com/results/req_abc123xyz.jpg'
        }
      }
    });

    // Batch endpoint
    endpoints.push({
      method: 'POST',
      path: '/batch-predict',
      description: 'Submit batch inference job for multiple images',
      authentication: 'API Key (X-API-Key header)',
      rateLimit: '100 requests/hour',
      sla: {
        latency: 'Job completion: 5-30 minutes',
        availability: '99.5%',
        throughput: '10,000 images/job'
      },
      request: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          required: ['input_location', 'output_location'],
          properties: {
            input_location: {
              type: 'string',
              description: 'S3/Blob/GCS URI containing input images'
            },
            output_location: {
              type: 'string',
              description: 'S3/Blob/GCS URI for results'
            },
            confidence_threshold: {
              type: 'number',
              default: 0.5
            }
          }
        },
        example: {
          input_location: 's3://my-bucket/input-images/',
          output_location: 's3://my-bucket/results/',
          confidence_threshold: 0.7
        }
      },
      response: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            job_id: { type: 'string' },
            status: { type: 'string', enum: ['SUBMITTED', 'RUNNING', 'COMPLETED', 'FAILED'] },
            estimated_completion_time: { type: 'string', format: 'date-time' }
          }
        },
        example: {
          job_id: 'job_xyz789',
          status: 'SUBMITTED',
          estimated_completion_time: '2025-01-29T00:15:00Z'
        }
      }
    });
  } else if (isLLM) {
    // LLM Completion Endpoint
    endpoints.push({
      method: 'POST',
      path: '/completions',
      description: 'Generate text completions using the LLM',
      authentication: 'Bearer Token (Authorization header)',
      rateLimit: '500 requests/minute',
      sla: {
        latency: 'p95 < 2000ms',
        availability: '99.9%',
        throughput: '1,000 tokens/second'
      },
      request: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: {
              type: 'string',
              description: 'Input text prompt'
            },
            max_tokens: {
              type: 'integer',
              default: 100,
              description: 'Maximum tokens to generate'
            },
            temperature: {
              type: 'number',
              minimum: 0,
              maximum: 2,
              default: 0.7,
              description: 'Sampling temperature'
            },
            top_p: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              default: 1,
              description: 'Nucleus sampling parameter'
            },
            stream: {
              type: 'boolean',
              default: false,
              description: 'Stream response tokens'
            }
          }
        },
        example: {
          prompt: 'Summarize the following legal contract:\n\n[contract text]',
          max_tokens: 500,
          temperature: 0.3,
          top_p: 0.9,
          stream: false
        }
      },
      response: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            model: { type: 'string' },
            choices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  index: { type: 'integer' },
                  finish_reason: { type: 'string' }
                }
              }
            },
            usage: {
              type: 'object',
              properties: {
                prompt_tokens: { type: 'integer' },
                completion_tokens: { type: 'integer' },
                total_tokens: { type: 'integer' }
              }
            }
          }
        },
        example: {
          id: 'cmpl_abc123',
          model: modelName || 'gpt-3.5-turbo',
          choices: [
            {
              text: 'This contract establishes an agreement between Party A and Party B for...',
              index: 0,
              finish_reason: 'stop'
            }
          ],
          usage: {
            prompt_tokens: 450,
            completion_tokens: 120,
            total_tokens: 570
          }
        }
      }
    });

    // Embeddings endpoint
    endpoints.push({
      method: 'POST',
      path: '/embeddings',
      description: 'Generate vector embeddings for text',
      authentication: 'Bearer Token (Authorization header)',
      rateLimit: '1000 requests/minute',
      sla: {
        latency: 'p95 < 500ms',
        availability: '99.9%',
        throughput: '5,000 requests/second'
      },
      request: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          required: ['input'],
          properties: {
            input: {
              type: 'string',
              description: 'Text to embed'
            },
            model: {
              type: 'string',
              default: 'text-embedding-ada-002'
            }
          }
        },
        example: {
          input: 'The quick brown fox jumps over the lazy dog',
          model: 'text-embedding-ada-002'
        }
      },
      response: {
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  embedding: {
                    type: 'array',
                    items: { type: 'number' }
                  },
                  index: { type: 'integer' }
                }
              }
            },
            model: { type: 'string' },
            usage: {
              type: 'object',
              properties: {
                prompt_tokens: { type: 'integer' },
                total_tokens: { type: 'integer' }
              }
            }
          }
        },
        example: {
          data: [
            {
              embedding: [0.002, -0.015, 0.023, /* ... 1533 more values */],
              index: 0
            }
          ],
          model: 'text-embedding-ada-002',
          usage: {
            prompt_tokens: 8,
            total_tokens: 8
          }
        }
      }
    });
  }

  // Health check endpoint (common)
  endpoints.push({
    method: 'GET',
    path: '/health',
    description: 'Check API health status',
    authentication: 'None',
    rateLimit: 'Unlimited',
    sla: {
      latency: 'p95 < 50ms',
      availability: '99.99%',
      throughput: 'Unlimited'
    },
    request: {
      contentType: 'application/json',
      schema: {},
      example: {}
    },
    response: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
          version: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      example: {
        status: 'healthy',
        version: '1.0.0',
        timestamp: '2025-01-28T23:30:00Z'
      }
    }
  });

  // Generate API flow
  const flow: APIFlow = {
    steps: [
      {
        name: 'Client Application',
        description: 'User application sends request',
        latency: '0ms'
      },
      {
        name: 'API Gateway',
        description: 'Authentication, rate limiting, routing',
        latency: '5-10ms'
      },
      {
        name: 'Load Balancer',
        description: 'Distribute traffic across endpoints',
        latency: '2-5ms'
      },
      {
        name: 'Inference Service',
        description: 'Model inference execution',
        latency: isCV ? '50-150ms' : '500-2000ms'
      },
      {
        name: 'Response',
        description: 'Return predictions to client',
        latency: '5-10ms'
      }
    ]
  };

  return {
    baseUrl,
    version: '1.0.0',
    endpoints,
    flow
  };
}
