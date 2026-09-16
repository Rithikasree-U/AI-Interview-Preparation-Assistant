import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { ArrowRight, CheckCircle2, Target, Cpu, BarChart3, ShieldCheck, History, Award, BookOpen, UserCheck } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: 'Role-Based Practice',
      description: 'Tailored questions built specifically for Software Developers, Frontend, Backend, Data Analysts, Java, and Python engineers.'
    },
    {
      icon: Cpu,
      title: 'Technical & HR Questions',
      description: 'Practice real-world coding concepts, system design fundamentals, DBMS, and essential HR/behavioral questions.'
    },
    {
      icon: Award,
      title: 'AI Answer Feedback',
      description: 'Receive immediate, constructive, and natural feedback on your correctness, technical depth, and communication style.'
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      description: 'Monitor your improvement over time with detailed category breakdowns, radar metrics, and target topic recommendations.'
    },
    {
      icon: History,
      title: 'Interview History',
      description: 'Review previous mock interview sessions anytime to re-examine suggested answers and refine your weak areas.'
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Question System',
      description: 'Engineered with a robust question bank fallback ensuring smooth practice sessions without external API interruptions.'
    }
  ];

  const steps = [
    { number: '01', title: 'Choose Your Role', desc: 'Select target position, experience level (Fresher to 5 Yrs), and difficulty.' },
    { number: '02', title: 'Start Interview', desc: 'Begin a realistic timed or self-paced mock interview session.' },
    { number: '03', title: 'Answer Questions', desc: 'Type your technical answers and explain your reasoning step-by-step.' },
    { number: '04', title: 'Receive AI Feedback', desc: 'Get detailed scoring, strengths, key missing points, and ideal answers.' },
    { number: '05', title: 'Track & Improve', desc: 'Review your dashboard statistics, spot weak areas, and practice again.' }
  ];

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* HERO SECTION */}
        <section style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '4rem 1.5rem 5rem 1.5rem',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="grid-2">
            <div>
              <span className="badge badge-primary font-medium" style={{ marginBottom: '1rem', padding: '0.375rem 0.875rem' }}>
                Placement & Tech Interview Preparation
              </span>
              <h1 className="text-3xl font-bold" style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Prepare for your next interview with confidence.
              </h1>
              <p className="text-lg text-muted" style={{ lineHeight: 1.6, marginBottom: '2rem' }}>
                Practice role-specific technical and HR interviews, get structured feedback on your answers, and track your performance step-by-step. Built for developers and job seekers.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/register">
                  <Button size="lg" icon={ArrowRight}>Start Practicing Now</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Sign In</Button>
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem' }} className="text-xs text-muted">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><CheckCircle2 size={16} color="var(--success)" /> No credit card required</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><CheckCircle2 size={16} color="var(--success)" /> 60+ Curated Question Sets</span>
              </div>
            </div>

            {/* Visual SaaS Illustration Container */}
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                </div>
                <span className="text-xs font-semibold text-muted">Mock Session Preview</span>
              </div>

              <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                <span className="badge badge-secondary text-xs" style={{ marginBottom: '0.5rem' }}>Question 2 of 5 • Java Developer</span>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  "What is the difference between an ArrayList and a LinkedList in Java?"
                </p>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  ArrayList uses a dynamic array providing fast random access O(1), whereas LinkedList is a doubly-linked list best for frequent insertions...
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--success-bg)', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--success-text)' }}>AI Feedback • 8.5/10</span>
                  <p className="text-xs" style={{ color: 'var(--success-text)', marginTop: '0.25rem' }}>
                    Great explanation of dynamic array memory layout vs pointers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              <span className="badge badge-muted font-medium" style={{ marginBottom: '0.5rem' }}>Features</span>
              <h2 className="text-2xl font-bold">Everything you need to clear technical rounds</h2>
              <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                Structured tools designed to simulate real software engineering and HR interviews.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div key={idx} className="card" style={{ transition: 'transform 0.15s ease' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold" style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p className="text-sm text-muted" style={{ lineHeight: 1.5 }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              <span className="badge badge-muted font-medium" style={{ marginBottom: '0.5rem' }}>Simple Workflow</span>
              <h2 className="text-2xl font-bold">How InterviewMate AI Works</h2>
              <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                Five simple steps to boost your technical confidence and communication.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {steps.map((s, idx) => (
                <div key={idx} className="card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--primary)', opacity: 0.8, display: 'block', marginBottom: '0.5rem' }}>
                    {s.number}
                  </span>
                  <h4 className="text-base font-semibold" style={{ marginBottom: '0.375rem' }}>{s.title}</h4>
                  <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid #99f6e4',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
          }}>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--primary-text)', marginBottom: '0.75rem' }}>
              Ready to ace your upcoming technical interview?
            </h2>
            <p className="text-sm text-muted" style={{ color: 'var(--primary-text)', opacity: 0.9, marginBottom: '1.5rem' }}>
              Start practicing with customized role questions and detailed AI evaluation today.
            </p>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }} className="text-xs text-muted">
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>InterviewMate AI</span>
            <span> — Practice smarter. Interview better.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div>
            © {new Date().getFullYear()} InterviewMate AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
