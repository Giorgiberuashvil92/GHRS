import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string;
  maxSize?: number; // MB-ში
  preview?: boolean;
  currentFile?: string;
  className?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.txt,.js,.ts,.json",
  maxSize = 10, // 10MB by default
  preview = true,
  currentFile,
  className = "",
  buttonText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // ზომის შემოწმება
    if (file.size > maxSize * 1024 * 1024) {
      setError(`ფაილის ზომა ძალიან დიდია. მაქსიმუმ ${maxSize}MB`);
      return false;
    }

    // ტიპის შემოწმება
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = acceptedTypes.split(',').map(type => 
      type.startsWith('.') ? type.slice(1) : type.split('/')[1]
    ).filter(Boolean);

    if (allowedExtensions.length > 0 && fileExtension && 
        !allowedExtensions.includes(fileExtension) && 
        !allowedExtensions.includes('*')) {
      setError(`ფაილის ტიპი არასწორია. დაშვებული: ${acceptedTypes}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Preview-ის შექმნა
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400'
          }
          ${selectedFile ? 'bg-green-50 border-green-300' : ''}
        `}
      >
        <div className="flex flex-col items-center space-y-2">
          {!selectedFile ? (
            <>
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-gray-600">
                <p className="font-medium">{buttonText || 'ფაილის ატვირთვა'}</p>
                <p className="text-sm">ან გადმოიტანეთ ფაილი აქ</p>
              </div>
              <p className="text-xs text-gray-500">
                მაქსიმუმ {maxSize}MB, ტიპები: {acceptedTypes}
              </p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-green-600">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && previewUrl && selectedFile && (
        <div className="mt-4 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">გადახედვა:</span>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕ წაშლა
            </button>
          </div>
          
          {selectedFile.type.startsWith('image/') && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded-lg border"
            />
          )}
          
          {selectedFile.type.startsWith('video/') && (
            <video
              src={previewUrl}
              controls
              className="max-w-full h-48 rounded-lg border"
            />
          )}
          
          {!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/') && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected File Info (without preview) */}
      {selectedFile && !preview && (
        <div className="mt-2 flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-sm">{selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 