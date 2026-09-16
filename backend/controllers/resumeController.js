import fs from 'fs';
import path from 'path';
import { uploadResume, detectRoleFromText, extractSkillsFromText } from '../utils/resumeParser.js';

// @desc    Upload resume and analyze role/skills
// @route   POST /api/resume/upload
// @access  Private
export const uploadResumeHandler = [
  uploadResume.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a valid resume file (PDF, DOC, DOCX, or TXT).' });
      }

      let extractedText = '';

      // For TXT files, read directly
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.txt') {
        extractedText = fs.readFileSync(req.file.path, 'utf-8');
      } else {
        // For PDF/DOC/DOCX: Use filename + basic parsing
        // We read the raw file as buffer and try to extract readable text
        try {
          const buffer = fs.readFileSync(req.file.path);
          // Extract printable ASCII text from binary
          extractedText = buffer.toString('latin1').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
        } catch (e) {
          extractedText = '';
        }
      }

      // If text extraction failed or too short, use filename as fallback
      if (extractedText.trim().length < 30) {
        extractedText = req.file.originalname.replace(/[._-]/g, ' ');
      }

      // Detect role and skills from extracted text
      const detectedRole = detectRoleFromText(extractedText);
      const detectedSkills = extractSkillsFromText(extractedText);

      // Clean up uploaded file after processing
      try { fs.unlinkSync(req.file.path); } catch (e) {}

      return res.json({
        message: 'Resume analyzed successfully.',
        detectedRole,
        detectedSkills,
        filename: req.file.originalname,
      });
    } catch (err) {
      console.error('[Resume Upload Error]', err.message);
      if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(500).json({ message: err.message || 'Resume processing failed. Please try again or use text paste.' });
    }
  },
];

// @desc    Analyze resume text (pasted text, no file upload)
// @route   POST /api/resume/analyze-text
// @access  Private
export const analyzeResumeText = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ message: 'Please paste at least a few lines of your resume text.' });
    }

    const detectedRole = detectRoleFromText(resumeText);
    const detectedSkills = extractSkillsFromText(resumeText);

    return res.json({
      message: 'Resume text analyzed successfully.',
      detectedRole,
      detectedSkills,
    });
  } catch (err) {
    console.error('[Resume Text Analysis Error]', err.message);
    return res.status(500).json({ message: err.message || 'Resume analysis failed.' });
  }
};
