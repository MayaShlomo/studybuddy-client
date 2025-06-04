import React from 'react';
import Button from './Button';

function ImageUploadCanvas({ canvasRef, fileInputRef, onImageUpload, uploadText = "לחץ להעלאת תמונה", size = 150 }) {
  return (
    <div className="image-upload-container">
      <canvas 
        ref={canvasRef} 
        width={size}
        height={size}
        style={{ 
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'block',
          marginBottom: '1rem'
        }}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onImageUpload}
      />
      <div className="text-center">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}>
          <span>📷</span> {uploadText}
        </Button>
      </div>
    </div>
  );
}

export default ImageUploadCanvas;