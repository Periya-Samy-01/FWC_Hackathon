import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken || !['admin', 'hr'].includes(decodedToken.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const resumeFile = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ message: 'Missing resume file or job description' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    let resumeText = '';

    if (resumeFile.type === 'application/pdf') {
      const pdfParser = new PDFParser(this, 1);
      pdfParser.parseBuffer(fileBuffer);
      resumeText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
      });
    } else if (resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = value;
    } else {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 400 });
    }

    const prompt = `You are an expert HR recruitment analyst. Analyze the following resume text against the provided job description. Your response must be a single, clean JSON object with no extra text or explanations. The JSON object must have the following keys: overall_fit_score (a number from 0 to 10, where 10 is a perfect match), matched_skills (an array of strings), missing_skills (an array of strings), candidate_summary (a 3-sentence summary of the candidate's strengths and weaknesses for this role), and suggested_interview_questions (an array of 3 insightful questions to ask this specific candidate based on their resume).

    Resume Text:
    ${resumeText}

    Job Description:
    ${jobDescription}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = response.text();

    // Clean the response to ensure it's a valid JSON object
    const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();


    return NextResponse.json(JSON.parse(cleanedJson));

  } catch (error) {
    console.error("Error in /api/recruitment/screen-resume:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
