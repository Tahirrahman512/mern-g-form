import  { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './App.css';

const FormApp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('form_submitted');
    if (hasSubmitted) setIsSubmitted(true);
  }, []);

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, message: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 409 || response.ok) {
        setIsSubmitted(true);
        localStorage.setItem('form_submitted', 'true');
      } else {
        const data = await response.json();
        setError(data.message || "Submission failed.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const closeModel = () => {
    setIsSubmitted(false);

  };

  return (
    <div className="google-form-wrapper">
     
      {isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="form-header-accent" />
            <div className="modal-body">
              <h2>Thank You!</h2>
              <p>Your response has been recorded successfully.</p>
              <div className="modal-footer">
                <button className="submit-btn" onClick={closeModel}>Close</button>
                <button className="clear-link" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                  Submit another response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-title-section">
        <h1>Contact Form</h1>
        <p className="form-description">Please fill out the details below. All fields are required.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="actual-form">
          <div className="input-group">
            <label>Full Name <span className="required">*</span></label>
            <input 
              type="text" 
              placeholder="Your answer" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Email Address <span className="required">*</span></label>
            <input 
              type="email" 
              placeholder="Your email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Detailed Message <span className="required">*</span></label>
            <div className="editor-container">
              <Editor
                apiKey='nthaubgw2zbw4iw1q1ifzklh2wjg25m5wlpaddmfyv5wkcci'
                value={formData.message}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: 'advlist autolink lists link charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat',
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
          </div>

          {error && <p className="error-text" style={{color: 'red', padding: '10px 24px'}}>{error}</p>}

          <div className="form-footer">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Submitting..." : "Submit"}
            </button>
            <div onClick={() => window.location.reload()}><span className="clear-link">Clear form</span></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormApp;