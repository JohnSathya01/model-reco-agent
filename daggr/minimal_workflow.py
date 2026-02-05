"""Minimal workflow to test Daggr rendering"""
import gradio as gr
from daggr import FnNode, Graph

def hello(name: str) -> str:
    return f"Hello, {name}!"

node = FnNode(
    fn=hello,
    inputs={"name": gr.Textbox(label="Name", value="World")},
    outputs={"greeting": gr.Textbox(label="Greeting")},
)

graph = Graph(name="Minimal Test", nodes=[node])

if __name__ == "__main__":
    graph.launch()
