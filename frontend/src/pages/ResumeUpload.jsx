import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import API from '../services/api';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  RefreshCw,
  Target,
  X,
  ClipboardList,
} from 'lucide-react';

const ROLE_OPTIONS = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Java Developer',
  'Python Developer',
  'QA Engineer',
];

const TYPE_OPTIONS = ['Technical', 'HR', 'Behavioral', 'Mixed'];
const DIFF_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const COUNT_OPTIONS = [5, 10, 15];
const EXP_OPTIONS = ['Fresher', '1–2 Years', '3–5 Years'];

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- Upload State ---
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'paste'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // --- Analysis Results ---
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // --- Interview Configuration (editable after analysis) ---
  const [role, setRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [count, setCount] = useState(5);
  const [experienceLevel, setExperienceLevel] = useState('Fresher');

  // --- Start Interview ---
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setAnalyzeError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setAnalyzeError('');
    }
  };

  const handleAnalyze = async () => {
    setAnalyzeError('');
    setAnalysisResult(null);
    setAnalyzing(true);

    try {
      let res;
      if (uploadMode === 'file') {
        if (!selectedFile) {
          setAnalyzeError('Please select a resume file first.');
          setAnalyzing(false);
          return;
        }
        const formData = new FormData();
        formData.append('resume', selectedFile);
        res = await API.post('/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        if (!resumeText.trim() || resumeText.trim().length < 30) {
          setAnalyzeError('Please paste at least a few lines of your resume text.');
          setAnalyzing(false);
          return;
        }
        res = await API.post('/resume/analyze-text', { resumeText });
      }

      setAnalysisResult(res.data);
      setRole(res.data.detectedRole || ROLE_OPTIONS[0]);
    } catch (err) {
      setAnalyzeError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartInterview = async () => {
    setStartError('');
    setStarting(true);
    try {
      const res = await API.post('/interviews/start', {
        role,
        interviewType,
        difficulty,
        experienceLevel,
        count: Number(count),
      });
      if (res.data?._id) {
        navigate(`/mock-interview/${res.data._id}`);
      }
    } catch (err) {
      setStartError(err.response?.data?.message || 'Failed to start interview session.');
    } finally {
      setStarting(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setResumeText('');
    setAnalysisResult(null);
    setAnalyzeError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-view">
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>

            {/* PAGE HEADER */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h1 className="text-2xl font-bold">Resume-Based Interview Setup</h1>
              <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                Upload your resume or paste its text. We'll auto-detect your target role and skills so you can jump straight into a targeted mock interview.
              </p>
            </div>

            {/* UPLOAD / PASTE SECTION (show only if not analyzed yet) */}
            {!analysisResult ? (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                {/* Toggle Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                  <button
                    onClick={() => setUploadMode('file')}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      borderBottom: uploadMode === 'file' ? '2px solid var(--primary)' : '2px solid transparent',
                      color: uploadMode === 'file' ? 'var(--primary)' : 'var(--text-muted)',
                      marginBottom: '-1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <Upload size={16} /> Upload File
                  </button>
                  <button
                    onClick={() => setUploadMode('paste')}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      borderBottom: uploadMode === 'paste' ? '2px solid var(--primary)' : '2px solid transparent',
                      color: uploadMode === 'paste' ? 'var(--primary)' : 'var(--text-muted)',
                      marginBottom: '-1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <ClipboardList size={16} /> Paste Text
                  </button>
                </div>

                {/* FILE UPLOAD MODE */}
                {uploadMode === 'file' ? (
                  <div>
                    {/* Drag-and-Drop Zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragOver ? 'var(--primary)' : selectedFile ? 'var(--success)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '2.5rem 1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragOver ? 'var(--primary-light)' : selectedFile ? 'var(--success-bg)' : 'var(--bg-subtle)',
                        transition: 'all 0.15s ease',
                        marginBottom: '1rem',
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                        style={{ display: 'none' }}
                      />

                      {selectedFile ? (
                        <div>
                          <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                          <p className="font-semibold text-base" style={{ color: 'var(--success-text)' }}>
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB — Click to change file
                          </p>
                        </div>
                      ) : (
                        <div>
                          <FileText size={40} color="var(--text-light)" style={{ marginBottom: '0.75rem' }} />
                          <p className="font-semibold text-base">Drag & drop your resume here</p>
                          <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                            or click to browse — supports PDF, DOC, DOCX, TXT (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TEXT PASTE MODE */
                  <div>
                    <label className="form-label font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>
                      Paste your resume content below
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={10}
                      placeholder="Paste your resume text here... Include your skills, experience, projects, and technologies you've worked with."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    />
                    <p className="text-xs text-muted">
                      The more resume content you paste, the more accurately we can suggest your target role and skill areas.
                    </p>
                  </div>
                )}

                {analyzeError && (
                  <div className="alert alert-danger" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span>{analyzeError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Cpu}
                    loading={analyzing}
                    onClick={handleAnalyze}
                    style={{ flex: 1 }}
                  >
                    {analyzing ? 'Analyzing Resume...' : 'Analyze Resume & Detect Role'}
                  </Button>
                </div>
              </div>
            ) : (
              /* ---- ANALYSIS RESULTS SECTION ---- */
              <div>
                {/* SUCCESS BANNER */}
                <div
                  className="card"
                  style={{
                    marginBottom: '1.5rem',
                    backgroundColor: 'var(--success-bg)',
                    borderColor: '#a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <CheckCircle2 size={32} color="var(--success)" />
                    <div>
                      <h3 className="text-base font-bold" style={{ color: 'var(--success-text)' }}>
                        Resume Analyzed Successfully
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--success-text)', marginTop: '0.125rem' }}>
                        {analysisResult.filename
                          ? `"${analysisResult.filename}" processed.`
                          : 'Resume text analyzed.'}{' '}
                        We've pre-filled your interview settings below.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <RefreshCw size={14} /> Use Different Resume
                  </button>
                </div>

                {/* DETECTED SKILLS */}
                {analysisResult.detectedSkills?.length > 0 && (
                  <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="text-base font-semibold" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Cpu size={18} color="var(--primary)" /> Detected Skills & Technologies
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {analysisResult.detectedSkills.map((skill) => (
                        <span key={skill} className="badge badge-primary font-medium" style={{ textTransform: 'capitalize' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* INTERVIEW CONFIGURATION */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h3
                    className="text-base font-semibold"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
                  >
                    <Target size={18} color="var(--primary)" /> Confirm Your Interview Settings
                  </h3>

                  <p className="text-xs text-muted" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    Based on your resume, we detected your best-fit role as{' '}
                    <strong className="text-primary">{analysisResult.detectedRole}</strong>. Review and adjust the settings below before starting.
                  </p>

                  <div className="form-group">
                    <label className="form-label font-semibold">Target Job Role</label>
                    <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label font-semibold">Interview Type</label>
                      <select className="form-select" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                        {TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Difficulty Level</label>
                      <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        {DIFF_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label font-semibold">Experience Level</label>
                      <select className="form-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                        {EXP_OPTIONS.map((x) => (
                          <option key={x} value={x}>{x}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Number of Questions</label>
                      <select className="form-select" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                        {COUNT_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c} Questions</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {startError && (
                    <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={16} />
                      <span>{startError}</span>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={ArrowRight}
                      loading={starting}
                      onClick={handleStartInterview}
                      style={{ width: '100%' }}
                    >
                      Start Mock Interview for {role}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeUpload;
