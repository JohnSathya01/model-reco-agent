import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp, TrendingDown, Lock, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CostCalculatorProps {
  className?: string;
  isLocked?: boolean;
  lockStatus?: {
    isLocked: boolean;
    lockedAt?: Date;
    lockedBy?: string;
  };
}

interface ServiceCosts {
  sagemaker: number;
  ec2: number;
  ecs: number;
  s3: number;
  apiGateway: number;
  lambda: number;
  cloudwatch: number;
  dataTransfer: number;
  total: number;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ 
  className = '', 
  isLocked = false,
  lockStatus 
}) => {
  const { user } = useAuth();
  
  // Determine if user can edit based on role and lock status
  const canEdit = React.useMemo(() => {
    if (!user) return false;
    
    // Admin can always edit (even when locked, they can unlock)
    if (user.role === 'admin') return true;
    
    // If locked, only admin can edit
    if (isLocked || lockStatus?.isLocked) return false;
    
    // Solution Architect can edit when not locked
    if (user.role === 'solution-architect') return true;
    
    // All other roles cannot edit
    return false;
  }, [user, isLocked, lockStatus]);

  // Determine the reason for read-only mode
  const readOnlyReason = React.useMemo(() => {
    if (!user) return 'You must be logged in to edit';
    
    if (isLocked || lockStatus?.isLocked) {
      const lockedBy = lockStatus?.lockedBy || 'an administrator';
      const lockedAt = lockStatus?.lockedAt 
        ? new Date(lockStatus.lockedAt).toLocaleDateString() 
        : 'previously';
      return `This cost calculator is locked (locked by ${lockedBy} on ${lockedAt}). Only administrators can unlock it.`;
    }
    
    if (user.role !== 'admin' && user.role !== 'solution-architect') {
      return 'Only Solution Architects and Administrators can edit the cost calculator.';
    }
    
    return '';
  }, [user, isLocked, lockStatus]);

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['sagemaker']));

  // SageMaker parameters
  const [trainingHours, setTrainingHours] = useState(100);
  const [trainingInstanceType, setTrainingInstanceType] = useState('ml.p3.2xlarge');
  const [trainingHourlyCost, setTrainingHourlyCost] = useState(3.06);
  const [useSpotTraining, setUseSpotTraining] = useState(false);
  const [inferenceHoursPerDay, setInferenceHoursPerDay] = useState(24);
  const [inferenceInstanceType, setInferenceInstanceType] = useState('ml.m5.xlarge');
  const [inferenceHourlyCost, setInferenceHourlyCost] = useState(0.269);

  // EC2 parameters
  const [ec2Instances, setEc2Instances] = useState(2);
  const [ec2InstanceType, setEc2InstanceType] = useState('t3.medium');
  const [ec2HourlyCost, setEc2HourlyCost] = useState(0.0416);
  const [ec2HoursPerDay, setEc2HoursPerDay] = useState(24);

  // ECS parameters
  const [ecsTaskCount, setEcsTaskCount] = useState(3);
  const [ecsCpu, setEcsCpu] = useState(2);
  const [ecsMemory, setEcsMemory] = useState(4);
  const [ecsHoursPerDay, setEcsHoursPerDay] = useState(24);

  // S3 parameters
  const [s3StorageGB, setS3StorageGB] = useState(100);
  const [s3RequestsPerMonth, setS3RequestsPerMonth] = useState(10000);

  // API Gateway parameters
  const [apiRequests, setApiRequests] = useState(1000000);
  const [apiCacheEnabled, setApiCacheEnabled] = useState(false);

  // Lambda parameters
  const [lambdaInvocations, setLambdaInvocations] = useState(500000);
  const [lambdaMemoryMB, setLambdaMemoryMB] = useState(512);
  const [lambdaAvgDurationMs, setLambdaAvgDurationMs] = useState(200);

  // CloudWatch parameters
  const [cloudwatchMetrics, setCloudwatchMetrics] = useState(50);
  const [cloudwatchLogs, setCloudwatchLogs] = useState(10);

  // Data Transfer parameters
  const [dataTransferGB, setDataTransferGB] = useState(100);

  // Calculated costs
  const [costs, setCosts] = useState<ServiceCosts>({
    sagemaker: 0,
    ec2: 0,
    ecs: 0,
    s3: 0,
    apiGateway: 0,
    lambda: 0,
    cloudwatch: 0,
    dataTransfer: 0,
    total: 0
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Calculate costs
  useEffect(() => {
    // SageMaker
    const spotDiscount = useSpotTraining ? 0.3 : 1.0;
    const sagemakerTraining = trainingHours * trainingHourlyCost * spotDiscount;
    const sagemakerInference = (inferenceHoursPerDay * 30) * inferenceHourlyCost;
    const sagemakerTotal = sagemakerTraining + sagemakerInference;

    // EC2
    const ec2Total = ec2Instances * ec2HourlyCost * (ec2HoursPerDay * 30);

    // ECS Fargate
    const ecsCpuCost = ecsCpu * 0.04048; // per vCPU per hour
    const ecsMemoryCost = ecsMemory * 0.004445; // per GB per hour
    const ecsTotal = ecsTaskCount * (ecsCpuCost + ecsMemoryCost) * (ecsHoursPerDay * 30);

    // S3
    const s3Storage = s3StorageGB * 0.023;
    const s3Requests = (s3RequestsPerMonth / 1000) * 0.0004; // GET requests
    const s3Total = s3Storage + s3Requests;

    // API Gateway
    const apiCost = (apiRequests / 1000000) * 3.50;
    const apiCacheCost = apiCacheEnabled ? 0.02 * 730 : 0; // 0.5GB cache
    const apiTotal = apiCost + apiCacheCost;

    // Lambda
    const lambdaRequestCost = (lambdaInvocations / 1000000) * 0.20;
    const lambdaComputeGBSeconds = (lambdaInvocations * (lambdaMemoryMB / 1024) * (lambdaAvgDurationMs / 1000));
    const lambdaComputeCost = (lambdaComputeGBSeconds / 1000000) * 16.67;
    const lambdaTotal = lambdaRequestCost + lambdaComputeCost;

    // CloudWatch
    const cloudwatchMetricsCost = cloudwatchMetrics * 0.30;
    const cloudwatchLogsCost = cloudwatchLogs * 0.50;
    const cloudwatchTotal = cloudwatchMetricsCost + cloudwatchLogsCost;

    // Data Transfer
    const dataTransferCost = dataTransferGB * 0.09;

    const total = sagemakerTotal + ec2Total + ecsTotal + s3Total + apiTotal + lambdaTotal + cloudwatchTotal + dataTransferCost;

    setCosts({
      sagemaker: sagemakerTotal,
      ec2: ec2Total,
      ecs: ecsTotal,
      s3: s3Total,
      apiGateway: apiTotal,
      lambda: lambdaTotal,
      cloudwatch: cloudwatchTotal,
      dataTransfer: dataTransferCost,
      total
    });
  }, [
    trainingHours, trainingHourlyCost, useSpotTraining, inferenceHoursPerDay, inferenceHourlyCost,
    ec2Instances, ec2HourlyCost, ec2HoursPerDay,
    ecsTaskCount, ecsCpu, ecsMemory, ecsHoursPerDay,
    s3StorageGB, s3RequestsPerMonth,
    apiRequests, apiCacheEnabled,
    lambdaInvocations, lambdaMemoryMB, lambdaAvgDurationMs,
    cloudwatchMetrics, cloudwatchLogs,
    dataTransferGB
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const AccordionSection = ({ 
    id, 
    title, 
    cost, 
    icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    cost: number; 
    icon: string; 
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-blue-600">{formatCurrency(cost)}</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-white border-t border-gray-200 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AWS Cost Calculator</h3>
              <p className="text-sm text-gray-600">Adjust parameters to estimate your monthly costs</p>
            </div>
          </div>
          
          {/* Lock indicator and permission info */}
          {!canEdit && (
            <div className="flex items-center space-x-2 group relative">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Read Only</span>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
                <div className="font-semibold mb-1">Why is this read-only?</div>
                <div>{readOnlyReason}</div>
                {user && (user.role === 'project-manager' || user.role === 'viewer' || user.role === 'engineer') && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="font-semibold mb-1">Who can edit?</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Solution Architects (when unlocked)</li>
                      <li>Administrators (always)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {canEdit && user?.role === 'solution-architect' && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-medium">You can edit</span>
            </div>
          )}
        </div>
      </div>

      {/* Read-only banner */}
      {!canEdit && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">
                {isLocked || lockStatus?.isLocked ? 'Cost Calculator Locked' : 'View Only Mode'}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                {readOnlyReason}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* SageMaker Section */}
        <AccordionSection id="sagemaker" title="SageMaker" cost={costs.sagemaker} icon="🤖">
          <div className="space-y-4">
            {/* Training */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Instance
              </label>
              <select
                value={trainingInstanceType}
                onChange={(e) => {
                  setTrainingInstanceType(e.target.value);
                  const costs: Record<string, number> = {
                    'ml.p3.2xlarge': 3.06,
                    'ml.g5.2xlarge': 1.515,
                    'ml.g4dn.xlarge': 0.736,
                    'ml.p4d.24xlarge': 32.77
                  };
                  setTrainingHourlyCost(costs[e.target.value]);
                }}
                disabled={!canEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !canEdit ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                }`}
              >
                <option value="ml.p3.2xlarge">ml.p3.2xlarge (V100) - $3.06/hr</option>
                <option value="ml.g5.2xlarge">ml.g5.2xlarge (A10G) - $1.52/hr</option>
                <option value="ml.g4dn.xlarge">ml.g4dn.xlarge (T4) - $0.74/hr</option>
                <option value="ml.p4d.24xlarge">ml.p4d.24xlarge (A100) - $32.77/hr</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Hours/Month: <span className="text-blue-600">{trainingHours} hrs</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={trainingHours}
                onChange={(e) => setTrainingHours(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="spot"
                checked={useSpotTraining}
                onChange={(e) => setUseSpotTraining(e.target.checked)}
                disabled={!canEdit}
                className={`w-4 h-4 text-green-600 rounded ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              <label htmlFor="spot" className={`text-sm text-gray-700 ${!canEdit ? 'opacity-60' : ''}`}>
                Use Spot Instances (70% savings)
              </label>
            </div>

            {/* Inference */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inference Instance
              </label>
              <select
                value={inferenceInstanceType}
                onChange={(e) => {
                  setInferenceInstanceType(e.target.value);
                  const costs: Record<string, number> = {
                    'ml.m5.xlarge': 0.269,
                    'ml.m5.2xlarge': 0.538,
                    'ml.g4dn.xlarge': 0.736,
                    'ml.c5.2xlarge': 0.476
                  };
                  setInferenceHourlyCost(costs[e.target.value]);
                }}
                disabled={!canEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !canEdit ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                }`}
              >
                <option value="ml.m5.xlarge">ml.m5.xlarge - $0.27/hr</option>
                <option value="ml.m5.2xlarge">ml.m5.2xlarge - $0.54/hr</option>
                <option value="ml.g4dn.xlarge">ml.g4dn.xlarge (T4) - $0.74/hr</option>
                <option value="ml.c5.2xlarge">ml.c5.2xlarge - $0.48/hr</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inference Hours/Day: <span className="text-blue-600">{inferenceHoursPerDay} hrs</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={inferenceHoursPerDay}
                onChange={(e) => setInferenceHoursPerDay(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* EC2 Section */}
        <AccordionSection id="ec2" title="EC2 Instances" cost={costs.ec2} icon="🖥️">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instance Type
              </label>
              <select
                value={ec2InstanceType}
                onChange={(e) => {
                  setEc2InstanceType(e.target.value);
                  const costs: Record<string, number> = {
                    't3.medium': 0.0416,
                    't3.large': 0.0832,
                    'm5.xlarge': 0.192,
                    'c5.2xlarge': 0.34
                  };
                  setEc2HourlyCost(costs[e.target.value]);
                }}
                disabled={!canEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !canEdit ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                }`}
              >
                <option value="t3.medium">t3.medium - $0.04/hr</option>
                <option value="t3.large">t3.large - $0.08/hr</option>
                <option value="m5.xlarge">m5.xlarge - $0.19/hr</option>
                <option value="c5.2xlarge">c5.2xlarge - $0.34/hr</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Instances: <span className="text-blue-600">{ec2Instances}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={ec2Instances}
                onChange={(e) => setEc2Instances(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours/Day: <span className="text-blue-600">{ec2HoursPerDay} hrs</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={ec2HoursPerDay}
                onChange={(e) => setEc2HoursPerDay(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ECS Section */}
        <AccordionSection id="ecs" title="ECS Fargate" cost={costs.ecs} icon="🐳">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tasks: <span className="text-blue-600">{ecsTaskCount}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={ecsTaskCount}
                onChange={(e) => setEcsTaskCount(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                vCPU per Task: <span className="text-blue-600">{ecsCpu}</span>
              </label>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={ecsCpu}
                onChange={(e) => setEcsCpu(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory per Task (GB): <span className="text-blue-600">{ecsMemory}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={ecsMemory}
                onChange={(e) => setEcsMemory(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours/Day: <span className="text-blue-600">{ecsHoursPerDay} hrs</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={ecsHoursPerDay}
                onChange={(e) => setEcsHoursPerDay(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* S3 Section */}
        <AccordionSection id="s3" title="S3 Storage" cost={costs.s3} icon="🗄️">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage (GB): <span className="text-blue-600">{s3StorageGB} GB</span>
              </label>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={s3StorageGB}
                onChange={(e) => setS3StorageGB(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requests/Month: <span className="text-blue-600">{(s3RequestsPerMonth / 1000).toFixed(0)}K</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={s3RequestsPerMonth}
                onChange={(e) => setS3RequestsPerMonth(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* API Gateway Section */}
        <AccordionSection id="apiGateway" title="API Gateway" cost={costs.apiGateway} icon="🔌">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Requests/Month: <span className="text-blue-600">{(apiRequests / 1000000).toFixed(1)}M</span>
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={apiRequests}
                onChange={(e) => setApiRequests(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="apiCache"
                checked={apiCacheEnabled}
                onChange={(e) => setApiCacheEnabled(e.target.checked)}
                disabled={!canEdit}
                className={`w-4 h-4 text-blue-600 rounded ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              <label htmlFor="apiCache" className={`text-sm text-gray-700 ${!canEdit ? 'opacity-60' : ''}`}>
                Enable Caching (0.5GB)
              </label>
            </div>
          </div>
        </AccordionSection>

        {/* Lambda Section */}
        <AccordionSection id="lambda" title="Lambda Functions" cost={costs.lambda} icon="λ">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invocations/Month: <span className="text-blue-600">{(lambdaInvocations / 1000).toFixed(0)}K</span>
              </label>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={lambdaInvocations}
                onChange={(e) => setLambdaInvocations(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory (MB): <span className="text-blue-600">{lambdaMemoryMB} MB</span>
              </label>
              <input
                type="range"
                min="128"
                max="3008"
                step="64"
                value={lambdaMemoryMB}
                onChange={(e) => setLambdaMemoryMB(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Duration (ms): <span className="text-blue-600">{lambdaAvgDurationMs} ms</span>
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={lambdaAvgDurationMs}
                onChange={(e) => setLambdaAvgDurationMs(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* CloudWatch Section */}
        <AccordionSection id="cloudwatch" title="CloudWatch" cost={costs.cloudwatch} icon="📊">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Metrics: <span className="text-blue-600">{cloudwatchMetrics}</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={cloudwatchMetrics}
                onChange={(e) => setCloudwatchMetrics(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logs (GB/month): <span className="text-blue-600">{cloudwatchLogs} GB</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={cloudwatchLogs}
                onChange={(e) => setCloudwatchLogs(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </AccordionSection>

        {/* Data Transfer Section */}
        <AccordionSection id="dataTransfer" title="Data Transfer" cost={costs.dataTransfer} icon="🌐">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Transfer Out (GB): <span className="text-blue-600">{dataTransferGB} GB</span>
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={dataTransferGB}
                onChange={(e) => setDataTransferGB(Number(e.target.value))}
                disabled={!canEdit}
                className={`w-full ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            <p className="text-xs text-gray-500">First 1 GB/month is free, then $0.09/GB</p>
          </div>
        </AccordionSection>

        {/* Total Cost Summary */}
        <div className="pt-6 border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Total Monthly Cost</span>
              <span className="text-3xl font-bold text-blue-600">{formatCurrency(costs.total)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Annual projection: <span className="font-semibold text-gray-900">{formatCurrency(costs.total * 12)}</span>
            </div>
          </div>
        </div>

        {/* Savings Tips */}
        {!useSpotTraining && costs.sagemaker > 100 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start space-x-3">
            <TrendingDown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">Potential Savings</p>
              <p className="text-sm text-yellow-700 mt-1">
                Enable Spot instances for SageMaker training to save approximately {formatCurrency(costs.sagemaker * 0.7 * 0.7)} per month
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
