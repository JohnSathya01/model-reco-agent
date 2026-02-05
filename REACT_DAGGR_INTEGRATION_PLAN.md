# Integrating Daggr Workflow into React App

## Overview

You want to add a **"Retraining"** tab to your existing React application that embeds the Daggr workflow interface.

## Current React App Structure

Based on your screenshot, your app has:
- **Overview** tab - Shows recommendations
- **Pipeline** tab - Shows pipeline visualization
- **Analysis** tab - Shows analysis
- **Integration** tab - Integration options

**Goal:** Add a **"Retraining"** tab that shows the Daggr workflow

## Integration Approach

There are **3 ways** to integrate Daggr with your React app:

### Option 1: Iframe Embed (Easiest) ⭐

Embed the Daggr workflow in an iframe within your React app.

**Pros:**
- ✅ Easiest to implement
- ✅ No code changes to Daggr workflow
- ✅ Full Daggr functionality preserved
- ✅ Can be done in 10 minutes

**Cons:**
- ❌ Separate UI (iframe boundary)
- ❌ Limited communication between React and Daggr
- ❌ Requires Daggr server running

**Implementation:**

```tsx
// src/components/dashboard/RetrainingTab.tsx
import React from 'react';

export const RetrainingTab: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900">
          Model Retraining Workflow
        </h3>
        <p className="text-sm text-blue-700 mt-1">
          Use this interactive workflow to retrain and deploy your recommended model.
        </p>
      </div>
      
      <iframe
        src="http://localhost:7860"
        className="w-full h-[calc(100vh-200px)] border-0 rounded-lg shadow-lg"
        title="Daggr Retraining Workflow"
      />
    </div>
  );
};
```

Then add the tab to your main dashboard:

```tsx
// src/components/dashboard/ResultsDashboard.tsx
import { RetrainingTab } from './RetrainingTab';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart /> },
  { id: 'pipeline', label: 'Pipeline', icon: <GitBranch /> },
  { id: 'analysis', label: 'Analysis', icon: <LineChart /> },
  { id: 'integration', label: 'Integration', icon: <Code /> },
  { id: 'retraining', label: 'Retraining', icon: <RefreshCw /> }, // ← New!
];

// In the render:
{activeTab === 'retraining' && <RetrainingTab />}
```

---

### Option 2: API Integration (Moderate)

Keep Daggr as backend, build custom React UI that calls Daggr API.

**Pros:**
- ✅ Consistent UI with your app
- ✅ Full control over styling
- ✅ Better user experience

**Cons:**
- ❌ More development work
- ❌ Need to replicate Daggr UI features
- ❌ Lose visual workflow canvas

**Implementation:**

```tsx
// src/components/dashboard/RetrainingTab.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const RetrainingTab: React.FC = () => {
  const [s3Uri, setS3Uri] = useState('');
  const [modelType, setModelType] = useState('llm');
  const [status, setStatus] = useState('');

  const handlePrepareDataset = async () => {
    // Call Daggr backend API
    const response = await fetch('http://localhost:7860/api/run-node', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        node: 'dataset_prep',
        inputs: { s3_uri: s3Uri, model_type: modelType }
      })
    });
    
    const result = await response.json();
    setStatus(result.output);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Dataset Preparation</h3>
        
        <Input
          label="S3 Dataset URI"
          value={s3Uri}
          onChange={(e) => setS3Uri(e.target.value)}
          placeholder="s3://my-bucket/dataset/"
        />
        
        <select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className="mt-4 w-full p-2 border rounded"
        >
          <option value="llm">LLM</option>
          <option value="cv">Computer Vision</option>
        </select>
        
        <Button onClick={handlePrepareDataset} className="mt-4">
          Prepare Dataset
        </Button>
        
        {status && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <pre>{status}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### Option 3: Hybrid Approach (Best) 🌟

Use iframe for visual workflow + API for data passing.

**Pros:**
- ✅ Keep Daggr visual workflow
- ✅ Pass data from React to Daggr
- ✅ Best of both worlds

**Cons:**
- ❌ Requires some custom code
- ❌ Need to handle iframe communication

**Implementation:**

```tsx
// src/components/dashboard/RetrainingTab.tsx
import React, { useEffect, useRef } from 'react';

interface RetrainingTabProps {
  recommendedModel?: string;
  datasetUri?: string;
}

