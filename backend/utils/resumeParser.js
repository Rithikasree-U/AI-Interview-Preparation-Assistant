import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume_${req.user._id}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Detect likely job role from extracted resume text using keyword matching
 */
export const detectRoleFromText = (text) => {
  const lower = text.toLowerCase();

  const roleKeywordMap = [
    {
      role: 'Java Developer',
      keywords: ['java', 'spring boot', 'hibernate', 'maven', 'gradle', 'jvm', 'jdbc', 'servlet'],
    },
    {
      role: 'Python Developer',
      keywords: ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'scikit', 'tensorflow', 'pytorch'],
    },
    {
      role: 'Frontend Developer',
      keywords: ['react', 'angular', 'vue', 'html', 'css', 'javascript', 'typescript', 'webpack', 'sass'],
    },
    {
      role: 'Backend Developer',
      keywords: ['node.js', 'express', 'api', 'rest', 'graphql', 'microservices', 'server', 'database'],
    },
    {
      role: 'Full Stack Developer',
      keywords: ['full stack', 'mern', 'mean', 'react', 'node', 'mongodb', 'postgresql', 'mysql'],
    },
    {
      role: 'Data Analyst',
      keywords: ['data analysis', 'sql', 'tableau', 'power bi', 'excel', 'visualization', 'analytics', 'bi'],
    },
    {
      role: 'Data Scientist',
      keywords: ['machine learning', 'deep learning', 'nlp', 'data science', 'model', 'neural network', 'ai', 'python'],
    },
    {
      role: 'QA Engineer',
      keywords: ['testing', 'selenium', 'qa', 'quality assurance', 'test cases', 'automation', 'jira', 'bug'],
    },
  ];

  let bestRole = 'Software Developer';
  let bestScore = 0;

  roleKeywordMap.forEach(({ role, keywords }) => {
    let score = 0;
    keywords.forEach(kw => {
      if (lower.includes(kw)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  });

  return bestRole;
};

/**
 * Extract skills/technologies mentioned in resume text
 */
export const extractSkillsFromText = (text) => {
  const lower = text.toLowerCase();
  const techSkills = [
    'java', 'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'node.js', 'express', 'spring', 'django', 'flask', 'fastapi',
    'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis',
    'html', 'css', 'sass', 'tailwind',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'github', 'jenkins', 'ci/cd',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'pandas', 'numpy', 'scikit-learn',
    'sql', 'nosql', 'graphql', 'rest api',
    'selenium', 'jest', 'junit', 'cypress',
  ];

  const found = techSkills.filter(skill => lower.includes(skill));
  return [...new Set(found)];
};
