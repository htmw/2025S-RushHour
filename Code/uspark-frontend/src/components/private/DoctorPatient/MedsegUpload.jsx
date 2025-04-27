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
      alert('Please fill both fields');
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
      padding: '40px 20px',
      background: '#f5f6fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      
      {/* Card for Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '40px'
      }}>
        <h2 style={{ textAlign: 'center', fontWeight: '700', fontSize: '26px', marginBottom: '25px', color: '#333' }}>
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
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              background: '#f9f9f9'
            }}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '10px',
              fontSize: '16px',
              background: '#f9f9f9',
              border: '1px solid #ccc'
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
              fontSize: '17px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#28a745',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            {loading ? 'Uploading...' : 'Segment and Upload'}
          </button>
        </form>

        {loading && (
          <div style={{
            marginTop: '20px',
            height: '20px',
            background: '#ddd',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#28a745',
                color: 'white',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                lineHeight: '20px',
                transition: 'width 0.4s'
              }}
            >
              {progress}%
            </div>
          </div>
        )}

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: message.includes('Successful') ? '#d4edda' : '#f8d7da',
            color: message.includes('Successful') ? '#155724' : '#721c24',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '15px'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Card for Output */}
      {segmentedImageUrl && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          padding: '30px',
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            Segmented Output
          </h3>
          <div style={{
            background: '#f2f2f2',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px'
          }}>
            <img
              src={segmentedImageUrl}
              alt="Segmented Result"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
          </div>
          <a
            href={segmentedImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#007bff',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'underline'
            }}
          >
            View Full Image
          </a>
        </div>
      )}

    </div>
  );
}

export default MedsegUpload;
