# How Daggr Works - Complete Guide

## What is Daggr?

**Daggr** is a Python library for building **AI workflows** that connect multiple steps together in a visual, interactive way. Think of it as a way to create a pipeline where each step can be:
- Inspected individually
- Run independently
- Connected to other steps
- Visualized in a graph

## Why Use Daggr Instead of Regular Python?

### Traditional Python Approach
```python
# Traditional way - hard to debug, inspect, or modify
def workflow():
    data = prepare_dataset("s3://...")
    training = start_training(data)
    deployment = deploy_model(training)
    result = run_inference(deployment, "test input")
    return result

# Problems:
# - Can't see intermediate results easily
# - Must rerun everything if one step fails
# - No visual representation
# - Hard to experiment with different inputs
```

### Daggr Approach
```python
# Daggr way - visual, interactive, inspectable
dataset_node = FnNode(fn=prepare_dataset, inputs={...}, outputs={...})
training_node = FnNode(fn=start_training, inputs={...}, outputs={...})
deployment_node = FnNode(fn=deploy_model, inputs={...}, outputs={...})
inference_node = FnNode(fn=run_inference, inputs={...}, outputs={...})

graph = Graph(nodes=[dataset_node, training_node, deployment_node, inference_node])
graph.launch()  # Opens interactive UI!

# Benefits:
# ✅ See each step's output in real-time
# ✅ Rerun individual steps without rerunning everything
# ✅ Visual graph showing data flow
# ✅ Easy to experiment with different inputs
# ✅ State is saved (can resume later)
```

## What is `gr` (Gradio)?

`gr` stands for **Gradio** - a library for creating UI components. In Daggr, we use Gradio components to define:
1. **Input fields** (textboxes, sliders, dropdowns, etc.)
2. **Output displays** (text, images, JSON, etc.)

### Why Gradio?
- **Easy to use** - Simple Python API
- **Rich components** - Textboxes, sliders, images, audio, etc.
- **Automatic UI generation** - No HTML/CSS needed
- **Interactive** - Users can modify inputs and see results

## Core Concepts

### 1. Nodes (FnNode)

A **node** is a single step in your workflow. Each node:
- Runs a Python function
- Has inputs (what it needs)
- Has outputs (what it produces)
- Appears as a card in the UI

```python
# Example: Dataset Preparation Node
dataset_prep = FnNode(
    fn=prepare_dataset,           # The function to run
    inputs={                       # What inputs it needs
        "s3_uri": gr.Textbox(...), # User can type S3 path
        "model_type": gr.Radio(...) # User selects LLM or CV
    },
    outputs={                      # What it produces
        "dataset_info": gr.Textbox(...) # Shows result
    }
)
```

**Breakdown:**
- `fn=prepare_dataset` - The Python function that does the work
- `inputs={}` - Dictionary of input parameters
- `outputs={}` - Dictionary of output values
- Each input/output uses a Gradio component (`gr.Textbox`, `gr.Slider`, etc.)

### 2. Inputs - How Data Enters a Node

There are **3 types of inputs**:

#### Type 1: User Input (Gradio Component)
```python
inputs={
    "s3_uri": gr.Textbox(
        label="S3 Dataset URI",           # Label shown in UI
        value="s3://default/path/",       # Default value
        lines=1                            # Single line textbox
    )
}
```
- Creates an **input field** in the UI
- User can **type or modify** the value
- The value is passed to your function

#### Type 2: Connected Input (From Another Node)
```python
# Node 2 uses output from Node 1
training_job = FnNode(
    fn=start_training,
    inputs={
        "dataset_info": dataset_prep.dataset_info,  # ← Connected!
        "epochs": gr.Slider(...)                     # ← User input
    },
    outputs={...}
)
```
- `dataset_prep.dataset_info` - Gets output from previous node
- Creates an **orange connection line** in the UI
- Data flows automatically from one node to the next

#### Type 3: Fixed Value (No UI)
```python
inputs={
    "batch_size": 32,  # Fixed value, no UI component
    "learning_rate": 2e-5
}
```
- Value is **hardcoded**
- No input field shown in UI
- Useful for constants

### 3. Outputs - How Data Leaves a Node

Outputs define what your function returns and how it's displayed:

```python
outputs={
    "dataset_info": gr.Textbox(
        label="Dataset Information",  # Label in UI
        lines=8                        # 8 lines tall
    )
}
```

**Important:** The output name (`"dataset_info"`) must match what your function returns:

