// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
// const fs = require("fs");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // Helper function to extract structured data
// const extractStructuredData = (text) => {
//   const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

//   let structuredData = {
//     name: "",
//     email: "",
//     phone: "",
//     profile: "",
//     education: [],
//     experience: [],
//     projects: [],
//     skills: [],
//     certifications: [],
//     achievements: [],
//     links: {
//       github: "",
//       linkedin: "",
//       portfolio: "",
//     },
//   };

//   // Extract Name, Email, and Phone
//   structuredData.name = lines[0]; // First line is usually the name
//   structuredData.email = lines.find((line) => line.includes("@")) || "";
//   structuredData.phone = lines.find((line) => /\d{10}/.test(line)) || "";

//   // Extract Profile Summary
//   const profileIndex = lines.findIndex((line) => line.toLowerCase().includes("profile"));
//   if (profileIndex !== -1) {
//     structuredData.profile = lines[profileIndex + 1];
//   }

//   // Extract Education
//   const educationIndex = lines.findIndex((line) => line.toLowerCase().includes("education"));
//   if (educationIndex !== -1) {
//     for (let i = educationIndex + 1; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes("internship") || lines[i].toLowerCase().includes("experience")) break;
//       structuredData.education.push(lines[i]);
//     }
//   }

//   // Extract Experience
//   const experienceIndex = lines.findIndex((line) => line.toLowerCase().includes("internship") || line.toLowerCase().includes("experience"));
//   if (experienceIndex !== -1) {
//     for (let i = experienceIndex + 1; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes("projects") || lines[i].toLowerCase().includes("technical skills")) break;
//       structuredData.experience.push(lines[i]);
//     }
//   }

//   // Extract Projects
//   const projectIndex = lines.findIndex((line) => line.toLowerCase().includes("projects"));
//   if (projectIndex !== -1) {
//     for (let i = projectIndex + 1; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes("skills") || lines[i].toLowerCase().includes("certifications")) break;
//       structuredData.projects.push(lines[i]);
//     }
//   }

//   // Extract Skills
//   const skillsIndex = lines.findIndex((line) => line.toLowerCase().includes("skills") || line.toLowerCase().includes("technical skills"));
//   if (skillsIndex !== -1) {
//     structuredData.skills = lines[skillsIndex + 1]
//       .replace("Languages:", "")
//       .replace("Frameworks:", "")
//       .replace("Web Technologies:", "")
//       .replace("Tools & Platforms:", "")
//       .split(",")
//       .map((skill) => skill.trim());
//   }

//   // Extract Certifications
//   const certIndex = lines.findIndex((line) => line.toLowerCase().includes("certifications"));
//   if (certIndex !== -1) {
//     for (let i = certIndex + 1; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes("achievements")||lines[i].toLowerCase().includes("languages known")) break;
//       structuredData.certifications.push(lines[i]);
//     }
//   }

//   // Extract Achievements
//   const achievementsIndex = lines.findIndex((line) => line.toLowerCase().includes("achievements"));
//   if (achievementsIndex !== -1) {
//     for (let i = achievementsIndex + 1; i < lines.length; i++) {
//       structuredData.achievements.push(lines[i]);
//     }
//   }

//   // Extract Links (GitHub, LinkedIn, Portfolio)
//   lines.forEach((line) => {
//     if (line.includes("github.com")) {
//       structuredData.links.github = line;
//     }
//     if (line.includes("linkedin.com")) {
//       structuredData.links.linkedin = line;
//     }
//     if (line.includes("netlify.app") || line.includes("vercel.app") || line.includes(".com")) {
//       structuredData.links.portfolio = line;
//     }
//   });

//   return structuredData;
// };

// // Resume upload route
// router.post("/resume", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const filePath = req.file.path;
//     let extractedText = "";

//     if (req.file.mimetype === "application/pdf") {
//       const dataBuffer = fs.readFileSync(filePath);
//       const data = await pdfParse(dataBuffer);
//       extractedText = data.text;
//     } else if (
//       req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       const dataBuffer = fs.readFileSync(filePath);
//       const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
//       extractedText = value;
//     } else {
//       return res.status(400).json({ message: "Unsupported file type" });
//     }

//     fs.unlinkSync(filePath); // Delete file after processing

//     const structuredData = extractStructuredData(extractedText);
//     res.json({ structuredData });

//   } catch (error) {
//     console.error("Error parsing resume:", error);
//     res.status(500).json({ message: "Failed to process resume" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const nlp = require("compromise");
const stringSimilarity = require("string-similarity");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Keyword mappings for better classification
const SECTION_KEYWORDS = {
  education: ["education", "academics", "school", "college", "university"],
  experience: ["experience", "internship", "work", "employment"],
  projects: ["projects", "portfolio", "work samples"],
  skills: ["skills", "technologies", "proficiencies"],
  certifications: ["certifications", "certificates", "courses"],
  achievements: ["achievements", "awards", "honors"],
};

// NLP-based structured extraction
const extractStructuredData = (text) => {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  let structuredData = {
    name: "",
    email: "",
    phone: "",
    profile: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    links: {
      github: "",
      linkedin: "",
      portfolio: "",
    },
  };

  // Use NLP to extract key entities
  let doc = nlp(text);
  structuredData.name = doc.people().out("text") || lines[0]; // Extract Name
  structuredData.email = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/) || "";
  structuredData.phone = text.match(/\b\d{10,12}\b/) || "";

  let currentSection = null;

  lines.forEach((line) => {
    let lowerLine = line.toLowerCase();

    // Check for section headers dynamically
    for (let section in SECTION_KEYWORDS) {
      if (SECTION_KEYWORDS[section].some((keyword) => lowerLine.includes(keyword))) {
        currentSection = section;
        return;
      }
    }

    // Classify content into the correct section
    if (currentSection && line.length > 5) {
      structuredData[currentSection].push(line);
    }
  });

  // Extract social media links
  structuredData.links.github = lines.find((line) => line.includes("github.com")) || "";
  structuredData.links.linkedin = lines.find((line) => line.includes("linkedin.com")) || "";
  structuredData.links.portfolio = lines.find((line) => line.includes("vercel.app") || line.includes("netlify.app")) || "";

  return structuredData;
};

// Resume upload route
router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const dataBuffer = fs.readFileSync(filePath);
      const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = value;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    fs.unlinkSync(filePath); // Delete file after processing

    const structuredData = extractStructuredData(extractedText);
    res.json({ structuredData });

  } catch (error) {
    console.error("Error parsing resume:", error);
    res.status(500).json({ message: "Failed to process resume" });
  }
});

module.exports = router;
