# Cursor AI Best Practices for This Project

## Daily Workflow

### 1. Start of Day
- Open Cursor AI
- Wait for codebase indexing to complete
- Review any pending changes
- Check `.cursorrules` for updates

### 2. Before Asking AI
- ✅ Have you read the relevant files?
- ✅ Do you understand the existing pattern?
- ✅ Have you checked similar implementations?
- ✅ Are your requirements clear?

### 3. Writing Prompts
- Always use `@filename` to reference files
- Provide context about what you're trying to achieve
- Reference similar implementations
- Be specific about requirements
- Mention edge cases

### 4. After AI Suggestions
- Review all changes carefully
- Check TypeScript compilation
- Run linter
- Test functionality
- Verify consistency with codebase

## Prompt Writing Guidelines

### ✅ DO
- Reference multiple related files
- Provide clear requirements
- Mention similar implementations
- Specify edge cases
- Ask for explanations when needed

### ❌ DON'T
- Use vague prompts ("fix this")
- Skip file references
- Ignore existing patterns
- Accept code without review
- Skip testing

## Common Scenarios

### Scenario 1: Adding a New Feature

**Step 1: Research**
```
@similar-feature-file.tsx
How does [similar feature] work? What patterns does it use?
```

**Step 2: Plan**
```
Based on [similar-feature-file.tsx], what's the best approach to add [new feature]?
```

**Step 3: Implement**
```
@target-file.tsx
@similar-feature-file.tsx

Add [new feature] following the same pattern as [similar feature]:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
```

### Scenario 2: Fixing a Bug

**Step 1: Understand**
```
@file-with-bug.tsx
What's wrong with this code? Why is [error] happening?
```

**Step 2: Fix**
```
@file-with-bug.tsx
@similar-working-file.tsx

Fix [bug description]:
- Current: [what happens]
- Expected: [what should happen]
- Follow pattern from [similar-working-file.tsx]
```

### Scenario 3: Refactoring

**Step 1: Analyze**
```
@file-to-refactor.tsx
What improvements can be made to this code?
```

**Step 2: Refactor**
```
@file-to-refactor.tsx
@reference-file.tsx

Refactor to:
- [Improvement 1]
- [Improvement 2]

Maintain backward compatibility.
Follow patterns from [reference-file.tsx].
```

## Team Collaboration

### Sharing Context
1. Keep `.cursorrules` updated
2. Update `PROJECT_CONTEXT.md` with new patterns
3. Document new conventions
4. Share learnings with team

### Code Reviews
- Check if AI-generated code follows patterns
- Verify consistency with codebase
- Ensure proper error handling
- Confirm TypeScript types are correct

### Maintaining Files
- Update `.cursorrules` when patterns change
- Keep `PROJECT_CONTEXT.md` current
- Add new patterns to quick reference
- Document common issues and solutions

## Troubleshooting

### AI Not Understanding Context
1. Add more file references
2. Provide explicit examples
3. Reference similar implementations
4. Break down into smaller steps

### Inaccurate Suggestions
1. Check codebase indexing status
2. Verify `.cursorignore` isn't excluding important files
3. Provide more specific requirements
4. Reference existing code patterns

### Slow Performance
1. Check `.cursorignore` includes large directories
2. Reduce context length in settings
3. Close unused files
4. Restart Cursor if needed

## Maintenance Checklist

### Weekly
- [ ] Review and update `.cursorrules` if needed
- [ ] Check `PROJECT_CONTEXT.md` is current
- [ ] Update quick reference with new patterns
- [ ] Clear Cursor cache if performance degrades

### Monthly
- [ ] Review team's common issues
- [ ] Update best practices based on learnings
- [ ] Optimize `.cursorignore` if needed
- [ ] Share improvements with team

## Learning from AI

### Study Generated Code
- Understand why AI chose certain patterns
- Learn new TypeScript techniques
- Discover better ways to structure code
- Improve your own coding style

### Ask for Explanations
```
@generated-code.tsx
Why did you use [pattern/approach]? What are the benefits?
```

### Request Alternatives
```
@current-implementation.tsx
What are alternative ways to implement this? What are the trade-offs?
```

## Advanced Tips

### Multi-File Refactoring
```
@file1.tsx
@file2.tsx
@file3.tsx

Refactor these files to use a shared [component/hook/utility]:
- Extract common logic
- Maintain existing functionality
- Update all usages
```

### Pattern Extraction
```
@file1.tsx
@file2.tsx
@file3.tsx

These files all use [pattern]. Create a reusable [component/hook] that follows the same pattern.
```

### Documentation Generation
```
@complex-function.ts
Generate JSDoc comments explaining:
- What this function does
- Parameters and return types
- Usage examples
- Edge cases
```

## Success Metrics

Track your improvement:
- ✅ Faster development with AI assistance
- ✅ More consistent code patterns
- ✅ Fewer bugs in AI-generated code
- ✅ Better understanding of codebase
- ✅ Improved code quality

## Remember

1. **AI is a Tool**: Use it to enhance, not replace, your understanding
2. **Review Everything**: Always review AI suggestions
3. **Learn Patterns**: Understand why AI suggests certain patterns
4. **Stay Consistent**: Follow project conventions
5. **Iterate**: Refine prompts based on results

