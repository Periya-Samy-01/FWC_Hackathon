import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import ApprovalRequest from '../models/ApprovalRequest.js';
import Announcement from '../models/Announcement.js';
import Skill from '../models/Skill.js';
import EmployeeSkill from '../models/EmployeeSkill.js';
import { connectDB } from '../lib/dbConnect.js';

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Goal.deleteMany({});
    await ApprovalRequest.deleteMany({});
    await Announcement.deleteMany({});
    await Skill.deleteMany({});
    await EmployeeSkill.deleteMany({});
    console.log('Existing data cleared.');

    console.log('Seeding skills...');
    const skills = [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'MongoDB' },
      { name: 'CSS' },
      { name: 'HTML' },
      { name: 'Project Management' },
      { name: 'Agile Methodologies' },
      { name: 'Communication' },
      { name: 'Leadership' },
    ];
    const createdSkills = await Skill.insertMany(skills);
    console.log(`${createdSkills.length} skills created.`);

    // --- Create Users ---
    console.log('Creating users...');
    const users = [];
    const password = await bcrypt.hash('password123', 10);

    // Create Admin
    users.push({ name: 'Admin User', email: 'admin@example.com', role: 'admin', password, profile: { jobTitle: 'System Administrator' } });

    // Create Managers
    for (let i = 1; i <= 5; i++) {
      users.push({ name: `Manager ${i}`, email: `manager${i}@example.com`, role: 'manager', password, profile: { jobTitle: 'Team Manager' } });
    }

    // Create HR
    for (let i = 1; i <= 5; i++) {
      users.push({ name: `HR Person ${i}`, email: `hr${i}@example.com`, role: 'hr', password, profile: { jobTitle: 'HR Specialist' } });
    }

    // Create Employees
    for (let i = 1; i <= 25; i++) {
      users.push({ name: `Employee ${i}`, email: `employee${i}@example.com`, role: 'employee', password, profile: { jobTitle: 'Staff Member' } });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created.`);

    // --- Structure Teams ---
    console.log('Structuring teams...');
    const managers = createdUsers.filter(u => u.role === 'manager');
    const hrs = createdUsers.filter(u => u.role === 'hr');
    const employees = createdUsers.filter(u => u.role === 'employee');

    for (let i = 0; i < managers.length; i++) {
      const manager = managers[i];
      const teamMembers = [];

      // Assign 1 HR
      if (hrs[i]) {
        hrs[i].manager = manager._id;
        await hrs[i].save();
        teamMembers.push(hrs[i]._id);
      }

      // Assign 5 Employees
      const employeeStartIdx = i * 5;
      const employeeEndIdx = employeeStartIdx + 5;
      for (let j = employeeStartIdx; j < employeeEndIdx && j < employees.length; j++) {
        employees[j].manager = manager._id;
        await employees[j].save();
        teamMembers.push(employees[j]._id);
      }

      manager.team = teamMembers;
      await manager.save();
    }
    console.log('Teams structured.');

    // --- Seed Announcements ---
    console.log('Seeding announcements...');
    const announcements = [
      { title: 'Welcome to the New HRMS!', content: 'We are excited to launch our new Human Resource Management System. Please take some time to familiarize yourself with the new features.' },
      { title: 'Q3 Performance Reviews', content: 'Performance reviews for the third quarter will commence next week. Please schedule a meeting with your manager.' },
      { title: 'Holiday Schedule', content: 'The office will be closed on December 25th for Christmas. Enjoy the holiday!' },
    ];
    await Announcement.insertMany(announcements);
    console.log(`${announcements.length} announcements created.`);

    // --- Seed Employee Skills ---
    console.log('Seeding employee skills...');
    const employeeUsers = createdUsers.filter(u => u.role === 'employee');
    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const employeeSkills = [];

    for (const employee of employeeUsers) {
      // Assign 2 to 5 random skills to each employee
      const numSkills = Math.floor(Math.random() * 4) + 2;
      const shuffledSkills = createdSkills.sort(() => 0.5 - Math.random());
      for (let i = 0; i < numSkills; i++) {
        employeeSkills.push({
          employeeId: employee._id,
          skillId: shuffledSkills[i]._id,
          currentProficiency: proficiencyLevels[Math.floor(Math.random() * proficiencyLevels.length)],
        });
      }
    }
    await EmployeeSkill.insertMany(employeeSkills);
    console.log(`${employeeSkills.length} employee skills created.`);

    // --- Seed Employee Goals ---
    console.log('Seeding employee goals...');
    const goalsToCreate = [];
    for (const employee of employeeUsers) {
      if (employee.manager) {
        goalsToCreate.push({
          title: 'Quarterly Skill Development',
          description: `Complete a course on a new skill relevant to ${employee.profile.jobTitle}.`,
          employeeId: employee._id,
          managerId: employee.manager,
          status: 'Active',
          progress: 25,
          deadline: new Date('2025-12-31'),
        });
        goalsToCreate.push({
          title: 'Project Contribution',
          description: 'Make a significant contribution to an ongoing team project.',
          employeeId: employee._id,
          managerId: employee.manager,
          status: 'Pending Approval',
          deadline: new Date('2025-11-30'),
        });
      }
    }

    const createdGoals = await Goal.insertMany(goalsToCreate);
    console.log(`${createdGoals.length} goals created.`);

    // Link goals to users and create approval requests
    for (const goal of createdGoals) {
      await User.findByIdAndUpdate(goal.employeeId, {
        $push: { performanceGoals: goal._id },
      });

      if (goal.status === 'Pending Approval') {
        const approvalRequest = new ApprovalRequest({
          requester: goal.employeeId,
          manager: goal.managerId,
          type: 'Goal',
          details: {
            title: goal.title,
            description: goal.description,
          },
          referenceId: goal._id,
          referenceModel: 'Goal',
        });
        await approvalRequest.save();
      }
    }
    console.log('Goals linked and approval requests created.');

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDB();