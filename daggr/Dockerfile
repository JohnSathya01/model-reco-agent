# Dockerfile for Daggr Workflow
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the workflow file
COPY working_retraining_workflow.py .

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV HOST=0.0.0.0

# Run the Daggr server
CMD ["daggr", "working_retraining_workflow.py", "--host", "0.0.0.0", "--port", "8080"]
