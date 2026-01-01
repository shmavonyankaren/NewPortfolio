# JobsManager Component Structure

The JobsManager component has been refactored into smaller, more maintainable sub-components.

## File Structure

```
components/admin/
├── JobsManager.tsx (Main container component)
├── types/
│   └── job.ts (Shared type definitions)
└── jobs/
    ├── index.ts (Export barrel)
    ├── JobHeader.tsx (Title + Add/Delete All buttons)
    ├── JobForm.tsx (Form for creating/editing jobs)
    ├── JobList.tsx (List of jobs with edit/delete actions)
    ├── SkillInput.tsx (Skill adding/display component)
    └── ResponsibilityInput.tsx (Responsibility adding/display component)
```

## Component Responsibilities

### JobsManager.tsx (257 lines)

- Main state management (jobs, form data, UI state)
- API calls (fetchJobs, handleSubmit, handleDelete)
- Event handlers for all sub-components
- Composition of child components

### JobHeader.tsx

- Displays "Jobs Management" title
- Add Job / Close button with dynamic text
- Delete All button (shown when jobs exist)

### JobForm.tsx

- Form fields for job details (company, position, dates, logo)
- Integrates SkillInput and ResponsibilityInput
- Handles form submission and cancellation

### JobList.tsx

- Renders list of jobs (filtered to exclude editing item)
- Edit and Delete buttons for each job
- Empty state message when no jobs exist

### SkillInput.tsx

- Displays existing skills with images
- Add Skill button that toggles input mode
- Skill name input + optional image upload
- Save/Cancel buttons for skill entry

### ResponsibilityInput.tsx

- Displays existing responsibilities with delete buttons
- Add Responsibility button that toggles input mode
- Textarea for responsibility text input
- Save/Cancel buttons for responsibility entry

### types/job.ts

- Skill interface (name + optional image)
- Job interface (all job properties)

## Benefits

✅ **Separation of Concerns**: Each component has a single, clear responsibility
✅ **Reusability**: SkillInput and ResponsibilityInput can be used elsewhere
✅ **Maintainability**: Smaller files are easier to understand and modify
✅ **Testability**: Components can be tested in isolation
✅ **Prop Drilling Clarity**: Clear data flow through props
✅ **Type Safety**: Centralized type definitions in types/job.ts

## Props Flow

```
JobsManager (State + Logic)
├── JobHeader (jobCount, showForm, editingId, onAddClick, onDeleteAll)
├── JobForm (formData, editingId, handlers for all form interactions)
│   ├── SkillInput (skills, tempSkill, tempSkillImage, handlers)
│   └── ResponsibilityInput (responsibilities, tempResponsibility, handlers)
└── JobList (jobs, editingId, showForm, onEdit, onDelete)
```

## Import Example

```typescript
// Old way
import JobsManager from "./JobsManager";

// New way with barrel export
import {
  JobHeader,
  JobForm,
  JobList,
  SkillInput,
  ResponsibilityInput,
} from "./jobs";
import JobsManager from "./JobsManager";
```
