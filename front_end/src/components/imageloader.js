// import React, { useState } from 'react';
// import './imageloader.css'; // Import the CSS file for styling

// function ImageUploader() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [uploadStatus, setUploadStatus] = useState(null);
//     const [showResult, setShowResult] = useState(false); // State to control showing result
//     const [htmlContent, setHtmlContent] = useState(null); // State to store HTML content

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleSubmit = async () => {
//         if (!selectedFile) {
//             setUploadStatus('Please select a file.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', selectedFile);

//         try {
//             const response = await fetch('http://localhost:8000/upload/', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const htmlContent = await response.text();
//             setHtmlContent(htmlContent);
//             setShowResult(true); // Set showResult to true after successful upload
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             setUploadStatus('Error uploading image');
//         } finally {
//             setSelectedFile(null); // Reset selectedFile state to null
//         }
//     };

//     return (
//         <div>
//             {!showResult && (
//                 <div className={`container uploading`}>
//                     {/* Apply container class for centering and border */}
//                     <div className="upload-form">
//                         {/* Image upload form */}
//                         <input type="file" onChange={handleFileChange} />
//                         <button onClick={handleSubmit}>Upload Image</button>
//                         {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
//                     </div>
//                 </div>
//             )}
//             {showResult && (
//                 <div className="result-container" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
//             )}
//         </div>
//     );
// }

// export default ImageUploader;

// import React, { useState } from "react";
// import "./imageloader.css"; // Import the CSS file for styling

// function ImageUploader() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [showResult, setShowResult] = useState(false); // State to control showing result
//   const [htmlContent, setHtmlContent] = useState(null); // State to store HTML content

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       setUploadStatus("Please select a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:8000/upload/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const htmlContent = await response.text();
//       setHtmlContent(htmlContent);
//       setShowResult(true); // Set showResult to true after successful upload
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setUploadStatus("Error uploading image");
//     } finally {
//       setSelectedFile(null); // Reset selectedFile state to null
//     }
//   };

//   return (
//     <div>
//       {!showResult && (
//         <div className={`container uploading`}>
//           {/* Container with custom text */}
//           <div className="unveil-text">
//             <p>Discover Your Celebrity Lookalike</p>
            
//           </div>

//           {/* Upload form */}
//           <div className="upload-form">
//             {/* Image upload form */}
//             <input type="file" onChange={handleFileChange} />
//             <button onClick={handleSubmit}>Upload Image</button>
//             {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
//           </div>
//         </div>
//       )}

//       {showResult && (
//         <div className="result-container">
//           {/* Container for the additional content */}
//           <div className="celebrity-matching-line">
//             You look very much like this celebrity
//           </div>

//           {/* Container for the result */}
//           <div
//             className="custom-container"
//             dangerouslySetInnerHTML={{ __html: htmlContent }}
//           ></div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageUploader;


import React, { useState } from "react";
import "./imageloader.css"; // Import the CSS file for styling

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showResult, setShowResult] = useState(false); // State to control showing result
  const [htmlContent, setHtmlContent] = useState(null); // State to store HTML content

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const htmlContent = await response.text();
      setHtmlContent(htmlContent);
      setShowResult(true); // Set showResult to true after successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Error uploading image");
    } finally {
      setSelectedFile(null); // Reset selectedFile state to null
    }
  };

  return (
    <div>
      {!showResult && (
        <div className={`container uploading`}>
          {/* Container with custom text */}
          <div className="unveil-text">
            <p>Discover Your Celebrity Lookalike</p>
            
          </div>

          {/* Upload form */}
          <div className="upload-form">
            {/* Image upload form */}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload Image</button>
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
          </div>
        </div>
      )}

      {showResult && (
        <div className="result-container">
          {/* Container for the additional content */}
          <div className="celebrity-matching-line">
            You look very much like this celebrity
          </div>

          {/* Container for the result */}
          <div
            className="custom-container"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