export const RetrainingTab: React.FC<RetrainingTabProps> = ({
  recommendedModel,
  datasetUri
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Pass data from React to Daggr iframe
    if (iframeRef.current && recommendedModel) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'SET_BASE_MODEL',
        model: recommendedModel,
        datasetUri: datasetUri
      }, 'http://localhost:7860');
    }
  }, [recommendedModel, datasetUri]);

  return (
    <div className="w-full h-full">
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              🔄 Model Retraining Workflow
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Retrain your recommended model with custom data
            </p>
          </div>
          
          {recommendedModel && (
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-xs text-gray-500">Base Model:</span>
              <p className="text-sm font-medium text-gray-900">
                {recommendedModel}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <iframe
        ref={iframeRef}
        src="http://localhost:7860"
        className="w-full h-[calc(100vh-250px)] border-0 rounded-lg shadow-lg"
        title="Daggr Retraining Workflow"
      />
    </div>
  );
};
```

---

## Step-by-Step Implementation (Option 1 - Easiest)

### Step 1: Create the Retraining Tab Component

Create `src/components/dashboard/RetrainingTab.tsx`:

```tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const RetrainingTab: React.FC = () => {
  return (
    <div className="w-full h-full p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Model Retraining Workflow
            </h2>
            <p className="text-gray-600 mt-2">
              Use this interactive workflow to retrain your recommended model with custom data.
              The workflow guides you through dataset preparation, training, deployment, and testing.
            </p>
            
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Daggr Server Running</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">4 Workflow Stages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps Info */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm font-semibold text-gray-900">1. Dataset Prep</div>
          <div className="text-xs text-gray-500 mt-1">Configure S3 URI</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm font-semibold text-gray-900">2. Training</div>
          <div className="text-xs text-gray-500 mt-1">Set hyperparameters</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm font-semibold text-gray-900">3. Deployment</div>
          <div className="text-xs text-gray-500 mt-1">Deploy to endpoint</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm font-semibold text-gray-900">4. Inference</div>
          <div className="text-xs text-gray-500 mt-1">Test the model</div>
        </div>
      </div>

      {/* Daggr Iframe */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <iframe
          src="http://localhost:7860"
          className="w-full h-[calc(100vh-400px)] border-0"
          title="Daggr Retraining Workflow"
          allow="clipboard-write"
        />
      </div>

      {/* Help Text */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>💡 Tip:</strong> Run each stage sequentially from left to right. 
          Click the "Run" button on each node to execute that stage. 
          Orange connections indicate fresh data flow.
        </p>
      </div>
    </div>
  );
};
```

### Step 2: Add Tab to ResultsDashboard

Update `src/components/dashboard/ResultsDashboard.tsx`:

```tsx
import { RetrainingTab } from './RetrainingTab';
import { RefreshCw } from 'lucide-react';

// Add to tabs array
const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'analysis', label: 'Analysis', icon: LineChart },
  { id: 'integration', label: 'Integration', icon: Code },
  { id: 'retraining', label: 'Retraining', icon: RefreshCw }, // ← New!
];

// Add to tab content rendering
{activeTab === 'overview' && <OverviewTab />}
{activeTab === 'pipeline' && <PipelineTab />}
{activeTab === 'analysis' && <AnalysisTab />}
{activeTab === 'integration' && <IntegrationTab />}
{activeTab === 'retraining' && <RetrainingTab />} {/* ← New! */}
```

### Step 3: Start Daggr Server

In a separate terminal:

```bash
source daggr/venv/bin/activate
daggr daggr/working_retraining_workflow.py
```

### Step 4: Start React App

```bash
npm run dev
```

Now you'll have a "Retraining" tab that shows the Daggr workflow!

---

## Advanced: Passing Data Between React and Daggr

If you want to pass the recommended model from React to Daggr:

```tsx
// In RetrainingTab.tsx
interface RetrainingTabProps {
  recommendedModel?: {
    name: string;
    accuracy: number;
    cost: number;
  };
}

export const RetrainingTab: React.FC<RetrainingTabProps> = ({ 
  recommendedModel 
}) => {
  const iframeUrl = recommendedModel
    ? `http://localhost:7860?model=${encodeURIComponent(recommendedModel.name)}`
    : 'http://localhost:7860';

  return (
    <div>
      {recommendedModel && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            Using recommended model: <strong>{recommendedModel.name}</strong>
          </p>
        </div>
      )}
      
      <iframe src={iframeUrl} ... />
    </div>
  );
};
```

---

## Deployment Considerations

### Development
- React app: `http://localhost:5173`
- Daggr server: `http://localhost:7860`

### Production
- Deploy Daggr to Hugging Face Spaces or separate server
- Update iframe URL to production Daggr URL
- Handle CORS if needed

```tsx
const DAGGR_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-daggr-app.hf.space'
  : 'http://localhost:7860';

<iframe src={DAGGR_URL} ... />
```

---

## Summary

**Recommended Approach:** Option 1 (Iframe Embed)

**Steps:**
1. Create `RetrainingTab.tsx` component
2. Add tab to `ResultsDashboard.tsx`
3. Start Daggr server: `daggr daggr/working_retraining_workflow.py`
4. Start React app: `npm run dev`
5. Click "Retraining" tab to see Daggr workflow

**Time to implement:** ~15 minutes

**Result:** Fully functional retraining workflow integrated into your React app!
