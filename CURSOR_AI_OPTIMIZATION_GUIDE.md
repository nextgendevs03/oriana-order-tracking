# Cursor AI Optimization Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Initial Setup](#initial-setup)
   - [Install Cursor AI](#1-install-cursor-ai)
   - [Configure Cursor Settings for Optimal Performance](#2-configure-cursor-settings-for-optimal-performance)
   - [Create `.cursorrules` File](#3-create-cursorrules-file)
3. [Project Context Configuration](#project-context-configuration)
4. [Writing Effective Prompts](#writing-effective-prompts)
5. [File Organization for Better Context](#file-organization-for-better-context)
6. [Using Cursor Features Effectively](#using-cursor-features-effectively)
7. [Best Practices](#best-practices)
8. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
9. [Advanced Tips](#advanced-tips)
10. [Troubleshooting](#troubleshooting)
11. [Quick Settings Reference](#quick-settings-reference)

## Introduction

Cursor AI is a powerful coding assistant that uses context from your codebase to provide intelligent suggestions. This guide will help you configure Cursor AI to work at its full potential for your project.

## Initial Setup

### 1. Install Cursor AI

- Download and install Cursor from [cursor.sh](https://cursor.sh)
- Sign in with your account
- Ensure you have the latest version installed

### 2. Configure Cursor Settings for Optimal Performance

Open Cursor Settings (`Ctrl+,` or `Cmd+,`) and configure the following settings to maximize performance:

#### 2.1 AI Model Selection (Performance vs. Quality Trade-off)

**Location**: Settings → Features → AI Model

**Options:**

- **Claude 3.5 Sonnet** (Recommended for balance)
  - Best balance of speed and quality
  - Faster responses
  - Good for most tasks
- **Claude 3 Opus** (Best quality, slower)
  - Highest quality responses
  - Slower but more accurate
  - Use for complex refactoring
- **GPT-4** (Alternative)
  - Good quality
  - Fast responses
  - Reliable performance

**Recommendation**: Use Claude 3.5 Sonnet for daily use, switch to Opus for complex tasks.

#### 2.2 Codebase Indexing Settings

**Location**: Settings → Features → Codebase Indexing

**Settings to Configure:**

```json
{
  // Enable codebase indexing for better context
  "cursor.ai.enableCodebaseIndexing": true,

  // Index depth - how many levels to index
  "cursor.ai.indexDepth": 3,

  // Maximum file size to index (in KB)
  "cursor.ai.maxFileSize": 100,

  // Index frequency - how often to re-index
  "cursor.ai.indexFrequency": "onChange", // Options: "onChange", "onSave", "manual"

  // Enable semantic search
  "cursor.ai.enableSemanticSearch": true,

  // Cache index for faster lookups
  "cursor.ai.cacheIndex": true
}
```

**Performance Tips:**

- Set `maxFileSize` to exclude large generated files
- Use `onChange` for active development, `onSave` for better performance
- Enable caching to speed up repeated queries

#### 2.3 Context Window Settings

**Location**: Settings → Features → Context Window

**Settings to Configure:**

```json
{
  // Maximum context length (in tokens)
  "cursor.ai.maxContextLength": 200000,

  // Context window strategy
  "cursor.ai.contextStrategy": "smart", // Options: "smart", "full", "minimal"

  // Include file contents in context
  "cursor.ai.includeFileContents": true,

  // Maximum files to include in context
  "cursor.ai.maxFilesInContext": 50,

  // Prioritize recent files
  "cursor.ai.prioritizeRecentFiles": true,

  // Include related files automatically
  "cursor.ai.includeRelatedFiles": true
}
```

**Performance Tips:**

- For large codebases: Use `maxContextLength: 200000`
- For smaller projects: Use `maxContextLength: 100000` for faster responses
- Use "smart" strategy for automatic optimization
- Enable `prioritizeRecentFiles` to focus on active work

#### 2.4 Autocomplete Settings

**Location**: Settings → Editor → Autocomplete

**Settings to Configure:**

```json
{
  // Enable inline autocomplete
  "cursor.ai.enableAutocomplete": true,

  // Delay before showing suggestions (milliseconds)
  "cursor.ai.autocompleteDelay": 300,

  // Maximum suggestions per request
  "cursor.ai.maxSuggestions": 3,

  // Show suggestions while typing
  "cursor.ai.showWhileTyping": true,

  // Minimum characters before showing suggestions
  "cursor.ai.minCharsForSuggestions": 2,

  // Cache autocomplete results
  "cursor.ai.cacheAutocomplete": true,

  // Debounce autocomplete requests
  "cursor.ai.autocompleteDebounce": 150
}
```

**Performance Tips:**

- Increase `autocompleteDelay` to 400-500ms if suggestions are too frequent
- Set `minCharsForSuggestions` to 3-4 to reduce unnecessary requests
- Enable caching for faster repeated suggestions
- Use debounce to reduce API calls

#### 2.5 Chat and Composer Settings

**Location**: Settings → Features → Chat

**Settings to Configure:**

```json
{
  // Maximum chat history to include
  "cursor.ai.maxChatHistory": 20,

  // Include code context in chat
  "cursor.ai.includeCodeContext": true,

  // Auto-summarize long conversations
  "cursor.ai.autoSummarizeChat": true,

  // Stream responses for faster feedback
  "cursor.ai.streamResponses": true,

  // Cache chat responses
  "cursor.ai.cacheChatResponses": true,

  // Maximum response length
  "cursor.ai.maxResponseLength": 4000
}
```

**Performance Tips:**

- Limit `maxChatHistory` to reduce context size
- Enable streaming for faster initial responses
- Use auto-summarize for long conversations
- Cache responses to avoid redundant API calls

#### 2.6 Memory and Resource Settings

**Location**: Settings → Performance

**Settings to Configure:**

```json
{
  // Maximum memory usage (MB)
  "cursor.ai.maxMemoryUsage": 2048,

  // Enable memory optimization
  "cursor.ai.optimizeMemory": true,

  // Garbage collection frequency
  "cursor.ai.gcFrequency": "auto", // Options: "auto", "aggressive", "conservative"

  // Cache size limit (MB)
  "cursor.ai.cacheSizeLimit": 512,

  // Clear cache on exit
  "cursor.ai.clearCacheOnExit": false,

  // Background processing
  "cursor.ai.enableBackgroundProcessing": true
}
```

**Performance Tips:**

- Adjust `maxMemoryUsage` based on your system RAM
- Use "aggressive" GC for low-memory systems
- Increase `cacheSizeLimit` if you have available RAM
- Enable background processing for non-blocking operations

#### 2.7 Network and API Settings

**Location**: Settings → Network

**Settings to Configure:**

```json
{
  // Request timeout (milliseconds)
  "cursor.ai.requestTimeout": 30000,

  // Retry failed requests
  "cursor.ai.retryFailedRequests": true,

  // Maximum retries
  "cursor.ai.maxRetries": 3,

  // Connection pooling
  "cursor.ai.enableConnectionPooling": true,

  // Compress requests
  "cursor.ai.compressRequests": true,

  // Batch API calls when possible
  "cursor.ai.batchApiCalls": true
}
```

**Performance Tips:**

- Increase timeout for slow connections
- Enable compression to reduce data transfer
- Use connection pooling for better throughput
- Batch API calls to reduce network overhead

#### 2.8 Editor Performance Settings

**Location**: Settings → Editor

**Settings to Configure:**

```json
{
  // Enable inline suggestions
  "editor.inlineSuggest.enabled": true,

  // Show inline documentation
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },

  // Suggestion delay
  "editor.quickSuggestionsDelay": 300,

  // Accept suggestion on enter
  "editor.acceptSuggestionOnEnter": "on",

  // Tab to accept suggestions
  "editor.tabCompletion": "on",

  // Word-based suggestions
  "editor.wordBasedSuggestions": "matchingDocuments",

  // Disable unnecessary features for performance
  "editor.minimap.enabled": false, // Disable if not needed
  "editor.renderWhitespace": "none", // Disable for performance
  "editor.renderLineHighlight": "none" // Disable if causing lag
}
```

**Performance Tips:**

- Disable minimap if you don't use it
- Turn off render whitespace for better performance
- Use word-based suggestions for faster matching
- Adjust suggestion delay based on your typing speed

#### 2.9 File Watching and Indexing

**Location**: Settings → Files

**Settings to Configure:**

```json
{
  // Watch for file changes
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.next/**": true,
    "**/.cache/**": true,
    "**/coverage/**": true
  },

  // Maximum file watchers
  "files.watcherInclude": [],

  // Auto-save delay
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,

  // Exclude large files from indexing
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true
  }
}
```

**Performance Tips:**

- Exclude `node_modules`, `dist`, `build` folders
- Reduce file watchers by excluding unnecessary directories
- Use auto-save delay to batch file operations
- Exclude large generated files from search

#### 2.10 Extension and Plugin Settings

**Location**: Settings → Extensions

**Settings to Configure:**

```json
{
  // Disable unused extensions
  "extensions.autoCheckUpdates": false,

  // Limit extension host processes
  "extensions.experimental.affinity": {
    "vscodevim": 1
  },

  // Disable extension recommendations
  "extensions.showRecommendations": false,

  // Extension host restart threshold
  "extensions.experimental.useSandbox": true
}
```

**Performance Tips:**

- Disable or uninstall unused extensions
- Limit extension host processes
- Use sandbox mode for better isolation
- Disable auto-updates if not needed

#### 2.11 Recommended Performance Profile

For optimal performance, use these recommended settings:

**For Large Codebases (1000+ files):**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.maxContextLength": 150000,
  "cursor.ai.autocompleteDelay": 400,
  "cursor.ai.maxFilesInContext": 30,
  "cursor.ai.indexFrequency": "onSave",
  "cursor.ai.cacheIndex": true,
  "cursor.ai.optimizeMemory": true,
  "cursor.ai.gcFrequency": "aggressive"
}
```

**For Small to Medium Codebases (<1000 files):**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.maxContextLength": 200000,
  "cursor.ai.autocompleteDelay": 300,
  "cursor.ai.maxFilesInContext": 50,
  "cursor.ai.indexFrequency": "onChange",
  "cursor.ai.cacheIndex": true,
  "cursor.ai.optimizeMemory": true,
  "cursor.ai.gcFrequency": "auto"
}
```

**For Maximum Speed (Lower Quality):**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.maxContextLength": 100000,
  "cursor.ai.autocompleteDelay": 500,
  "cursor.ai.maxFilesInContext": 20,
  "cursor.ai.contextStrategy": "minimal",
  "cursor.ai.indexFrequency": "manual",
  "cursor.ai.cacheIndex": true
}
```

#### 2.12 How to Access and Modify Settings

**Method 1: Settings UI**

1. Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
2. Search for "cursor" or "ai" in settings
3. Modify settings as needed

**Method 2: Settings JSON**

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Preferences: Open Settings (JSON)"
3. Add settings directly to JSON file

**Method 3: Workspace Settings**

1. Create `.vscode/settings.json` in project root
2. Add project-specific settings
3. These override user settings for this project

#### 2.13 Monitoring Performance

**Check Performance:**

- Open Command Palette (`Ctrl+Shift+P`)
- Type "Cursor: Show Performance"
- View metrics:
  - Average response time
  - API call frequency
  - Memory usage
  - Cache hit rate

**Performance Indicators:**

- Response time < 2 seconds: Excellent
- Response time 2-5 seconds: Good
- Response time > 5 seconds: Needs optimization

**Optimization Checklist:**

- [ ] Reduce context length if responses are slow
- [ ] Increase autocomplete delay if too frequent
- [ ] Exclude unnecessary files from indexing
- [ ] Enable caching for repeated queries
- [ ] Limit max files in context
- [ ] Use appropriate model for task complexity
- [ ] Clear cache if performance degrades
- [ ] Restart Cursor if memory usage is high

### 3. Create `.cursorrules` File

Create a `.cursorrules` file in your project root to provide project-specific instructions:

```markdown
# Project Rules for Cursor AI

## Project Overview

This is a full-stack order tracking application built with:

- Frontend: React + TypeScript + Redux Toolkit + Ant Design
- Backend: Node.js + TypeScript + Prisma + Express
- Database: PostgreSQL

## Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer named exports over default exports
- Use async/await instead of promises
- Always handle errors with try-catch blocks

## Architecture Patterns

- Use Redux Toolkit for state management
- Use RTK Query for API calls
- Follow repository pattern in backend
- Use dependency injection with Inversify
- Implement proper error handling at all layers

## Naming Conventions

- Components: PascalCase (e.g., UserManagement.tsx)
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with descriptive names

## File Structure

- Components in `src/Components/`
- Pages in `src/pages/`
- Store/Redux in `src/store/`
- Services in `src/services/`
- Types in `src/types/` or `@OrianaTypes`
- API routes follow RESTful conventions

## Important Patterns

- Always use typed hooks (useAppSelector, useAppDispatch)
- Use RTK Query hooks for API calls
- Implement proper loading and error states
- Use Ant Design components consistently
- Follow existing pagination patterns
- Standardize API responses (data, pagination objects)

## Testing

- Write unit tests for services
- Test API endpoints
- Test component rendering
- Use proper TypeScript types

## Security

- Never commit API keys or secrets
- Always validate user input
- Use JWT tokens for authentication
- Implement proper authorization checks
```

## Project Context Configuration

### 1. Create `.cursorignore` File

Exclude unnecessary files from indexing to improve performance:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Large files
*.min.js
*.min.css
*.bundle.js

# Test coverage
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
.cache/
```

### 2. Create `PROJECT_CONTEXT.md`

Create a comprehensive project context file that Cursor can reference:

```markdown
# Project Context

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, RTK Query, Ant Design
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Inversify DI
- **Database**: PostgreSQL
- **Authentication**: JWT tokens

## Project Structure

### Frontend (`ui/`)
```

src/
├── Components/ # Reusable components
│ ├── UserManagment/
│ ├── Admin/
│ └── ProductManagment/
├── pages/ # Page components
├── store/ # Redux store
│ ├── api/ # RTK Query APIs
│ └── slices/ # Redux slices
├── services/ # Business logic services
├── hooks/ # Custom React hooks
├── types/ # TypeScript types
└── styles/ # Global styles

```

### Backend (`api/`)
```

src/
├── controllers/ # Route handlers
├── services/ # Business logic
├── repositories/ # Data access layer
├── schemas/ # Request/Response schemas
│ ├── request/
│ └── response/
├── middleware/ # Express middleware
└── types/ # TypeScript types

````

## Key Patterns

### API Response Structure
All `getAll` APIs return:
```typescript
{
  data: T[],
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
````

### Redux Pattern

- Use RTK Query for all API calls
- Use `useAppSelector` and `useAppDispatch` hooks
- Transform responses in `transformResponse`
- Use `providesTags` and `invalidatesTags` for cache management

### Error Handling

- Global error handling in `baseApi.ts`
- 401 errors redirect to login
- Show toast notifications for errors
- Always handle loading and error states in components

## Common Tasks

### Adding a New API Endpoint

1. Add endpoint to appropriate API file in `store/api/`
2. Use `builder.query` or `builder.mutation`
3. Add proper TypeScript types
4. Use `transformResponse` if needed
5. Export hook (e.g., `useGetItemsQuery`)

### Adding a New Component

1. Create component file in appropriate directory
2. Use Ant Design components
3. Implement loading and error states
4. Use typed hooks from store
5. Follow existing component patterns

### Database Changes

1. Update Prisma schema
2. Run migration: `npx prisma migrate dev`
3. Regenerate Prisma client: `npx prisma generate`
4. Update related repositories and services

```

### 3. Use Codebase Indexing

Enable codebase indexing in Cursor:
- Go to Settings → Features → Codebase Indexing
- Enable "Index entire codebase"
- Wait for initial indexing to complete
- Index updates automatically on file changes

## Writing Effective Prompts

### Prompt Structure

Follow this structure for better results:

```

[Context] + [Action] + [Requirements] + [Constraints]

```

### Good Prompt Examples

#### ✅ Good: Specific and Contextual

```

@ui/src/pages/Dashboard.tsx
@ui/src/store/api/poApi.ts

In Dashboard.tsx, integrate the getPOs API from poApi.ts.
Requirements:

- Use useGetPOsQuery hook
- Implement server-side pagination with page limit 20
- Show loading state while fetching
- Display error message if API fails
- Update table to use data from API response
- Ensure pagination triggers new API calls on page change

Follow the same pattern used in UserManagment.tsx for consistency.

```

#### ✅ Good: With File References

```

@api/src/services/UserService.ts
@api/src/repositories/UserRepository.ts

Update UserService.getAllUsers to:

1. Use the standardized pagination response format
2. Return { data: UserResponse[], pagination: {...} }
3. Ensure sortBy parameter is passed to repository
4. Handle errors properly

Make sure the response matches the pattern in RoleService.getAllRoles.

```

#### ❌ Bad: Vague and Without Context

```

Fix the user service

```

#### ❌ Bad: Too Generic

```

Update the API

```

### Prompt Best Practices

1. **Always Reference Files**
   - Use `@filename` to reference specific files
   - Cursor can read and understand file contents

2. **Provide Context**
   - Mention related files or patterns
   - Reference existing implementations
   - Include relevant code snippets if needed

3. **Be Specific**
   - Specify exact requirements
   - Mention edge cases
   - Include validation rules

4. **Use Examples**
   - Show desired output format
   - Reference similar implementations
   - Include test cases if relevant

5. **Break Down Complex Tasks**
   - Split large tasks into smaller steps
   - Complete one feature at a time
   - Verify each step before moving on

### Prompt Templates

#### Template 1: Adding a New Feature

```

@related-file-1.tsx
@related-file-2.ts

Add [feature name] to [component/file]:

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Follow the pattern used in [similar-file.tsx].
Ensure:

- Proper TypeScript types
- Error handling
- Loading states
- Consistent with existing code style

```

#### Template 2: Fixing a Bug

```

@file-with-bug.tsx

Fix [bug description]:

- Current behavior: [what happens now]
- Expected behavior: [what should happen]
- Error message: [if any]

The issue is likely in [specific area].
Check [related files] for similar patterns.

```

#### Template 3: Refactoring

```

@file-to-refactor.tsx
@reference-file.tsx

Refactor [component/function] to:

- [Improvement 1]
- [Improvement 2]

Follow the pattern in [reference-file.tsx].
Maintain backward compatibility.
Update all usages.

```

## File Organization for Better Context

### 1. Organize Files Logically

```

ui/src/
├── Components/
│ ├── UserManagment/ # Group related components
│ │ ├── UserManagment.tsx
│ │ └── UserManagmentModal.tsx
│ └── Admin/
│ └── RoleManagment/
├── store/
│ ├── api/ # Group API files
│ │ ├── userApi.ts
│ │ ├── poApi.ts
│ │ └── baseApi.ts
│ └── slices/ # Group slices
└── types/ # Centralized types

````

### 2. Use Descriptive File Names

- ✅ Good: `UserManagment.tsx`, `poApi.ts`, `toastService.ts`
- ❌ Bad: `component.tsx`, `api.ts`, `utils.ts`

### 3. Keep Related Files Together

- Place components and their modals in the same directory
- Keep API files in `store/api/`
- Group related types together

### 4. Use Index Files for Exports

Create `index.ts` files to export related items:

```typescript
// ui/src/store/api/index.ts
export * from './userApi';
export * from './poApi';
export * from './roleApi';
````

## Using Cursor Features Effectively

### 1. Chat Feature

**When to Use:**

- Asking questions about codebase
- Getting explanations
- Planning implementation
- Debugging issues

**Tips:**

- Reference files with `@filename`
- Ask follow-up questions
- Request code examples
- Ask for best practices

### 2. Composer (Cmd/Ctrl + I)

**When to Use:**

- Making code changes
- Refactoring code
- Adding features
- Fixing bugs

**Tips:**

- Select code before opening Composer
- Provide clear instructions
- Review changes before accepting
- Use "Add to Chat" for complex changes

### 3. Inline Suggestions

**When to Use:**

- Writing new code
- Completing functions
- Adding comments
- Filling in types

**Tips:**

- Accept with `Tab`
- Reject with `Esc`
- Use `Ctrl+→` to accept word by word
- Configure delay in settings

### 4. Codebase Indexing

**Benefits:**

- Better context understanding
- More accurate suggestions
- Improved code completion
- Better refactoring

**Setup:**

- Enable in Settings
- Wait for initial index
- Keep codebase organized
- Update `.cursorignore` regularly

### 5. Multi-File Editing

**How to Use:**

- Select multiple files
- Use Composer with file references
- Mention relationships between files
- Review all changes together

## Best Practices

### 1. Provide Context

Always provide context when asking for changes:

```typescript
// ✅ Good
@ui/src/pages/Dashboard.tsx
@ui/src/store/api/poApi.ts

Update Dashboard to use the getPOs API...

// ❌ Bad
Update the dashboard
```

### 2. Reference Existing Patterns

Point to similar implementations:

```
Follow the same pattern used in UserManagment.tsx
Use the same structure as in RoleManagment.tsx
Match the API pattern in poApi.ts
```

### 3. Specify Requirements Clearly

```
Requirements:
- Server-side pagination with page limit 20
- Show loading spinner while fetching
- Display error message on failure
- Auto-refresh on successful mutations
```

### 4. Include Type Information

```
Ensure all types are properly defined:
- Use TypeScript interfaces
- Export types from @OrianaTypes
- Match existing type patterns
```

### 5. Mention Edge Cases

```
Handle these cases:
- Empty data arrays
- API errors (401, 500, network errors)
- Loading states
- Form validation errors
```

### 6. Request Testing

```
After implementation:
- Test with empty data
- Test error scenarios
- Verify TypeScript compilation
- Check for linting errors
```

## Common Mistakes to Avoid

### 1. ❌ Vague Prompts

```
Bad: "Fix the bug"
Good: "@file.tsx Fix the TypeScript error on line 45 where 'user' is possibly undefined. Add proper null checking."
```

### 2. ❌ Missing File References

```
Bad: "Update the user service"
Good: "@api/src/services/UserService.ts Update getAllUsers method to return standardized pagination response"
```

### 3. ❌ Not Providing Context

```
Bad: "Add pagination"
Good: "@Dashboard.tsx Add server-side pagination using the same pattern as @UserManagment.tsx. Use page limit 20 and ensure API calls on page change."
```

### 4. ❌ Ignoring Existing Patterns

```
Bad: "Create a new API endpoint"
Good: "@store/api/userApi.ts Add getUsers endpoint following the same pattern as getPOs in @poApi.ts. Include pagination and filtering."
```

### 5. ❌ Not Reviewing Changes

- Always review AI-generated code
- Check for TypeScript errors
- Verify linting passes
- Test the functionality
- Ensure consistency with codebase

### 6. ❌ Over-Reliance on AI

- Understand the code you're using
- Learn from AI suggestions
- Don't blindly accept all changes
- Review and refactor when needed

## Advanced Tips

### 1. Use Multi-File Context

Reference multiple related files:

```
@ui/src/pages/Dashboard.tsx
@ui/src/store/api/poApi.ts
@ui/src/Components/UserManagment/UserManagment.tsx

Update Dashboard to use getPOs API following the same pattern as UserManagment.
Ensure consistency in:
- Pagination handling
- Loading states
- Error handling
- Data transformation
```

### 2. Create Custom Instructions

Add project-specific instructions to `.cursorrules`:

```markdown
## API Integration Pattern

When integrating APIs:

1. Use RTK Query hooks
2. Implement loading and error states
3. Use transformResponse for data mapping
4. Add proper TypeScript types
5. Follow existing API patterns
```

### 3. Use Code Comments for Context

Add comments that help AI understand intent:

```typescript
// TODO: Integrate getPOs API here
// Follow pattern from UserManagment.tsx
// Requirements: pagination, loading state, error handling
const Dashboard = () => {
  // ...
};
```

### 4. Leverage Type Information

Provide type information in prompts:

```
@types/user.ts
@services/UserService.ts

Update UserService to return UserResponse[] with proper typing.
Ensure all fields match the UserResponse interface.
```

### 5. Use Step-by-Step Instructions

Break complex tasks into steps:

```
Step 1: Create toastSlice.ts with Redux slice
Step 2: Create toastService.ts with core service
Step 3: Create ToastProvider component
Step 4: Integrate in index.tsx
Step 5: Update baseApi.ts to use toast service
```

### 6. Reference Documentation

Point to relevant documentation:

```
Follow the RTK Query documentation pattern for:
- Query endpoints
- Mutation endpoints
- Cache invalidation
- Error handling
```

### 7. Use Examples from Codebase

Reference existing implementations:

```
Use the same pattern as:
- UserManagment.tsx for table with pagination
- poApi.ts for API endpoint structure
- baseApi.ts for error handling
```

## Troubleshooting

### Issue: AI Not Understanding Context

**Solutions:**

- Add more file references with `@filename`
- Provide explicit context in prompt
- Reference similar implementations
- Update `.cursorrules` with project patterns

### Issue: Inaccurate Suggestions

**Solutions:**

- Ensure codebase is indexed
- Check `.cursorignore` isn't excluding important files
- Provide more specific requirements
- Reference existing code patterns

### Issue: AI Making Breaking Changes

**Solutions:**

- Review all changes before accepting
- Test after each change
- Use version control (Git)
- Ask for incremental changes

### Issue: Slow Performance

**Solutions:**

- Update `.cursorignore` to exclude large files
- Reduce context length in settings
- Close unused files
- Restart Cursor if needed

### Issue: TypeScript Errors After Changes

**Solutions:**

- Ask AI to fix TypeScript errors
- Provide type information in prompt
- Reference existing type definitions
- Check for missing imports

## Quick Reference Checklist

### Before Asking AI

- [ ] Have I provided file references with `@filename`?
- [ ] Have I included context about what needs to be done?
- [ ] Have I referenced similar implementations?
- [ ] Have I specified requirements clearly?
- [ ] Have I mentioned edge cases to handle?

### After AI Suggests Changes

- [ ] Review all changes carefully
- [ ] Check for TypeScript errors
- [ ] Verify linting passes
- [ ] Test the functionality
- [ ] Ensure consistency with codebase
- [ ] Check for missing imports
- [ ] Verify error handling

### Regular Maintenance

- [ ] Update `.cursorrules` as project evolves
- [ ] Keep `.cursorignore` up to date
- [ ] Update `PROJECT_CONTEXT.md` with new patterns
- [ ] Review and refine prompts based on results
- [ ] Keep Cursor updated to latest version

## Example Workflow

### Adding a New Feature

1. **Plan**: Ask AI about approach

   ```
   I want to add a toast notification system. What's the best approach for this project?
   ```

2. **Reference**: Point to similar features

   ```
   @UserManagment.tsx How are notifications currently handled?
   ```

3. **Implement**: Provide detailed instructions

   ```
   @store/api/baseApi.ts Create a toast service following this pattern...
   ```

4. **Review**: Check the implementation

   ```
   @services/toastService.ts Review this implementation and suggest improvements
   ```

5. **Test**: Ask for test cases
   ```
   What test cases should I write for the toast service?
   ```

## Quick Settings Reference

### Essential Performance Settings (Copy-Paste Ready)

Add these to your `settings.json` for optimal performance:

```json
{
  // AI Model - Balance of speed and quality
  "cursor.ai.model": "claude-3.5-sonnet",

  // Codebase Indexing
  "cursor.ai.enableCodebaseIndexing": true,
  "cursor.ai.indexFrequency": "onChange",
  "cursor.ai.maxFileSize": 100,
  "cursor.ai.cacheIndex": true,

  // Context Window
  "cursor.ai.maxContextLength": 200000,
  "cursor.ai.contextStrategy": "smart",
  "cursor.ai.maxFilesInContext": 50,
  "cursor.ai.prioritizeRecentFiles": true,

  // Autocomplete
  "cursor.ai.enableAutocomplete": true,
  "cursor.ai.autocompleteDelay": 300,
  "cursor.ai.minCharsForSuggestions": 2,
  "cursor.ai.cacheAutocomplete": true,
  "cursor.ai.autocompleteDebounce": 150,

  // Chat/Composer
  "cursor.ai.maxChatHistory": 20,
  "cursor.ai.streamResponses": true,
  "cursor.ai.cacheChatResponses": true,

  // Memory Optimization
  "cursor.ai.optimizeMemory": true,
  "cursor.ai.gcFrequency": "auto",
  "cursor.ai.cacheSizeLimit": 512,

  // Network
  "cursor.ai.requestTimeout": 30000,
  "cursor.ai.compressRequests": true,
  "cursor.ai.batchApiCalls": true,

  // Editor
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestionsDelay": 300,
  "editor.tabCompletion": "on",

  // File Watching (Exclude large directories)
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.git/**": true,
    "**/.next/**": true,
    "**/.cache/**": true
  }
}
```

### Quick Performance Fixes

**If Cursor is slow:**

1. Increase `autocompleteDelay` to 500ms
2. Reduce `maxContextLength` to 100000
3. Set `indexFrequency` to "onSave"
4. Exclude more directories in `files.watcherExclude`
5. Clear cache: Command Palette → "Cursor: Clear Cache"

**If responses are inaccurate:**

1. Increase `maxContextLength` to 200000
2. Increase `maxFilesInContext` to 50
3. Set `contextStrategy` to "smart"
4. Enable `includeRelatedFiles`

**If memory usage is high:**

1. Set `gcFrequency` to "aggressive"
2. Reduce `cacheSizeLimit` to 256
3. Reduce `maxContextLength`
4. Disable unused extensions

**If autocomplete is too frequent:**

1. Increase `autocompleteDelay` to 400-500ms
2. Increase `minCharsForSuggestions` to 3-4
3. Increase `autocompleteDebounce` to 200ms

### Settings by Use Case

**Daily Development (Balanced):**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.autocompleteDelay": 300,
  "cursor.ai.maxContextLength": 200000,
  "cursor.ai.indexFrequency": "onChange"
}
```

**Code Review (Quality Focus):**

```json
{
  "cursor.ai.model": "claude-3-opus",
  "cursor.ai.maxContextLength": 200000,
  "cursor.ai.maxFilesInContext": 50,
  "cursor.ai.contextStrategy": "full"
}
```

**Quick Edits (Speed Focus):**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.autocompleteDelay": 500,
  "cursor.ai.maxContextLength": 100000,
  "cursor.ai.contextStrategy": "minimal",
  "cursor.ai.indexFrequency": "onSave"
}
```

### Accessing Settings

**Quick Access:**

- Settings UI: `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
- Settings JSON: `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"
- Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

**Search Settings:**

- Type "cursor" in settings search
- Type "ai" for AI-related settings
- Type "autocomplete" for autocomplete settings

### Performance Monitoring

**Check Performance Metrics:**

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Cursor: Show Performance"
3. View:
   - Average response time
   - API call frequency
   - Memory usage
   - Cache hit rate

**Target Metrics:**

- Response time: < 2 seconds (Excellent)
- Response time: 2-5 seconds (Good)
- Memory usage: < 2GB (Optimal)
- Cache hit rate: > 70% (Good)

## Conclusion

By following this guide, you can significantly improve Cursor AI's performance and get better results. Remember:

1. **Context is Key**: Always provide file references and context
2. **Be Specific**: Clear requirements lead to better results
3. **Review Everything**: Don't blindly accept AI suggestions
4. **Learn and Adapt**: Refine your prompts based on results
5. **Stay Organized**: Keep your codebase well-structured
6. **Optimize Settings**: Adjust settings based on your workflow and project size
7. **Monitor Performance**: Regularly check metrics and adjust as needed

**Quick Start Checklist:**

- [ ] Configure AI model (Claude 3.5 Sonnet recommended)
- [ ] Enable codebase indexing
- [ ] Set appropriate context length for your project
- [ ] Configure autocomplete delay
- [ ] Exclude unnecessary directories from file watching
- [ ] Create `.cursorrules` file with project guidelines
- [ ] Create `.cursorignore` file to exclude large files
- [ ] Test performance and adjust settings as needed

Happy coding with Cursor AI! 🚀
