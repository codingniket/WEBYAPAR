import React, { useRef, useState } from 'react';
import './TextEditor.css';

const TextEditor = () => {
  const editorRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [documentId, setDocumentId] = useState('');

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleSubmit = () => {
    // Add your logic for handling the submission with userId and documentId
    console.log('User ID:', userId);
    console.log('Document ID:', documentId);
  };

  return (
    <div className="text-editor-container">
      <div className="format-buttons">
        <button onClick={() => handleFormat('bold')}>
          <strong>B</strong>
        </button>
        <button onClick={() => handleFormat('italic')}>
          <em>I</em>
        </button>
        <button onClick={() => handleFormat('underline')}>
          <u>U</u>
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor"
        contentEditable={true}
        placeholder="Type your text here..."
      />
      <div className="user-info">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Document ID"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
