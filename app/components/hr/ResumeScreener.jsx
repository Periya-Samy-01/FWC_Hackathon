"use client";

import { useState } from 'react';

const ResumeScreener = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Please provide both a resume and a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/recruitment/screen-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ScoreGauge = ({ score }) => (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-gray-700"
          strokeWidth="3.6"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-indigo-500"
          strokeWidth="3.6"
          strokeDasharray={`${score * 10}, 100`}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-indigo-400">{score}</span>
        <span className="text-lg text-gray-400">/10</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">AI Resume Screener</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-300">
            Upload Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-900 file:text-blue-300
              hover:file:bg-blue-800"
          />
        </div>
        <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-gray-300">
            Paste Job Description Here
          </label>
          <textarea
            id="job-description"
            rows="10"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter the full job description..."
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Candidate'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900 text-red-400 rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-6 p-6 border border-gray-700 rounded-lg bg-gray-900">
          <h3 className="text-xl font-bold mb-4 text-white">Candidate Scorecard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Overall Fit Score</h4>
              <ScoreGauge score={analysisResult.overall_fit_score} />
            </div>
            <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Candidate Summary</h4>
              <p className="text-sm text-gray-400">{analysisResult.candidate_summary}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.matched_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 text-sm font-medium text-green-300 bg-green-900 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 text-sm font-medium text-red-300 bg-red-900 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-300 mb-3">Interview Prep</h4>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              {analysisResult.suggested_interview_questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScreener;
