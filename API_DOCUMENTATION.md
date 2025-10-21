# HRMS-AI-Next API Documentation

Welcome to the API documentation for HRMS-AI-Next. This document provides a detailed overview of all the available API endpoints, their functionalities, required parameters, and authorization requirements.

## Table of Contents

- [Authentication](#authentication)
- [Admin](#admin)
- [AI](#ai)
- [Analytics](#analytics)
- [Announcements](#announcements)
- [Approvals](#approvals)
- [Audit Events](#audit-events)
- [Compensation](#compensation)
- [Dashboard](#dashboard)
- [Employee](#employee)
- [Employee Skills](#employee-skills)
- [Goals](#goals)
- [Leave](#leave)
- [Manager](#manager)
- [Payroll](#payroll)
- [Payslips](#payslips)
- [Profile](#profile)
- [Recruitment](#recruitment)
- [Role Skill Matrix](#role-skill-matrix)
- [Skills](#skills)
- [Team](#team)
- [Users](#users)

---

## Admin

### `/api/admin/settings`

-   **GET**: Fetches the company settings.
    -   **Authorization**: Admin
    -   **Response**:
        ```json
        {
          "companyName": "Example Corp",
          "logoUrl": "https://example.com/logo.png",
          "geminiApiKeyIsSet": true
        }
        ```
-   **POST**: Updates the company settings.
    -   **Authorization**: Admin
    -   **Request Body**:
        ```json
        {
          "companyName": "New Example Corp",
          "logoUrl": "https://example.com/new-logo.png"
        }
        ```
    -   **Response**:
        ```json
        {
          "message": "Settings updated successfully"
        }
        ```

### `/api/admin/system-status`

-   **GET**: Retrieves the current system status.
    -   **Authorization**: Admin
    -   **Response**:
        ```json
        {
          "database": "Connected",
          "activeSessions": 5
        }
        ```
---
## AI

### `/api/ai/analyze-role`

-   **POST**: Analyzes a job description to extract the role name and required skills, then saves the data to the `RoleSkillMatrix`.
    -   **Authorization**: Admin, HR
    -   **Request Body**:
        ```json
        {
          "jobDescription": "We are looking for a Senior Software Engineer with expertise in React and Node.js."
        }
        ```
    -   **Response**: The created or updated `RoleSkillMatrix` object.
        ```json
        {
            "_id": "60d5f3f2c3b6a0b3e8e4b3b2",
            "roleName": "Senior Software Engineer",
            "requiredSkills": [
                {
                    "skillId": "60d5f3f2c3b6a0b3e8e4b3b3",
                    "requiredProficiency": "Advanced"
                },
                {
                    "skillId": "60d5f3f2c3b6a0b3e8e4b3b4",
                    "requiredProficiency": "Intermediate"
                }
            ]
        }
        ```

### `/api/ai/assistant`

-   **POST**: Provides a conversational AI assistant that answers questions based on the user's role and data context.
    -   **Authorization**: All roles (Employee, Manager, HR, Admin). The data context provided to the AI is role-dependent.
    -   **Request Body**:
        ```json
        {
          "query": "What are my current performance goals?"
        }
        ```
    -   **Response**:
        ```json
        {
          "response": "Based on the information I have, your current performance goals are: [List of goals]. Please let me know if you have any other questions."
        }
        ```
---
## Analytics

### `/api/analytics/attrition-risk`

-   **GET**: Fetches an analysis of all employees to determine their attrition risk.
    -   **Authorization**: Admin, HR
    -   **Response**: An array of employee attrition risk data.
        ```json
        [
            {
                "employeeId": "60d5f3f2c3b6a0b3e8e4b3b2",
                "name": "John Doe",
                "jobTitle": "Software Engineer",
                "riskScore": 75,
                "contributingFactors": [
                    "Low Tenure",
                    "Low Goal Progress",
                    "High Overtime"
                ],
                "overtimeHours": 15,
                "satisfactionScore": 2
            }
        ]
        ```

### `/api/analytics/skill-drift/[employeeId]`

-   **GET**: Calculates the skill drift for a specific employee by comparing their current skills to the required skills for their role.
    -   **Authorization**: Manager, Admin, HR
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the employee to analyze.
    -   **Response**: An array of skill drift data.
        ```json
        [
            {
                "skill": "React",
                "requiredProficiency": "Advanced",
                "currentProficiency": "Intermediate",
                "gap": 1
            },
            {
                "skill": "Node.js",
                "requiredProficiency": "Intermediate",
                "currentProficiency": "Intermediate",
                "gap": 0
            }
        ]
        ```
---
## Announcements

### `/api/announcements`

-   **GET**: Fetches all announcements.
    -   **Authorization**: All authenticated users.
    -   **Response**: An array of announcement objects.

-   **POST**: Creates a new announcement.
    -   **Authorization**: Admin, HR
    -   **Request Body**:
        ```json
        {
          "title": "New Company Policy",
          "content": "Details about the new policy."
        }
        ```
    -   **Response**: The created announcement object.

---
## Approvals

### `/api/approvals`

-   **GET**: Fetches all pending approvals. The data returned is dependent on the user's role.
    -   **Authorization**: Manager, Admin
    -   **Response**: An array of approval request objects.

### `/api/approvals/[id]`

-   **PATCH**: Updates the status of an approval request.
    -   **Authorization**: Manager, Admin
    -   **Parameters**:
        -   `id` (in URL): The ID of the approval request to update.
    -   **Request Body**:
        ```json
        {
          "status": "Approved"
        }
        ```
    -   **Response**:
        ```json
        {
          "message": "Approval status updated successfully."
        }
        ```

---
## Audit Events

### `/api/audit-events`

-   **GET**: Fetches all audit events.
    -   **Authorization**: Admin, HR
    -   **Response**: An array of audit event objects.

---
## Authentication

### `/api/auth/login`

-   **POST**: Authenticates a user and returns a JWT.
    -   **Authorization**: None
    -   **Request Body**:
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    -   **Response**:
        ```json
        {
          "message": "Login successful",
          "user": {
            "id": "60d5f3f2c3b6a0b3e8e4b3b2",
            "name": "John Doe",
            "email": "user@example.com",
            "role": "employee"
          }
        }
        ```

### `/api/auth/logout`

-   **POST**: Logs out the current user by clearing the JWT cookie.
    -   **Authorization**: All authenticated users.
    -   **Response**:
        ```json
        {
          "message": "Logged out successfully"
        }
        ```

### `/api/auth/register`

-   **POST**: Registers a new user.
    -   **Authorization**: None
    -   **Request Body**:
        ```json
        {
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "password": "password123"
        }
        ```
    -   **Response**: The newly created user object.

---
## Compensation

### `/api/compensation/[employeeId]`

-   **GET**: Fetches the salary structure for a specific employee.
    -   **Authorization**: Admin, HR, Manager (for their team members)
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the employee.
    -   **Response**: The salary structure object.

### `/api/compensation/salary-structure`

-   **POST**: Creates or updates a salary structure for an employee.
    -   **Authorization**: Admin, HR
    -   **Request Body**:
        ```json
        {
          "employeeId": "60d5f3f2c3b6a0b3e8e4b3b2",
          "baseSalary": 60000,
          "bonus": 5000,
          "allowances": {
            "housing": 1000,
            "transport": 500
          }
        }
        ```
    -   **Response**: The created or updated salary structure object.
---
## Dashboard

### `/api/dashboard/employee`

-   **GET**: Fetches the necessary data for the employee dashboard.
    -   **Authorization**: Employee
    -   **Response**: An object containing dashboard data.

### `/api/dashboard/manager`

-   **GET**: Fetches the necessary data for the manager dashboard.
    -   **Authorization**: Manager
    -   **Response**: An object containing dashboard data.

---
## Employee

### `/api/employee/profile`

-   **GET**: Fetches the profile of the currently authenticated employee.
    -   **Authorization**: Employee
    -   **Response**: The user object for the employee.

---
## Employee Skills

### `/api/employee-skills`

-   **GET**: Fetches all skills for the currently authenticated employee.
    -   **Authorization**: Employee
    -   **Response**: An array of employee skill objects.

-   **POST**: Adds a new skill to the employee's profile.
    -   **Authorization**: Employee
    -   **Request Body**:
        ```json
        {
          "skillId": "60d5f3f2c3b6a0b3e8e4b3b3",
          "currentProficiency": "Intermediate"
        }
        ```
    -   **Response**: The newly created employee skill object.

---
## Goals

### `/api/goals`

-   **GET**: Fetches all goals for the currently authenticated user.
    -   **Authorization**: All authenticated users.
    -   **Response**: An array of goal objects.

-   **POST**: Creates a new goal.
    -   **Authorization**: Employee, Manager
    -   **Request Body**:
        ```json
        {
          "title": "Learn a new technology",
          "description": "I will learn how to use GraphQL.",
          "dueDate": "2024-12-31"
        }
        ```
    -   **Response**: The newly created goal object.

### `/api/goals/[goalId]`

-   **PUT**: Updates a goal.
    -   **Authorization**: Employee, Manager
    -   **Parameters**:
        -   `goalId` (in URL): The ID of the goal to update.
    -   **Request Body**:
        ```json
        {
          "progress": 50
        }
        ```
    -   **Response**: The updated goal object.

-   **DELETE**: Deletes a goal.
    -   **Authorization**: Employee, Manager
    -   **Parameters**:
        -   `goalId` (in URL): The ID of the goal to delete.
    -   **Response**:
        ```json
        {
          "message": "Goal deleted successfully"
        }
        ```

---
## Leave

### `/api/leave`

-   **GET**: Fetches all leave requests for the currently authenticated user.
    -   **Authorization**: All authenticated users.
    -   **Response**: An array of leave request objects.

-   **POST**: Creates a new leave request.
    -   **Authorization**: Employee
    -   **Request Body**:
        ```json
        {
          "startDate": "2024-08-01",
          "endDate": "2024-08-05",
          "reason": "Vacation"
        }
        ```
    -   **Response**: The newly created leave request object.

### `/api/leave/[id]`

-   **GET**: Fetches a specific leave request.
    -   **Authorization**: All authenticated users.
    -   **Parameters**:
        -   `id` (in URL): The ID of the leave request.
    -   **Response**: The leave request object.
---
## Manager

### `/api/manager/team-members`

-   **GET**: Fetches all team members for the currently authenticated manager.
    -   **Authorization**: Manager
    -   **Response**: An array of user objects.

---
## Payroll

### `/api/payroll/run`

-   **POST**: Initiates a payroll run for a specific employee.
    -   **Authorization**: Admin, HR
    -   **Request Body**:
        ```json
        {
          "employeeId": "60d5f3f2c3b6a0b3e8e4b3b2",
          "month": 8,
          "year": 2024
        }
        ```
    -   **Response**: The newly created payslip object.

---
## Payslips

### `/api/payslips`

-   **GET**: Fetches all payslips for the currently authenticated user.
    -   **Authorization**: Employee
    -   **Response**: An array of payslip objects.

---
## Profile

### `/api/profile/upload`

-   **POST**: Uploads a new profile picture for the currently authenticated user.
    -   **Authorization**: All authenticated users.
    -   **Request Body**: `multipart/form-data` with a single file field named `profilePicture`.
    -   **Response**:
        ```json
        {
          "message": "Profile picture uploaded successfully",
          "photoUrl": "https://example.com/new-profile-picture.png"
        }
        ```

---
## Recruitment

### `/api/recruitment/screen-resume`

-   **POST**: Screens a resume against a job description.
    -   **Authorization**: Admin, HR
    -   **Request Body**: `multipart/form-data` with two fields: `resume` (file) and `jobDescription` (text).
    -   **Response**: An object containing the screening results.

---
## Role Skill Matrix

### `/api/role-skill-matrix`

-   **GET**: Fetches all role skill matrices.
    -   **Authorization**: Admin, HR
    -   **Response**: An array of role skill matrix objects.

---
## Skills

### `/api/skills`

-   **GET**: Fetches all skills.
    -   **Authorization**: All authenticated users.
    -   **Response**: An array of skill objects.

-   **POST**: Creates a new skill.
    -   **Authorization**: Admin, HR
    -   **Request Body**:
        ```json
        {
          "name": "New Skill"
        }
        ```
    -   **Response**: The newly created skill object.

### `/api/skills/[id]`

-   **DELETE**: Deletes a skill.
    -   **Authorization**: Admin, HR
    -   **Parameters**:
        -   `id` (in URL): The ID of the skill to delete.
    -   **Response**:
        ```json
        {
          "message": "Skill deleted successfully"
        }
        ```

---
## Team

### `/api/team/[employeeId]/goals`

-   **GET**: Fetches all goals for a specific team member.
    -   **Authorization**: Manager
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the team member.
    -   **Response**: An array of goal objects.

---
## Users

### `/api/users`

-   **GET**: Fetches all users.
    -   **Authorization**: Admin, HR
    -   **Response**: An array of user objects.

### `/api/users/[employeeId]`

-   **GET**: Fetches a specific user.
    -   **Authorization**: Admin, HR
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the user.
    -   **Response**: The user object.

-   **PUT**: Updates a user's profile.
    -   **Authorization**: Admin, HR
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the user to update.
    -   **Request Body**:
        ```json
        {
          "name": "New Name",
          "role": "manager"
        }
        ```
    -   **Response**: The updated user object.

### `/api/users/[employeeId]/change-password`

-   **PUT**: Changes a user's password.
    -   **Authorization**: Admin
    -   **Parameters**:
        -   `employeeId` (in URL): The ID of the user.
    -   **Request Body**:
        ```json
        {
          "newPassword": "newPassword123"
        }
        ```
    -   **Response**:
        ```json
        {
          "message": "Password updated successfully"
        }
        ```
