# TechLibrary Reference System

This document serves as a reference guide for the agent when working on implementation tasks. The TechLibrary contains 23 core domains across software engineering, computer science, and technology fields.

## 23 Core Domains

### 1. **Languages** (Programming Languages)
- **Coverage**: Python, JavaScript/TypeScript, Java, C/C++, Go, Rust, C#, Ruby, PHP, Swift, Kotlin
- **Use When**: Implementing features, syntax questions, language-specific patterns
- **Key Topics**: Language features, standard libraries, best practices, idioms

### 2. **Algorithms** (Algorithms & Data Structures)
- **Coverage**: Sorting, searching, graph algorithms, dynamic programming, tree/graph data structures
- **Use When**: Optimizing performance, choosing data structures, algorithmic challenges
- **Key Topics**: Time complexity, space complexity, algorithm design patterns

### 3. **OS** (Operating Systems)
- **Coverage**: Linux, Windows, macOS, process management, file systems, memory management
- **Use When**: System-level programming, shell scripting, OS-specific features
- **Key Topics**: Processes, threads, IPC, system calls, permissions

### 4. **Standards** (Standards & Protocols)
- **Coverage**: HTTP/HTTPS, REST, GraphQL, WebSockets, OAuth, JSON, XML, YAML
- **Use When**: API design, protocol implementation, data interchange
- **Key Topics**: RFC standards, best practices, security considerations

### 5. **Tools** (Development Tools)
- **Coverage**: Git, VS Code, IDEs, debuggers, profilers, linters, formatters
- **Use When**: Setting up development environment, version control, code quality
- **Key Topics**: Tool configuration, CLI usage, integrations, workflows

### 6. **SystemDesign** (System Design & Architecture)
- **Coverage**: Microservices, monoliths, event-driven, CQRS, scalability patterns
- **Use When**: Architecting applications, scaling systems, design decisions
- **Key Topics**: CAP theorem, design patterns, trade-offs, architecture styles

### 7. **Databases** (Databases & Storage)
- **Coverage**: PostgreSQL, MySQL, MongoDB, Redis, SQLite, database design, indexing
- **Use When**: Data modeling, query optimization, choosing database
- **Key Topics**: ACID, transactions, normalization, NoSQL vs SQL, ORMs

### 8. **DevOps** (DevOps & Infrastructure)
- **Coverage**: Docker, Kubernetes, CI/CD, GitHub Actions, Jenkins, Terraform, Ansible
- **Use When**: Deployment, containerization, infrastructure automation
- **Key Topics**: Pipelines, IaC, monitoring, logging, orchestration

### 9. **Security** (Security & Cryptography)
- **Coverage**: Authentication, authorization, encryption, HTTPS/TLS, OWASP Top 10
- **Use When**: Implementing auth, securing data, vulnerability assessment
- **Key Topics**: JWT, OAuth2, hashing, encryption algorithms, secure coding

### 10. **AI-ML** (Artificial Intelligence & Machine Learning)
- **Coverage**: Neural networks, transformers, LLMs, TensorFlow, PyTorch, scikit-learn
- **Use When**: ML model implementation, AI features, data science tasks
- **Key Topics**: Model training, inference, embeddings, fine-tuning, RAG

### 11. **Desktop** (Desktop Application Development)
- **Coverage**: Electron, Qt, WPF, JavaFX, native desktop frameworks
- **Use When**: Building desktop apps, cross-platform development
- **Key Topics**: UI frameworks, native APIs, packaging, distribution

### 12. **Networking** (Networking & Communications)
- **Coverage**: TCP/IP, DNS, load balancing, CDN, firewalls, VPN
- **Use When**: Network programming, troubleshooting connectivity, protocols
- **Key Topics**: OSI model, routing, network security, performance

### 13. **Cloud** (Cloud Computing)
- **Coverage**: AWS, Azure, GCP, serverless, cloud architecture, SaaS/PaaS/IaaS
- **Use When**: Cloud deployment, choosing cloud services, cost optimization
- **Key Topics**: EC2, S3, Lambda, cloud storage, cloud databases, regions

### 14. **Mobile** (Mobile Development)
- **Coverage**: React Native, Flutter, iOS (Swift), Android (Kotlin), mobile patterns
- **Use When**: Building mobile apps, cross-platform development
- **Key Topics**: Native vs hybrid, mobile UI, push notifications, app stores