```python
def prepare_dataset(s3_uri: str, model_type: str) -> str:
    result = "Dataset prepared!"
    return result  # This goes to "dataset_info" output
```

### 4. Graph - Connecting Everything

The **Graph** combines all nodes into a workflow:

```python
graph = Graph(
    name="Model Retraining Workflow",  # Shown at top of UI
    nodes=[                             # List of all nodes
        dataset_prep,
        training_job,
        model_deployment,
        inference
    ]
)

graph.launch()  # Opens browser UI
```

## How Data Flows

Let's trace data through the workflow:

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User enters S3 URI and selects model type          │
│         ↓                                                    │
│ Step 2: Click "Run" on dataset_prep node                   │
│         ↓                                                    │
│ Step 3: prepare_dataset() function executes                │
│         ↓                                                    │
│ Step 4: Function returns result string                     │
│         ↓                                                    │
│ Step 5: Result appears in "Dataset Information" output     │
│         ↓                                                    │
│ Step 6: Result automatically flows to training_job node    │
│         (via the orange connection line)                    │
│         ↓                                                    │
│ Step 7: User clicks "Run" on training_job node             │
│         ↓                                                    │
│ Step 8: start_training() receives dataset_info + epochs    │
│         ↓                                                    │
│ Step 9: Process continues through all nodes...             │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Example Walkthrough

Let's break down the first node completely:

```python
# 1. Define the function that does the work
def prepare_dataset(s3_uri: str, model_type: str) -> str:
    """
    This function:
    - Takes 2 parameters: s3_uri and model_type
    - Simulates dataset preparation
    - Returns a formatted string with results
    """
    time.sleep(1)  # Simulate processing time
    
    result = f"""Dataset Prepared Successfully!
    
S3 URI: {s3_uri}
Model Type: {model_type}
Total Samples: 10000
Train Samples: 8000
Validation Samples: 2000
Status: Ready for training
"""
    return result  # This string goes to the output


# 2. Create a node that wraps this function
dataset_prep = FnNode(
    fn=prepare_dataset,  # ← The function to run
    
    # 3. Define inputs (what user provides)
    inputs={
        # Input 1: S3 URI
        "s3_uri": gr.Textbox(
            label="S3 Dataset URI",  # Label shown above input
            value="s3://ml-datasets/llm-finetuning/medical-qa/",  # Default
            lines=1  # Single line textbox
        ),
        
        # Input 2: Model Type
        "model_type": gr.Radio(
            choices=["llm", "cv"],  # Two options
            label="Model Type",      # Label shown above
            value="llm"              # Default selection
        ),
    },
    
    # 4. Define outputs (what function returns)
    outputs={
        "dataset_info": gr.Textbox(
            label="Dataset Information",  # Label shown above output
            lines=8  # 8 lines tall to show full result
        ),
    },
)
```

### What Happens When You Click "Run":

1. **Daggr reads the input values:**
   - `s3_uri = "s3://ml-datasets/llm-finetuning/medical-qa/"`
   - `model_type = "llm"`

2. **Daggr calls your function:**
   ```python
   result = prepare_dataset(
       s3_uri="s3://ml-datasets/llm-finetuning/medical-qa/",
       model_type="llm"
   )
   ```

3. **Function executes and returns:**
   ```python
   result = """Dataset Prepared Successfully!
   
   S3 URI: s3://ml-datasets/llm-finetuning/medical-qa/
   Model Type: llm
   Total Samples: 10000
   ...
   """
   ```

4. **Daggr displays result in output:**
   - The `result` string appears in the "Dataset Information" textbox

5. **Result is available to next node:**
   - `training_job` can now access `dataset_prep.dataset_info`

## Gradio Components Reference

### Common Input Components

```python
# Text Input
gr.Textbox(
    label="Label",
    value="default",
    lines=1,           # Number of lines (1 = single line)
    placeholder="..."  # Hint text
)

# Number Slider
gr.Slider(
    minimum=1,
    maximum=10,
    value=5,
    step=1,
    label="Label"
)

# Dropdown Menu
gr.Dropdown(
    choices=["option1", "option2", "option3"],
    value="option1",
    label="Label"
)

# Radio Buttons
gr.Radio(
    choices=["option1", "option2"],
    value="option1",
    label="Label"
)

# Checkbox
gr.Checkbox(
    value=True,
    label="Label"
)

# Number Input
gr.Number(
    value=100,
    label="Label"
)

# Image Upload
gr.Image(
    label="Label",
    type="filepath"  # Returns file path
)
```

