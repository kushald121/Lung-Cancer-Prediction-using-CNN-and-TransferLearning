import React, { useState } from 'react';
import {
  Upload, FileType, Sparkles, Activity, ShieldCheck,
  Cpu, Zap, ChevronRight, Github, ExternalLink, Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'https://lung-cancer-prediction-using-cnn-and.onrender.com';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const Navbar = () => (
  <nav className="navbar fade-in">
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Activity size={28} color="#3b82f6" />
      <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '1px' }}>LUNG<span className="gradient-text">AI</span></span>
    </div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#technology">Technology</a></li>
      <li><a href="#analysis">Analysis</a></li>
    </ul>
    <a href="#analysis" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Analyze Scan</a>
  </nav>
);

const Hero = () => (
  <section className="hero-section">
    <div className="hero-content fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ display: 'inline-flex', padding: '6px 15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
        XCEPTION MODEL v2.0 READY
      </motion.div>
      <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '2rem' }}>
        Precision <span className="gradient-text">Diagnostics</span> Driven by AI.
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '550px' }}>
        A state-of-the-art diagnostic assistant designed to analyze Chest CT scans with high accuracy, providing clinicians with instant secondary insights.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="#analysis" className="btn-primary" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Start Free Analysis <ChevronRight size={18} />
        </a>
        <a href="#technology" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          View Documentation <ExternalLink size={16} />
        </a>
      </div>
    </div>
    <div className="hero-visual fade-in">
      <div className="scanner-visual">
        <div className="scanner-ring" style={{ width: '100%', height: '100%' }}></div>
        <div className="scanner-ring" style={{ width: '80%', height: '80%', animationDelay: '1s' }}></div>
        <div className="scanner-ring" style={{ width: '60%', height: '60%', animationDelay: '2s' }}></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ width: '250px', height: '250px', border: '1px solid var(--accent-primary)', opacity: 0.1, borderRadius: '40%' }}
        />
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <Sparkles size={80} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 20px #3b82f6)' }} />
        </div>
      </div>
    </div>
  </section >
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="glass-card feature-card">
    <div className="feature-icon"><Icon size={32} /></div>
    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const AnalysisTool = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPrediction(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err) {
      setError('Connection failed. Please ensure the backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div id="analysis" className="analysis-wrapper fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-title">Analysis <span className="gradient-text">Suite</span></h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
          Upload your scan below and let the neural network provide a detailed diagnostic report.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: prediction ? '1fr 1fr' : '1fr', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <section className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} color="#3b82f6" /> Digital Intake
          </h3>
          <div
            style={{ border: '2px dashed var(--glass-border)', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input id="file-upload" type="file" hidden accept="image/*" onChange={onFileChange} />
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <FileType size={40} color="#3b82f6" />
                <p style={{ fontWeight: 600 }}>Select Scan Image</p>
              </div>
            )}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleUpload} disabled={!file || loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Run Prediction'}
            </button>
            {file && <button onClick={reset} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Clear</button>}
          </div>
          {error && <div style={{ marginTop: '1.5rem', color: '#f87171', display: 'flex', gap: '10px' }}><AlertCircle size={18} /> {error}</div>}
        </section>

        <AnimatePresence>
          {prediction && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Classification Result</p>
                <h3 style={{ fontSize: '2.2rem' }} className="gradient-text">{prediction.prediction}</h3>
                <p style={{ fontWeight: 600 }}>{(prediction.confidence * 100).toFixed(2)}% Match</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {prediction.all_results.map((res, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>{res.label}</span>
                      <span>{(res.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${res.probability * 100}%`, background: i === 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />
      <div className="app-container">
        <Hero />

        <section id="features">
          <h2 className="section-title">Standard of <span className="gradient-text">Care</span></h2>
          <div className="feature-grid">
            <FeatureCard
              icon={Zap}
              title="Instant Latency"
              desc="Analysis completed in under 2 seconds using high-performance specialized hardware."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Privacy First"
              desc="Scans are processed and cleared instantly. We never store patient imaging data."
            />
            <FeatureCard
              icon={Cpu}
              title="State-of-the-Art"
              desc="Utilizing Xception's 71 layers of advanced deep learning featuring depthwise separable convolutions."
            />
          </div>
        </section>

        <section id="technology" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Built on <span className="gradient-text">Innovation</span></h2>
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', textAlign: 'left' }}>
            <div>
              <h3 style={{ marginBottom: '1.2rem' }}>Xception Architecture</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                This platform is powered by the Xception model, a deep convolutional neural network that improves upon Inception by replacing standard modules with depthwise separable convolutions.
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1.2rem' }}>Transfer Learning</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                Pre-trained on ImageNet and fine-tuned for thoracic imaging, our model recognizes intricate patterns that distinguish various forms of lung carcinoma.
              </p>
            </div>
          </div>
        </section>

        <AnalysisTool />

        <footer style={{ padding: '6rem 0 3rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <Github size={20} color="#94a3b8" />
            <Activity size={20} color="#94a3b8" />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            &copy; 2026 LUNG AI DIAGNOSTICS. Developed for clinical research assistance.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
