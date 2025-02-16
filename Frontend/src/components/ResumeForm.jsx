import React, { useState, useEffect } from "react";

const ResumeForm = ({ parsedData, onSave }) => {
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (parsedData) {
      setFormData(parsedData);
    }
  }, [parsedData]);

  // Handle input changes
  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Handle list changes
  const handleListChange = (e, field, index) => {
    const updatedList = [...formData[field]];
    updatedList[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedList });
  };

  // Add new entry
  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  // Delete an entry
  const deleteField = (field, index) => {
    const updatedList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Resume Data</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>
        <input type="text" className="w-full p-2 border rounded" value={formData.name} onChange={(e) => handleChange(e, "name")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Email:</label>
          <input type="email" className="w-full p-2 border rounded" value={formData.email} onChange={(e) => handleChange(e, "email")} />
        </div>
        <div>
          <label className="block text-gray-700">Phone:</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.phone} onChange={(e) => handleChange(e, "phone")} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Profile Summary:</label>
        <textarea className="w-full p-2 border rounded" value={formData.profile} onChange={(e) => handleChange(e, "profile")} />
      </div>

      {/* Dynamic Sections */}
      {["education", "experience", "projects", "skills", "certifications", "achievements"].map((field) => (
        <div key={field} className="mb-4">
          <h3 className="text-lg font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
          {formData[field].map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" className="w-full p-2 border rounded" value={item} onChange={(e) => handleListChange(e, field, index)} />
              <button onClick={() => deleteField(field, index)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          ))}
          <button onClick={() => addField(field)} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">+ Add</button>
        </div>
      ))}

      {/* Links Section */}
      <h3 className="text-lg font-bold">Links</h3>
{Object.keys(formData.links).map((link) => (
  <div key={link} className="mb-2">
    <label className="block text-gray-700">{link.charAt(0).toUpperCase() + link.slice(1)}:</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      value={formData.links[link] || ""}
      onChange={(e) => setFormData({ 
        ...formData, 
        links: { ...formData.links, [link]: e.target.value } 
      })}
      />
      </div>
    ))}

      <button onClick={handleSave} className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full">Save & Continue</button>
    </div>
  );
};

export default ResumeForm;