### Common Output Components

```python
# Text Output
gr.Textbox(
    label="Label",
    lines=10  # Height
)

# JSON Output (for structured data)
gr.JSON(
    label="Label"
)

# Image Output
gr.Image(
    label="Label"
)

# Audio Output
gr.Audio(
    label="Label"
)
```

## Why We Use Textbox Instead of JSON

In the working version, we use `gr.Textbox` for outputs instead of `gr.JSON`:

```python
# ❌ This caused rendering issues
outputs={
    "result": gr.JSON(label="Result")
}

# ✅ This works reliably
outputs={
    "result": gr.Textbox(label="Result", lines=10)
}
```

**Reason:** Some Gradio components (like JSON) can have rendering issues in certain Daggr versions. Textbox is more stable and works consistently.

## Node Connections

### How Nodes Connect

```python
# Node 1 produces output
node1 = FnNode(
    fn=function1,
    inputs={...},
    outputs={
        "output_name": gr.Textbox(...)  # ← This is available
    }
)

# Node 2 uses Node 1's output
node2 = FnNode(
    fn=function2,
    inputs={
        "input_name": node1.output_name,  # ← Connect here!
        "other_input": gr.Textbox(...)
    },
    outputs={...}
)
```

**Key Points:**
- Use `node1.output_name` to reference another node's output
- The connection appears as an **orange line** in the UI
- Data flows automatically when you run nodes in sequence

## Visual Indicators in UI

### Connection Colors

- **Orange Line** = Fresh data (downstream node used this exact value)
- **Gray Line** = Stale data (upstream changed, need to rerun)

### Node States

- **Blue badge** = Input node (user provides data)
- **Orange badge** = Processing node (function running)
- **Green checkmark** = Completed successfully
- **Red X** = Error occurred

## Complete Workflow Pattern

Here's the standard pattern for creating a Daggr workflow:

```python
# 1. Import libraries
import gradio as gr
from daggr import FnNode, Graph

# 2. Define your functions
def step1(input1: str, input2: int) -> str:
    # Do work
    return result

def step2(previous_result: str, new_input: str) -> str:
    # Do more work
    return result

# 3. Create nodes
node1 = FnNode(
    fn=step1,
    inputs={
        "input1": gr.Textbox(...),
        "input2": gr.Slider(...)
    },
    outputs={
        "result1": gr.Textbox(...)
    }
)

node2 = FnNode(
    fn=step2,
    inputs={
        "previous_result": node1.result1,  # ← Connection!
        "new_input": gr.Textbox(...)
    },
    outputs={
        "result2": gr.Textbox(...)
    }
)

# 4. Create graph
graph = Graph(
    name="My Workflow",
    nodes=[node1, node2]
)

# 5. Launch
if __name__ == "__main__":
    graph.launch()
```

## Key Advantages of Daggr

1. **Visual Debugging** - See exactly what each step produces
2. **Selective Rerun** - Only rerun failed or changed steps
3. **State Persistence** - Resume work across sessions
4. **Easy Experimentation** - Try different inputs without code changes
5. **Shareable** - Deploy to web for others to use
6. **Provenance Tracking** - Know exactly what inputs produced each output

## Common Patterns

### Pattern 1: Sequential Pipeline
```python
A → B → C → D
```
Each node depends on the previous one.

### Pattern 2: Parallel Processing
```python
    ┌→ B →┐
A →→│     │→→ D
    └→ C →┘
```
Multiple nodes process A's output independently.

### Pattern 3: Conditional Flow
```python
A → B → (if condition) → C or D
```
Use function logic to determine next steps.

## Best Practices

1. **Keep functions simple** - One clear purpose per node
2. **Use descriptive labels** - Help users understand inputs/outputs
3. **Provide good defaults** - Make it easy to get started
4. **Add helpful descriptions** - Use `info` parameter in components
5. **Test incrementally** - Build one node at a time
6. **Use Textbox for complex outputs** - More reliable than JSON

## Troubleshooting

### Nodes Not Showing
- Use `gr.Textbox` instead of `gr.JSON` for outputs
- Check browser console (F12) for errors
- Try simpler components first

### Data Not Flowing
- Check connection: `node1.output_name` syntax
- Ensure output name matches function return
- Verify function parameter names match input keys

### Function Errors
- Check terminal for Python errors
- Add print statements for debugging
- Test function independently first

---

**Summary:** Daggr + Gradio lets you build interactive AI workflows with visual feedback, making it easy to develop, debug, and share complex pipelines!
