# Admin System Documentation

## Overview

A complete content management system (CMS) for your portfolio, built with MongoDB, Next.js, and React. Manage all your portfolio data dynamically without code changes.

## Features

### ✅ Complete CRUD Operations

- **Projects**: Create, read, update, delete projects with full details
- **Jobs**: Manage work experience, positions, and skills
- **Education**: Track educational background and qualifications
- **Contact Info**: Update contact details and social media links
- **Client Comments**: Manage testimonials and client feedback

### ✅ Authentication

- Secure login system with HTTP-only cookies
- Middleware protection for admin routes
- Auto-redirect for logged-in users
- Session management

### ✅ Data Management

- Real-time CRUD operations
- MongoDB integration with Mongoose
- Form validation
- Dynamic form handling

## Project Structure

```
portfolio/
├── lib/
│   ├── db/
│   │   └── connection.ts           # MongoDB connection
│   ├── models/
│   │   ├── Project.ts
│   │   ├── Job.ts
│   │   ├── Education.ts
│   │   ├── Contact.ts
│   │   └── ClientComment.ts
│   └── actions/
│       └── admin.actions.ts        # Login/logout functions
├── components/
│   └── admin/
│       ├── ProjectsManager.tsx
│       ├── JobsManager.tsx
│       ├── EducationManager.tsx
│       ├── ContactManager.tsx
│       └── CommentsManager.tsx
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── projects/
│   │       ├── jobs/
│   │       ├── educations/
│   │       ├── contacts/
│   │       └── comments/
│   ├── login/
│   │   └── page.tsx
│   └── admin-dashboard/
│       └── page.tsx
└── middleware.ts                   # Auth protection
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mongoose
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
ADMIN_NAME=admin
ADMIN_PASSWORD=your_secure_password
RESEND_EMAIL_API_KEY=your_resend_key
```

### 3. MongoDB Setup

1. Create a MongoDB Atlas account (mongodb.com)
2. Create a new cluster
3. Get your connection string
4. Add it to `.env.local` as `MONGODB_URI`

### 4. Access Admin Dashboard

- Navigate to `/login`
- Use your `ADMIN_NAME` and `ADMIN_PASSWORD`
- You'll be redirected to `/admin-dashboard`

## API Routes

### Projects

- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/[id]` - Get single project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Jobs

- `GET /api/admin/jobs`
- `POST /api/admin/jobs`
- `GET /api/admin/jobs/[id]`
- `PUT /api/admin/jobs/[id]`
- `DELETE /api/admin/jobs/[id]`

### Education

- `GET /api/admin/educations`
- `POST /api/admin/educations`
- `GET /api/admin/educations/[id]`
- `PUT /api/admin/educations/[id]`
- `DELETE /api/admin/educations/[id]`

### Contact

- `GET /api/admin/contacts`
- `POST /api/admin/contacts`
- `GET /api/admin/contacts/[id]`
- `PUT /api/admin/contacts/[id]`
- `DELETE /api/admin/contacts/[id]`

### Comments

- `GET /api/admin/comments`
- `POST /api/admin/comments`
- `GET /api/admin/comments/[id]`
- `PUT /api/admin/comments/[id]`
- `DELETE /api/admin/comments/[id]`

## Data Schemas

### Project

```json
{
  "title": "string",
  "description": "string",
  "shortDescription": "string",
  "image": "string (URL)",
  "technologies": ["string"],
  "features": [{ "title": "string", "description": "string" }],
  "challenges": [{ "challenge": "string", "solution": "string" }],
  "demoUrl": "string (optional)",
  "githubUrl": "string (optional)",
  "duration": "string",
  "teamSize": "number",
  "status": "completed | in-progress | planned"
}
```

### Job

```json
{
  "company": "string",
  "position": "string",
  "description": "string",
  "startDate": "Date",
  "endDate": "Date (optional)",
  "isCurrentlyWorking": "boolean",
  "skills": ["string"],
  "logo": "string (optional URL)"
}
```

### Education

```json
{
  "institution": "string",
  "degree": "string",
  "field": "string",
  "startDate": "Date",
  "endDate": "Date (optional)",
  "description": "string",
  "gpa": "number (optional)",
  "logo": "string (optional URL)"
}
```

### Contact

```json
{
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedIn": "string (optional URL)",
  "github": "string (optional URL)",
  "twitter": "string (optional URL)",
  "website": "string (optional URL)",
  "bio": "string"
}
```

### ClientComment

```json
{
  "clientName": "string",
  "company": "string",
  "comment": "string",
  "rating": "number (1-5)",
  "image": "string (optional URL)"
}
```

## Usage Examples

### Adding a Project

1. Go to Admin Dashboard → Projects tab
2. Click "Add Project"
3. Fill in the form fields
4. Click "Create Project"

### Editing Data

1. Find the item in the list
2. Click the blue "Edit" button
3. Update the fields
4. Click "Update"

### Deleting Data

1. Click the red "Delete" button
2. Confirm the deletion

## Component Details

### ProjectsManager

- Add/edit/delete projects
- Manage technologies, features, and challenges
- Track project status and team size

### JobsManager

- Add work experience
- Mark current employment
- List required skills
- Track employment dates

### EducationManager

- Add educational background
- Track GPA
- Manage institutions and fields
- Date range tracking

### ContactManager

- Update contact information
- Manage social media links
- Store bio and location
- Single contact record per instance

### CommentsManager

- Manage client testimonials
- 5-star rating system
- Client company information
- Profile image support

## Security Features

✅ HTTP-only cookies (prevents XSS attacks)
✅ Server-side authentication (middleware)
✅ CSRF protection via Next.js
✅ Password in environment variables
✅ Automatic session timeout (24 hours)
✅ Protected API routes

## Extending the System

To add a new data type:

1. Create a Mongoose schema in `/lib/models/`
2. Create API routes in `/app/api/admin/`
3. Create a Manager component in `/components/admin/`
4. Add to the admin dashboard tabs

## Troubleshooting

**MongoDB Connection Error**

- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas network access settings
- Ensure credentials are correct

**Forms Not Submitting**

- Check browser console for errors
- Verify API routes are created
- Check network tab in DevTools

**Data Not Loading**

- Verify database is running
- Check API response in browser DevTools
- Ensure MongoDB connection is established

## Next Steps

1. Set up MongoDB Atlas
2. Add environment variables to `.env.local`
3. Test login with admin credentials
4. Start adding your portfolio data
5. Integrate data fetching in your portfolio pages
