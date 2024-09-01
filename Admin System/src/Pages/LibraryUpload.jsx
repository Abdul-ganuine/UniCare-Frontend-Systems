import React, { useState } from "react";
import "./LibraryUpload.css";

const LibraryUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Example: Handle file upload
  const handleUpload = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <div className='upload-heading'>Upload Files</div>
      <div className='upload-subheading'>Upload New Document</div>
      <div className='upload-side-tabs'>
        <div className='tabs-view'>View</div>
        <div className='upload-side-tabs-btn'>Upload</div>
      </div>
      <div className='upload-input-title'>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='desc'>
        <textarea
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className='upload-send-btn'>
        <button className='upload-cancel'>Cancel</button>
        <button className='upload-send' onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default LibraryUpload;
