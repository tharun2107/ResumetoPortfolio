import React from "react";

const Portfolio = ({ data }) => {
  if (!data) return <p className="text-center text-gray-600">No data available</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
        <p className="text-gray-600">{data.profile}</p>
        <div className="mt-2">
          <p className="text-sm">📧 {data.email}</p>
          <p className="text-sm">📞 {data.phone}</p>
        </div>
      </header>

      {/* Links */}
      <div className="flex justify-center gap-4 mb-6">
        {data.links.github && (
          <a href={data.links.github} target="_blank" className="text-blue-500 underline">GitHub</a>
        )}
        {data.links.linkedin && (
          <a href={data.links.linkedin} target="_blank" className="text-blue-500 underline">LinkedIn</a>
        )}
        {data.links.portfolio && (
          <a href={data.links.portfolio} target="_blank" className="text-blue-500 underline">Portfolio</a>
        )}
      </div>

      {/* Section Renderer */}
      {[
        { title: "Education", content: data.education },
        { title: "Experience", content: data.experience },
        { title: "Projects", content: data.projects },
        { title: "Skills", content: data.skills },
        { title: "Certifications", content: data.certifications },
        { title: "Achievements", content: data.achievements }
      ].map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-bold text-gray-700">{section.title}</h2>
          <ul className="list-disc pl-6 text-gray-600">
            {section.content.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
