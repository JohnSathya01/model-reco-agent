import type { APIEndpoint } from './apiGenerator';

export type CodeLanguage = 'python' | 'javascript' | 'curl' | 'java' | 'go';

export const generateBoilerplateCode = (endpoint: APIEndpoint, language: CodeLanguage, baseUrl: string): string => {
  switch (language) {
    case 'python':
      return generatePythonCode(endpoint, baseUrl);
    case 'javascript':
      return generateJavaScriptCode(endpoint, baseUrl);
    case 'curl':
      return generateCurlCode(endpoint, baseUrl);
    case 'java':
      return generateJavaCode(endpoint, baseUrl);
    case 'go':
      return generateGoCode(endpoint, baseUrl);
    default:
      return '';
  }
};

const generatePythonCode = (endpoint: APIEndpoint, baseUrl: string): string => {
  const exampleBody = JSON.stringify(endpoint.request.example, null, 4);
  
  return `import requests
import json

# API Configuration
BASE_URL = "${baseUrl}"
ENDPOINT = "${endpoint.path}"
API_KEY = "your-api-key-here"

# Request headers
headers = {
    "Content-Type": "${endpoint.request.contentType}",
    "Authorization": f"Bearer {API_KEY}"
}

# Request payload
payload = ${exampleBody}

# Make the API request
try:
    response = requests.${endpoint.method.toLowerCase()}(
        f"{BASE_URL}{ENDPOINT}",
        headers=headers,
        json=payload
    )
    
    # Check if request was successful
    response.raise_for_status()
    
    # Parse and print the response
    result = response.json()
    print("Success!")
    print(json.dumps(result, indent=2))
    
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
    if hasattr(e.response, 'text'):
        print(f"Response: {e.response.text}")`;
};

const generateJavaScriptCode = (endpoint: APIEndpoint, baseUrl: string): string => {
  const exampleBody = JSON.stringify(endpoint.request.example, null, 2);
  
  return `// API Configuration
const BASE_URL = "${baseUrl}";
const ENDPOINT = "${endpoint.path}";
const API_KEY = "your-api-key-here";

// Request payload
const payload = ${exampleBody};

// Make the API request using fetch
async function callAPI() {
  try {
    const response = await fetch(\`\${BASE_URL}\${ENDPOINT}\`, {
      method: "${endpoint.method}",
      headers: {
        "Content-Type": "${endpoint.request.contentType}",
        "Authorization": \`Bearer \${API_KEY}\`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const result = await response.json();
    console.log("Success!");
    console.log(JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Call the API
callAPI();`;
};

const generateCurlCode = (endpoint: APIEndpoint, baseUrl: string): string => {
  const exampleBody = JSON.stringify(endpoint.request.example, null, 2);
  
  return `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" \\
  -H "Content-Type: ${endpoint.request.contentType}" \\
  -H "Authorization: Bearer your-api-key-here" \\
  -d '${exampleBody}'`;
};

const generateJavaCode = (endpoint: APIEndpoint, baseUrl: string): string => {
  const exampleBody = JSON.stringify(endpoint.request.example, null, 4);
  
  return `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class APIClient {
    private static final String BASE_URL = "${baseUrl}";
    private static final String ENDPOINT = "${endpoint.path}";
    private static final String API_KEY = "your-api-key-here";
    
    public static void main(String[] args) {
        try {
            // Create HTTP client
            HttpClient client = HttpClient.newHttpClient();
            
            // Request payload
            String payload = """
${exampleBody}
            """;
            
            // Build the request
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + ENDPOINT))
                .header("Content-Type", "${endpoint.request.contentType}")
                .header("Authorization", "Bearer " + API_KEY)
                .${endpoint.method}(HttpRequest.BodyPublishers.ofString(payload))
                .build();
            
            // Send the request
            HttpResponse<String> response = client.send(
                request, 
                HttpResponse.BodyHandlers.ofString()
            );
            
            // Print the response
            System.out.println("Status Code: " + response.statusCode());
            
            // Pretty print JSON response
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            Object jsonObject = gson.fromJson(response.body(), Object.class);
            System.out.println("Response:");
            System.out.println(gson.toJson(jsonObject));
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}`;
};

const generateGoCode = (endpoint: APIEndpoint, baseUrl: string): string => {
  const exampleBody = JSON.stringify(endpoint.request.example, null, 2);
  
  return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

const (
    baseURL = "${baseUrl}"
    endpoint = "${endpoint.path}"
    apiKey = "your-api-key-here"
)

func main() {
    // Request payload
    payload := []byte(\`${exampleBody}\`)
    
    // Create the request
    req, err := http.NewRequest(
        "${endpoint.method}",
        baseURL+endpoint,
        bytes.NewBuffer(payload),
    )
    if err != nil {
        fmt.Printf("Error creating request: %v\\n", err)
        return
    }
    
    // Set headers
    req.Header.Set("Content-Type", "${endpoint.request.contentType}")
    req.Header.Set("Authorization", "Bearer "+apiKey)
    
    // Send the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Error sending request: %v\\n", err)
        return
    }
    defer resp.Body.Close()
    
    // Read the response
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Error reading response: %v\\n", err)
        return
    }
    
    // Print the response
    fmt.Printf("Status Code: %d\\n", resp.StatusCode)
    
    // Pretty print JSON
    var result map[string]interface{}
    if err := json.Unmarshal(body, &result); err != nil {
        fmt.Printf("Error parsing JSON: %v\\n", err)
        return
    }
    
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Println("Response:")
    fmt.Println(string(prettyJSON))
}`;
};
