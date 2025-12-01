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

  return `# ${title}

## Overview

This is a comprehensive guide covering ${title.toLowerCase()}.

## Key Concepts

- **Concept 1**: First important concept to understand
- **Concept 2**: Second crucial element
- **Concept 3**: Third essential principle

## Best Practices

1. Always follow established patterns
2. Write clean, maintainable code
3. Document your work thoroughly
4. Test extensively

## Example

\`\`\`typescript
// Example code snippet
function example() {
  console.log('This is a sample implementation');
  return true;
}
\`\`\`

## Common Pitfalls

- Avoid common mistake #1
- Be careful with edge cases
- Always validate input

## Resources

- [Official Documentation](#)
- [Community Guide](#)
- [Video Tutorial](#)

## Next Steps

Continue learning by exploring related topics in the TechLibrary graph.
`;
}
