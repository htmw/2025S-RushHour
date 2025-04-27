import React, { useState } from 'react';
import axios from 'axios';

function MedsegUpload() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [segmentedImageUrl, setSegmentedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !email) {
      alert('Please enter email and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientEmail', email);

    try {
      setLoading(true);
      setProgress(0);
      setMessage('');

      const response = await axios.post('http://localhost:5001/api/medseg/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setSegmentedImageUrl(response.data.s3Url);
      setMessage('Segmentation and Upload Successful!');
    } catch (error) {
      console.error(error);
      setMessage('Segmentation Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5', // White theme background (neutral)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        width: '1200px',
        maxWidth: '95%',
        padding: '40px',
        display: 'flex',
        gap: '40px'
      }}>
        
        {/* Left: Form Section */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '30px', fontSize: '26px', fontWeight: '700', color: '#333' }}>
            Useg Biomedical Image Segmentation
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Patient Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '20px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '20px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                background: '#f9f9f9',
                fontSize: '16px'
              }}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: loading ? '#9ccc9c' : '#4caf50',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {loading ? 'Uploading...' : 'Segment and Upload'}
            </button>
          </form>

          {/* Progress Bar */}
          {loading && (
            <div style={{
              marginTop: '20px',
              background: '#ddd',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '18px'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#4caf50',
                transition: 'width 0.4s ease',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {progress}%
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: message.includes('Successful') ? '#e6f4ea' : '#fdecea',
              color: message.includes('Successful') ? '#276749' : '#c53030',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Right: Image Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid #eee'
        }}>
          {segmentedImageUrl ? (
            <>
              <h3 style={{ marginBottom: '20px', fontSize: '22px', color: '#333' }}>Segmented Output:</h3>
              <img
                src={segmentedImageUrl}
                alt="Segmented Output"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                }}
              />
              <a
                href={segmentedImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: '15px',
                  color: '#007bff',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                View Full Image
              </a>
            </>
          ) : (
            <p style={{ color: '#aaa', fontSize: '18px' }}>No output yet. Please upload an image.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default MedsegUpload;
