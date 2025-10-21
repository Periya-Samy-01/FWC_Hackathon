# HRMS-AI-Next: AI-Powered Human Resource Management System

HRMS-AI-Next is a modern, AI-enhanced Human Resource Management System built with the Next.js framework. It is designed to streamline and automate various HR processes, from employee management and payroll to recruitment and performance tracking. The system leverages the power of AI to provide intelligent insights, automate repetitive tasks, and improve the overall efficiency of HR operations.

## ✨ Features

- **Role-Based Access Control:** Secure dashboards for different user roles (Admin, HR, Manager, Employee) with tailored functionalities.
- **Employee Management:** Centralized database for employee information, including profiles, roles, and reporting lines.
- **AI-Powered Recruitment:** Integrated AI to screen resumes, analyze skill matrices, and generate interview questions.
- **Payroll & Compensation:** Automated payroll runs, salary structure management, and payslip generation.
- **Performance Management:** Goal setting, tracking, and a streamlined approval workflow between employees and managers.
- **Leave Management:** System for requesting, approving, and tracking employee leave.
- **System Auditing:** Comprehensive logging of critical system events for security and compliance.
- **Notifications:** In-app notification system to keep users informed of important events and requests.

## 💻 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** Next.js API Routes, [Mongoose](https://mongoosejs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** JSON Web Tokens (JWT)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **Testing:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for running MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hrms-ai-next.git
cd hrms-ai-next
```

### 2. Set Up the Database

The application requires a running MongoDB instance. You can use Docker to easily start one:

```bash
sudo docker run -d --name my-mongodb -p 27017:27017 mongo
```

### 3. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Now, open `.env.local` and fill in the required values:

```
MONGODB_URI="mongodb://127.0.0.1:27017/hrms-ai-next"
JWT_SECRET="your-strong-jwt-secret"
ENCRYPTION_KEY="your-32-character-long-encryption-key"
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 5. Seed the Database

Populate the database with initial sample data using the seed script:

```bash
npm run db:seed
```

This will create a default set of users (admin, managers, HR, employees), skills, and other necessary data. The default admin credentials are:
- **Email:** `admin@example.com`
- **Password:** `password123`

### 6. Run the Development Server

Start the Next.js development server:

```bash
npx next dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs the Jest test suite.
- `npm run db:seed`: Seeds the database with initial data.

## 🧪 Testing

The project uses Jest and React Testing Library for unit and integration testing. API route tests are located in the `__tests__` directory.

To run the tests, use the following command:

```bash
npm test
```
