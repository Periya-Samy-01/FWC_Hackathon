import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import EmployeeSkill from '@/models/EmployeeSkill';
import Skill from '@/models/Skill';
import User from '@/models/User';
import RoleSkillMatrix from '@/models/RoleSkillMatrix';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json({ message: 'employeeId is required' }, { status: 400 });
    }

    // Pre-load models to prevent MissingSchemaError on populate
    await Skill.findOne();
    await User.findOne();
    await RoleSkillMatrix.findOne();

    const employee = await User.findById(employeeId).select('role');
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const requiredSkillsQuery = RoleSkillMatrix.find({ role: employee.role }).populate('skill', 'name');
    const employeeSkillsQuery = EmployeeSkill.find({ employeeId }).populate('skillId', 'name');

    const [requiredSkills, employeeSkills] = await Promise.all([requiredSkillsQuery, employeeSkillsQuery]);

    const employeeSkillsMap = new Map(
      employeeSkills.map(s => [s.skillId._id.toString(), s.currentProficiency])
    );

    const skillDriftData = requiredSkills.map(rs => ({
      skill: rs.skill.name,
      requiredProficiency: rs.requiredProficiency,
      currentProficiency: employeeSkillsMap.get(rs.skill._id.toString()) || 'N/A',
    }));

    const requiredSkillIds = new Set(requiredSkills.map(rs => rs.skill._id.toString()));
    for (const es of employeeSkills) {
      if (es.skillId && !requiredSkillIds.has(es.skillId._id.toString())) {
        skillDriftData.push({
          skill: es.skillId.name,
          requiredProficiency: 'N/A',
          currentProficiency: es.currentProficiency,
        });
      }
    }

    return NextResponse.json(skillDriftData, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee skills:", error);
    if (error.name === 'CastError') {
      return NextResponse.json({ message: `Invalid employeeId: ${error.value}` }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded || !['manager', 'admin', 'hr'].includes(decoded.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();
    const { employeeId, skillId, currentProficiency } = await req.json();

    if (!employeeId || !skillId || !currentProficiency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await EmployeeSkill.findOneAndUpdate(
      { employeeId, skillId },
      { currentProficiency },
      { upsert: true, new: true }
    );

    // Pre-load models for populate
    await User.findOne();
    await RoleSkillMatrix.findOne();
    await Skill.findOne();

    const employee = await User.findById(employeeId).select('role');
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const requiredSkillsQuery = RoleSkillMatrix.find({ role: employee.role }).populate('skill', 'name');
    const employeeSkillsQuery = EmployeeSkill.find({ employeeId }).populate('skillId', 'name');

    const [requiredSkills, employeeSkills] = await Promise.all([requiredSkillsQuery, employeeSkillsQuery]);

    const employeeSkillsMap = new Map(
        employeeSkills.map(s => [s.skillId._id.toString(), s.currentProficiency])
    );

    const skillDriftData = requiredSkills.map(rs => ({
        skill: rs.skill.name,
        requiredProficiency: rs.requiredProficiency,
        currentProficiency: employeeSkillsMap.get(rs.skill._id.toString()) || 'N/A',
    }));

    const requiredSkillIds = new Set(requiredSkills.map(rs => rs.skill._id.toString()));
    for (const es of employeeSkills) {
        if (es.skillId && !requiredSkillIds.has(es.skillId._id.toString())) {
            skillDriftData.push({
                skill: es.skillId.name,
                requiredProficiency: 'N/A',
                currentProficiency: es.currentProficiency,
            });
        }
    }

    return NextResponse.json(skillDriftData, { status: 200 });
  } catch (error) {
    console.error("Error creating or updating employee skill:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
