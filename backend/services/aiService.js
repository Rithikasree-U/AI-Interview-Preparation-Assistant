import { GoogleGenerativeAI } from '@google/generative-ai';
import Question from '../models/Question.js';

// Predefined static fallback questions if DB is empty and AI is unavailable
const STATIC_FALLBACK_QUESTIONS = [
  {
    id: 'static_1',
    question: 'What is the difference between an ArrayList and a LinkedList in Java?',
    category: 'Java',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    role: 'Java Developer',
    expectedAnswer: 'ArrayList uses a dynamic array to store elements offering fast random access (O(1)), but slower insertions/deletions in the middle (O(n)). LinkedList uses a doubly-linked list structure offering fast insertions/deletions (O(1)), but sequential access (O(n)).'
  },
  {
    id: 'static_2',
    question: 'Explain how asynchronous programming works in JavaScript using Promises and async/await.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    role: 'Frontend Developer',
    expectedAnswer: 'JavaScript uses a single-threaded Event Loop. Promises represent values available now, in future, or never. async/await provides clean syntactic sugar over Promises to handle asynchronous operations sequentially without callback hell.'
  },
  {
    id: 'static_3',
    question: 'What are the main principles of Object-Oriented Programming (OOP)?',
    category: 'OOP',
    difficulty: 'Beginner',
    interviewType: 'Technical',
    role: 'Software Developer',
    expectedAnswer: 'The four core principles of OOP are Encapsulation (bundling data and methods), Abstraction (hiding implementation details), Inheritance (reusing parent class features), and Polymorphism (ability of an object to take many forms).'
  },
  {
    id: 'static_4',
    question: 'What is the difference between SQL (Relational) and NoSQL (Non-relational) databases?',
    category: 'DBMS',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    role: 'Backend Developer',
    expectedAnswer: 'SQL databases are structured, schema-based, table-oriented databases supporting ACID transactions (e.g. PostgreSQL, MySQL). NoSQL databases are document or key-value based, schema-less, and scale horizontally (e.g. MongoDB, Cassandra).'
  },
  {
    id: 'static_5',
    question: 'Tell me about a time when you faced a difficult technical challenge and how you solved it.',
    category: 'Behavioral',
    difficulty: 'Intermediate',
    interviewType: 'Behavioral',
    role: 'Full Stack Developer',
    expectedAnswer: 'The STAR method (Situation, Task, Action, Result) should be used. Explain the situation clearly, detail the steps taken to debug or architect a solution, and quantify the positive result achieved.'
  },
  {
    id: 'static_6',
    question: 'Why do you want to join our organization and what makes you a suitable candidate for this role?',
    category: 'HR',
    difficulty: 'Beginner',
    interviewType: 'HR',
    role: 'Software Developer',
    expectedAnswer: 'Express alignment with the company goals, passion for the domain, continuous learning mindset, and highlight relevant technical skills and team collaboration experiences.'
  }
];

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[AI Service] Failed to initialize GoogleGenerativeAI client:', err.message);
    return null;
  }
};

/**
 * Clean and parse JSON response from Gemini markdown code blocks
 */
const cleanAndParseJson = (text) => {
  if (!text) return null;
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return JSON.parse(clean.trim());
  } catch (error) {
    console.warn('[AI Service] JSON parse failed on AI output:', error.message);
    return null;
  }
};

/**
 * Generate Interview Questions
 */
