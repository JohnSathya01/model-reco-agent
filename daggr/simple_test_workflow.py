"""
Simple test workflow to verify Daggr is working correctly.
This is a minimal 2-node workflow for testing.
"""

import gradio as gr
from daggr import FnNode, Graph


def add_numbers(a: float, b: float) -> float:
    """Simple addition function"""
    return a + b


def multiply_result(number: float, multiplier: float) -> float:
    """Multiply the result"""
    return number * multiplier


# Node 1: Add two numbers
add_node = FnNode(
    fn=add_numbers,
    inputs={
        "a": gr.Number(label="First Number", value=5),
        "b": gr.Number(label="Second Number", value=3),
    },
    outputs={
        "sum": gr.Number(label="Sum"),
    },
)

# Node 2: Multiply the result
multiply_node = FnNode(
    fn=multiply_result,
    inputs={
        "number": add_node.sum,
        "multiplier": gr.Number(label="Multiplier", value=2),
    },
    outputs={
        "result": gr.Number(label="Final Result"),
    },
)

# Create graph
graph = Graph(
    name="Simple Test Workflow",
    nodes=[add_node, multiply_node],
)

if __name__ == "__main__":
    graph.launch()
