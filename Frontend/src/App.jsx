// import React from "react";
// import GoogleLoginButton from "./components/GoogleLoginButton";

// const App = () => {
//   console.log("client id",import.meta.env.VITE_GOOGLE_CLIENT_ID);
//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Resume to Portfolio Generator</h1>
//       <GoogleLoginButton />
//     </div>
//   );
// };

// export default App;

//show extracted text

// import React, { useState } from "react";
// import ResumeUploader from "./components/ResumeUploader";

// const App = () => {
//   const [extractedText, setExtractedText] = useState("");

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Resume to Portfolio Generator</h1>
//       <ResumeUploader setExtractedText={setExtractedText} />
//       {extractedText && (
//         <div>
//           <h2>Extracted Text:</h2>
//           <pre style={{ whiteSpace: "pre-wrap", textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
//             {extractedText}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


//show parsed data
// import React, { useState } from "react";
// import ResumeUploader from "./components/ResumeUploader";

// const App = () => {
//   const [structuredData, setStructuredData] = useState(null);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Resume to Portfolio Generator</h1>
//       <ResumeUploader setExtractedText={setStructuredData} />
//       {console.log("structuredData",structuredData)}
//       {structuredData && (
//         <div>
//           <h2>Parsed Resume Data:</h2>
//           <pre style={{ whiteSpace: "pre-wrap", textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
//             {JSON.stringify(structuredData, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

//form button for updating manually
// import React, { useState } from "react";
// import ResumeUploader from "./components/ResumeUploader";
// import ResumeForm from "./components/ResumeForm";

// const App = () => {
//   const [parsedData, setParsedData] = useState(null);
//   const [finalData, setFinalData] = useState(null);

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <h1 className="text-center text-3xl font-bold mb-6">Resume to Portfolio Generator</h1>
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//         {!parsedData ? (
//           <ResumeUploader setExtractedText={setParsedData} />
//         ) : (
//           <>
//             <ResumeForm parsedData={parsedData} onSave={setFinalData} />
//             {finalData && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <h2 className="text-xl font-bold">Final Saved Data:</h2>
//                 <pre className="text-sm text-gray-700 mt-2 p-2 bg-white rounded">{JSON.stringify(finalData, null, 2)}</pre>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import ResumeForm from "./components/ResumeForm";
import Portfolio from "./components/Portfolio";

const App = () => {
  const [parsedData, setParsedData] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-center text-3xl font-bold mb-6">Resume to Portfolio Generator</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {!parsedData ? (
          <ResumeUploader setExtractedText={setParsedData} />
        ) : !showPortfolio ? (
          <>
            <ResumeForm parsedData={parsedData} onSave={setFinalData} />
            <button
              onClick={() => setShowPortfolio(true)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Preview Portfolio
            </button>
          </>
        ) : (
          <>
            <Portfolio data={finalData} />
            <button
              onClick={() => setShowPortfolio(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Edit Data
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