export const generateQuestions = async ({ role, interviewType, difficulty, experienceLevel, count = 5 }) => {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a senior technical interviewer. Generate exactly ${count} interview questions for candidate preparing for a role.
Role: ${role}
Interview Type: ${interviewType}
Difficulty: ${difficulty}
Experience Level: ${experienceLevel}

Respond ONLY with a valid JSON object strictly matching this format without any extra text or markdown formatting:
{
  "questions": [
    {
      "id": "q1",
      "question": "Exact question text",
      "category": "Technology or Skill topic",
      "difficulty": "${difficulty}",
      "expectedAnswer": "Key points expected in candidate's answer"
    }
  ]
}`;

      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
      const response = await model.generateContent(prompt);

      const parsed = cleanAndParseJson(response.response.text());
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        console.log(`[AI Service] Successfully generated ${parsed.questions.length} questions via Gemini API.`);
        return parsed.questions.map((q, idx) => ({
          id: q.id || `ai_${Date.now()}_${idx}`,
          question: q.question,
          category: q.category || role,
          difficulty: q.difficulty || difficulty,
          expectedAnswer: q.expectedAnswer || 'Clear technical explanation with key principles.'
        }));
      }
    } catch (err) {
      console.warn('[AI Service] Gemini API call failed. Reverting to database fallback question bank:', err.message);
    }
  }

  // FALLBACK QUESTION GENERATION (DB + Seed logic)
  console.log('[AI Service] Utilizing local question bank for question generation.');
  let dbQuestions = [];
  try {
    dbQuestions = await Question.find({
      $or: [
        { role: role },
        { interviewType: interviewType },
        { difficulty: difficulty }
      ]
    }).limit(20);
  } catch (dbErr) {
    console.warn('[AI Service] Database question fetch error:', dbErr.message);
  }

  let combinedBank = [...dbQuestions, ...STATIC_FALLBACK_QUESTIONS];
  
  // Shuffle array
  combinedBank = combinedBank.sort(() => 0.5 - Math.random());
  
  // Pick requested count
  const selected = combinedBank.slice(0, Math.min(count, combinedBank.length));
  
  return selected.map((q, idx) => ({
    id: q._id ? q._id.toString() : q.id || `q_${idx + 1}`,
    question: q.question,
    category: q.category || 'General',
    difficulty: q.difficulty || difficulty,
    expectedAnswer: q.expectedAnswer || 'Thorough explanation covering core concepts and practical application.'
  }));
};

/**
 * Evaluate Individual User Answer
 */
export const evaluateUserAnswer = async ({ questionText, category, userAnswer, role, difficulty, expectedAnswer }) => {
  const ai = getAiClient();

  if (!userAnswer || userAnswer.trim() === '') {
    return {
      score: 0,
      correctness: 0,
      relevance: 0,
      technicalKnowledge: 0,
      communication: 0,
      strengths: ['No answer provided'],
      improvements: ['Attempt all questions during an interview. Even a partial answer demonstrates initiative.'],
      suggestedAnswer: expectedAnswer || 'Provide a structured explanation using industry standard concepts.'
    };
  }

  if (ai) {
    try {
      const prompt = `You are a supportive, experienced tech interviewer reviewing a candidate's answer.
Question: "${questionText}"
Category: ${category}
Expected Answer Reference: "${expectedAnswer || 'Industry standard best answer'}"
Candidate's Answer: "${userAnswer}"

Evaluate the answer with realistic, constructive, and natural student-friendly feedback (do NOT sound robotic or overly formal).

Respond ONLY with a valid JSON object strictly matching this format:
{
  "score": 8, // Integer 0 to 10
  "correctness": 8, // Integer 0 to 10
  "relevance": 9, // Integer 0 to 10
  "technicalKnowledge": 7, // Integer 0 to 10
  "communication": 8, // Integer 0 to 10
  "strengths": ["Clear explanation of core mechanism"],
  "improvements": ["Mention performance time complexity"],
  "suggestedAnswer": "A concise, well-structured ideal answer for this question."
}`;

      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
      const response = await model.generateContent(prompt);

      const parsed = cleanAndParseJson(response.response.text());
      if (parsed && typeof parsed.score === 'number') {
        console.log(`[AI Service] Successfully evaluated answer via Gemini API. Score: ${parsed.score}/10`);
        return {
          score: Math.min(10, Math.max(0, Number(parsed.score) || 5)),
          correctness: Math.min(10, Math.max(0, Number(parsed.correctness) || 5)),
          relevance: Math.min(10, Math.max(0, Number(parsed.relevance) || 5)),
          technicalKnowledge: Math.min(10, Math.max(0, Number(parsed.technicalKnowledge) || 5)),
          communication: Math.min(10, Math.max(0, Number(parsed.communication) || 5)),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good attempt at addressing the core question.'],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Elaborate on edge cases or practical examples.'],
          suggestedAnswer: parsed.suggestedAnswer || expectedAnswer || 'Focus on foundational definitions and concrete examples.'
        };
      }
    } catch (err) {
      console.warn('[AI Service] Gemini evaluation call failed. Using heuristic fallback evaluation:', err.message);
    }
  }

  // LOCAL HEURISTIC EVALUATION FALLBACK
  // Scores start at 0 — marks are only earned through genuine keyword similarity
  console.log('[AI Service] Utilizing heuristic fallback evaluation.');
  const trimmed = userAnswer.trim();
  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;

  let score = 0;
  let correctness = 0;
  let relevance = 0;
  let technicalKnowledge = 0;
  let communication = 0;

  const strengths = [];
  const improvements = [];

  // Only give communication/relevance credit for non-trivially short answers
  if (wordCount >= 15) {
    communication += 2;
    relevance += 1;
    strengths.push('Provided a reasonably detailed response.');
  } else if (wordCount >= 5) {
    communication += 1;
    improvements.push('Expand your response with more detail and concrete examples.');
  } else {
    improvements.push('Provide a complete answer. Even partial answers demonstrate understanding.');
  }

  // Core scoring: keyword similarity against expected answer
  if (expectedAnswer && wordCount >= 3) {
    const keywords = expectedAnswer.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    let matchCount = 0;
    keywords.forEach(kw => {
      if (trimmed.toLowerCase().includes(kw)) matchCount++;
    });

    if (keywords.length > 0 && matchCount > 0) {
      // matchRatio: proportion of expected-answer keywords found in user's answer
      const matchRatio = matchCount / Math.min(keywords.length, 8);
      // Score out of 10 based purely on keyword coverage (0-7 range from matching)
      const keywordScore = Math.round(matchRatio * 7);
      score = keywordScore;
      correctness = keywordScore;
      technicalKnowledge = Math.round(matchRatio * 6);
      if (matchRatio >= 0.6) {
        strengths.push('Covered key technical concepts with relevant terminology.');
      } else if (matchRatio >= 0.3) {
        strengths.push('Partially addressed the core concept.');
        improvements.push('Include more specific terminology and detailed explanation.');
      } else {
        improvements.push('Review this topic — your answer missed most of the key concepts.');
      }
    } else {
      // Answer given but no keyword match at all
      improvements.push('Your answer did not address the core technical concepts expected.');
      improvements.push('Review the topic and focus on domain-specific terminology.');
    }
  }

  // Normalize scores: 0-10 range, 0 minimum (no floor)
  score = Math.min(10, Math.max(0, score));
  correctness = Math.min(10, Math.max(0, correctness));
  relevance = Math.min(10, Math.max(0, relevance));
  technicalKnowledge = Math.min(10, Math.max(0, technicalKnowledge));
  communication = Math.min(10, Math.max(0, communication));

  return {
    score,
    correctness,
    relevance,
    technicalKnowledge,
    communication,
    strengths: strengths.length > 0 ? strengths : ['Good initial attempt at the question.'],
    improvements: improvements.length > 0 ? improvements : ['Review standard technical documentation for deeper insights.'],
    suggestedAnswer: expectedAnswer || 'State the core definition clearly, followed by key advantages and practical use cases.'
  };
};

/**
 * Generate Final Summary Feedback for Completed Interview
 */
export const generateFinalFeedback = async ({ role, interviewType, questions, evaluatedAnswers }) => {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a head of talent acquisition. Review a candidate's completed mock interview results and give overall constructive feedback.
Role: ${role}
Interview Type: ${interviewType}
Evaluated Answers Summary: ${JSON.stringify(evaluatedAnswers.map(a => ({ question: a.questionText, score: a.score, strengths: a.strengths })))}

Respond ONLY with a valid JSON object strictly matching this format:
{
  "strengths": ["Strong foundational knowledge in core domain"],
  "improvements": ["Work on articulating time/space complexities"],
  "recommendedTopics": ["Data Structures", "System Design"],
  "summary": "Overall solid performance demonstrating clear potential. Focus on deepening technical depth."
}`;

      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
      const response = await model.generateContent(prompt);

      const parsed = cleanAndParseJson(response.response.text());
      if (parsed && Array.isArray(parsed.strengths)) {
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] Gemini summary generation failed. Using local fallback summary:', err.message);
    }
  }

  // Local fallback summary calculation
  const totalScore = evaluatedAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
  const avgScore = evaluatedAnswers.length > 0 ? Math.round((totalScore / (evaluatedAnswers.length * 10)) * 100) : 60;

  let summaryText = `Completed mock interview for ${role} with an overall score of ${avgScore}%. `;
  if (avgScore >= 80) {
    summaryText += 'Excellent presentation of concepts and strong technical clarity.';
  } else if (avgScore >= 60) {
    summaryText += 'Solid foundational performance. Consistent practice will refine your technical delivery.';
  } else {
    summaryText += 'Good effort. Focus on reviewing fundamental concepts and practicing structured answers.';
  }

  const allStrengths = evaluatedAnswers.flatMap(a => a.strengths || []);
  const allImprovements = evaluatedAnswers.flatMap(a => a.improvements || []);
  const categories = [...new Set(questions.map(q => q.category).filter(Boolean))];

  return {
    strengths: allStrengths.length > 0 ? [...new Set(allStrengths)].slice(0, 4) : ['Demonstrated problem-solving attitude.', 'Attempted technical responses.'],
    improvements: allImprovements.length > 0 ? [...new Set(allImprovements)].slice(0, 4) : ['Revise domain definitions.', 'Practice mock interviews under timed conditions.'],
    recommendedTopics: categories.length > 0 ? categories : [role, 'Core Problem Solving'],
    summary: summaryText
  };
};
