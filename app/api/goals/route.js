
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Goal from "@/models/Goal";
import User from "@/models/User";
import ApprovalRequest from "@/models/ApprovalRequest";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    const { title, description, deadline } = await req.json();
    const employeeId = decoded.sub;

    const user = await User.findById(employeeId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (!user.manager) {
      return new Response(JSON.stringify({ error: "Manager not assigned" }), { status: 400 });
    }

    const newGoal = new Goal({
      title,
      description,
      deadline,
      employeeId,
      managerId: user.manager,
    });
    await newGoal.save();

    user.performanceGoals.push(newGoal._id);
    await user.save();

    // Create a corresponding approval request
    const approvalRequest = new ApprovalRequest({
      requester: employeeId,
      manager: user.manager,
      type: "Goal",
      details: {
        title: newGoal.title,
        description: newGoal.description,
      },
      referenceId: newGoal._id,
      referenceModel: "Goal",
    });
    await approvalRequest.save();

    return new Response(JSON.stringify(newGoal), { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET(req) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
        }

        const goals = await Goal.find({ employeeId: decoded.sub });
        return new Response(JSON.stringify(goals), { status: 200 });
    } catch (error) {
        console.error("Error fetching goals:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