### 15. **Web** (Web Development)
- **Coverage**: React, Next.js, Vue, Angular, HTML/CSS, responsive design, SSR/CSR
- **Use When**: Building web apps, frontend architecture, web performance
- **Key Topics**: Components, state management, routing, SEO, accessibility

### 16. **Testing** (Testing & Quality Assurance)
- **Coverage**: Unit testing, integration testing, E2E testing, Jest, Pytest, Selenium
- **Use When**: Writing tests, test strategies, CI/CD testing
- **Key Topics**: TDD, mocking, test coverage, test pyramids, flaky tests

### 17. **Performance** (Performance Optimization)
- **Coverage**: Profiling, caching, lazy loading, code splitting, database optimization
- **Use When**: Optimizing slow code, improving UX, scaling bottlenecks
- **Key Topics**: Metrics, benchmarking, CDN, compression, efficient algorithms

### 18. **Graphics** (Graphics & Visualization)
- **Coverage**: Three.js, WebGL, D3.js, Canvas API, SVG, 3D rendering
- **Use When**: Data visualization, 3D graphics, interactive visuals
- **Key Topics**: Shaders, rendering pipelines, scene graphs, animations

### 19. **Data** (Data Engineering & Analytics)
- **Coverage**: ETL, data pipelines, Apache Spark, data warehouses, BI tools
- **Use When**: Processing large datasets, analytics, data transformation
- **Key Topics**: Batch vs streaming, data lakes, data quality, schemas

### 20. **DistributedSystems** (Distributed Systems)
- **Coverage**: Consensus algorithms, distributed databases, message queues, Kafka
- **Use When**: Building distributed apps, handling distributed state
- **Key Topics**: Consistency models, replication, partitioning, distributed tracing

### 21. **ProjectTemplates** (Project Templates & Boilerplates)
- **Coverage**: Starter templates, scaffolding, monorepo setups, project structures
- **Use When**: Starting new projects, setting up repositories
- **Key Topics**: Best practice structures, configuration, dependencies

### 22. **SoftwareEngineering** (Software Engineering Practices)
- **Coverage**: SDLC, Agile, code review, refactoring, clean code, documentation
- **Use When**: Team collaboration, code quality, process improvement
- **Key Topics**: Design principles, code smells, technical debt, best practices

### 23. **Mathematics** (Mathematics & Computation)
- **Coverage**: Linear algebra, calculus, statistics, discrete math, numerical methods
- **Use When**: ML/AI math, algorithm analysis, computational problems
- **Key Topics**: Matrices, derivatives, probability, graph theory, complexity

## How to Use This Reference

### When Stuck on Implementation
1. **Identify the Domain**: Map your problem to one of the 23 domains
2. **Consult Best Practices**: Review domain-specific patterns and standards
3. **Apply Knowledge**: Implement using proven approaches from the domain

### Example Scenarios

**Scenario**: "I need to implement authentication for a Next.js app"
- **Domains**: Security (#9), Web (#15), Standards (#4)
- **Approach**: Use OAuth2 (Security) + Next.js middleware (Web) + HTTP standards (Standards)

**Scenario**: "The graph visualization is slow with 1000+ nodes"
- **Domains**: Performance (#17), Graphics (#18), Algorithms (#2)
- **Approach**: Use spatial indexing (Algorithms) + WebGL instancing (Graphics) + memoization (Performance)

**Scenario**: "Setting up CI/CD pipeline for deployment"
- **Domains**: DevOps (#8), Tools (#5), Cloud (#13)
- **Approach**: GitHub Actions (DevOps) + Docker (DevOps) + cloud deployment (Cloud)

## Integration with Obsidian Data

This TechLibrary reference system works alongside the Obsidian vault data:
- **TechLibrary**: Technical reference for implementation guidance
- **Obsidian Data**: User's specific knowledge graph (e.g., political environment, personal notes)

Both systems are visualized in the 3D graph but serve different purposes:
- TechLibrary = Agent's technical compass
- Obsidian = User's content and connections

## Coverage Status

All 23 domains are at **100% coverage** with comprehensive resources including:
- Guides and tutorials
- Best practices
- Code examples
- Common patterns
- Troubleshooting tips
- Tool recommendations

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Purpose**: Agent reference system for implementation guidance
**Source**: TechLibrary 23-domain knowledge base
