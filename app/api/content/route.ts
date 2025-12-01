import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    // In production, you would read from the TechLibrary directory
    // For now, return mock content
    const mockContent = generateMockContent(filePath);
    return new NextResponse(mockContent, {
      headers: { 'Content-Type': 'text/markdown' },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

function generateMockContent(path: string): string {
  const filename = path.split('/').pop() || 'document';
  const title = filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Enhanced content based on common resource types
  const contentMap: Record<string, string> = {
    'python': `# Python Programming Guide

## Overview
Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, automation, and AI/ML.

## Key Features
- **Easy to Learn**: Clear, readable syntax
- **Versatile**: Web, data science, automation, scripting
- **Rich Ecosystem**: Extensive standard library and packages (PyPI)
- **Community Support**: Large, active developer community

## Core Concepts
1. **Dynamic Typing**: Variables don't need explicit type declarations
2. **Object-Oriented**: Supports classes and inheritance
3. **Functional Programming**: First-class functions, lambdas, comprehensions
4. **Memory Management**: Automatic garbage collection

## Quick Start
\`\`\`python
# Hello World
print("Hello, World!")

# Variables and Data Types
name = "TechLibrary"
count = 42
is_active = True

# Functions
def greet(name):
    return f"Hello, {name}!"

# Classes
class Resource:
    def __init__(self, title):
        self.title = title
\`\`\`

## Best Practices
- Follow PEP 8 style guide
- Use virtual environments (venv, conda)
- Write docstrings for functions and classes
- Use type hints for better code clarity
- Leverage list comprehensions for concise code

## Common Use Cases
- **Web Development**: Django, Flask, FastAPI
- **Data Science**: NumPy, Pandas, Matplotlib
- **Machine Learning**: TensorFlow, PyTorch, scikit-learn
- **Automation**: Selenium, Requests, Beautiful Soup

## Resources
- [Official Python Docs](https://docs.python.org/)
- [Python Package Index (PyPI)](https://pypi.org/)
- [Real Python Tutorials](https://realpython.com/)`,

    'javascript': `# JavaScript Guide

## Overview
JavaScript is the programming language of the web, enabling interactive and dynamic content in browsers and servers (Node.js).

## Key Features
- **Event-Driven**: Responds to user interactions
- **Asynchronous**: Promises, async/await for non-blocking operations
- **Prototype-Based**: Object inheritance through prototypes
- **First-Class Functions**: Functions as values

## ES6+ Modern Features
\`\`\`javascript
// Arrow functions
const greet = (name) => \`Hello, \${name}!\`;

// Destructuring
const { name, age } = user;

// Spread operator
const newArray = [...oldArray, newItem];

// Template literals
const message = \`User \${name} is \${age} years old\`;

// Async/await
async function fetchData() {
  const response = await fetch(url);
  return await response.json();
}
\`\`\`

## Best Practices
- Use \`const\` and \`let\`, avoid \`var\`
- Prefer arrow functions for callbacks
- Use async/await over promises
- Implement proper error handling
- Follow ESLint recommendations`,

    'docker': `# Docker Guide

## Overview
Docker is a containerization platform that packages applications with their dependencies for consistent deployment across environments.

## Core Concepts
- **Images**: Read-only templates for creating containers
- **Containers**: Running instances of images
- **Dockerfile**: Instructions to build an image
- **Docker Compose**: Multi-container orchestration

## Basic Commands
\`\`\`bash
# Build an image
docker build -t myapp:latest .

# Run a container
docker run -d -p 8080:80 myapp:latest

# List running containers
docker ps

# Stop a container
docker stop container_id

# View logs
docker logs container_id
\`\`\`

## Dockerfile Example
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Best Practices
- Use official base images
- Minimize layer count
- Leverage build cache
- Don't run as root
- Use .dockerignore`,

    'kubernetes': `# Kubernetes Guide

## Overview
Kubernetes (K8s) is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.

## Core Components
- **Pods**: Smallest deployable units
- **Services**: Stable network endpoints
- **Deployments**: Declarative updates for Pods
- **ConfigMaps/Secrets**: Configuration management
- **Ingress**: HTTP/HTTPS routing

## Basic kubectl Commands
\`\`\`bash
# Get resources
kubectl get pods
kubectl get services

# Create resources
kubectl apply -f deployment.yaml

# Scale deployment
kubectl scale deployment myapp --replicas=3

# View logs
kubectl logs pod-name

# Execute command in pod
kubectl exec -it pod-name -- /bin/bash
\`\`\`

## Best Practices
- Use namespaces for isolation
- Implement resource limits
- Use liveness and readiness probes
- Store configs in ConfigMaps
- Use Secrets for sensitive data`,
  };

  // Try to find matching content
  const pathLower = path.toLowerCase();
  for (const [key, content] of Object.entries(contentMap)) {
    if (pathLower.includes(key)) {
      return content;
    }
  }

  // Default generic content
  return `# ${title}

## Overview
This is a comprehensive guide covering ${title.toLowerCase()}.

## Key Concepts

### Concept 1: Fundamentals
Understanding the core principles and foundational knowledge required for working with ${title.toLowerCase()}.

### Concept 2: Implementation
Practical approaches and techniques for implementing ${title.toLowerCase()} in real-world scenarios.

### Concept 3: Best Practices
Industry-standard practices and patterns that ensure quality and maintainability.

## Getting Started

\`\`\`typescript
// Example code snippet
function example() {
  console.log('This is a sample implementation');
  return true;
}
\`\`\`

## Common Patterns

1. **Pattern 1**: Establishing a solid foundation
2. **Pattern 2**: Implementing core functionality
3. **Pattern 3**: Optimizing for performance

## Best Practices

- ✅ Follow established conventions
- ✅ Write clean, maintainable code
- ✅ Document your work thoroughly
- ✅ Test extensively
- ✅ Consider scalability

## Common Pitfalls

- ❌ Avoid premature optimization
- ❌ Don't ignore error handling
- ❌ Be careful with edge cases
- ❌ Always validate input

## Tools & Resources

- Official Documentation
- Community Forums
- Video Tutorials
- Code Examples

## Advanced Topics

For more advanced usage, explore:
- Performance optimization techniques
- Integration with other systems
- Scaling strategies
- Security considerations

## Next Steps

Continue learning by exploring related topics in the TechLibrary graph. Click on connected nodes to discover related resources.
`;
}
