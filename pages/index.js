import { client, urlFor } from "../lib/sanity";
import { motion } from "framer-motion";
import { useState } from "react";

import AIAssistant from "./AIAssistant";

// Fetching data from Sanity
export async function getServerSideProps() {
  const personalInfo = await client.fetch(`*[_type == "personalInfo"][0]`);
  const experiences = await client.fetch(`*[_type == "experience"]`);
  const skills = await client.fetch(`*[_type == "skill"]`);
  const projects = await client.fetch(`*[_type == "project"]`);
  const education = await client.fetch(`*[_type == "education"]`);
  const certifications = await client.fetch(`*[_type == "certification"]`);

  return {
    props: {
      personalInfo,
      experiences,
      skills,
      projects,
      education,
      certifications,
    },
  };
}

export default function Home({
  personalInfo,
  experiences,
  skills,
  projects,
  education,
  certifications,
}) {
  const [showAgent, setShowAgent] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  if (!personalInfo) return <p>Loading...</p>;

  // Call HuggingFace API
  const callAI = async () => {
    if (!input) return;
    setResponse("Thinking...");

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      setResponse(data.answer || "Sorry, I don’t know that.");
    } catch (err) {
      setResponse("Error fetching AI response.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-12 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* --- Personal Info --- */}
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-gray-200">
            <img
              src={
                personalInfo?.profileImage
                  ? urlFor(personalInfo.profileImage)
                      .width(500)
                      .height(500)
                      .url()
                  : "/default-profile.png"
              }
              alt={personalInfo?.name || "Your Name"}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{personalInfo?.name}</h1>
          <h2 className="text-xl text-gray-600">{personalInfo?.role}</h2>
          <p className="mt-2 text-gray-700">{personalInfo?.about}</p>
          <div className="mt-3 flex gap-4 justify-center">
            {personalInfo?.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {personalInfo?.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                className="text-gray-800 hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </section>

        {/* --- Experience --- */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx} className="bg-white shadow-sm p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{exp.company}</h3>
                <p className="text-gray-600">
                  {exp.role} | {exp.duration}
                </p>
                <ul className="list-disc ml-6 mt-2 text-gray-700">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* --- Projects --- */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="bg-white shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{proj.title}</h3>
                {proj.image && (
                  <img
                    src={urlFor(proj.image).url()}
                    alt={proj.title}
                    className="rounded-lg w-full max-h-48 object-cover mb-2"
                  />
                )}
                <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                <p className="text-gray-500 text-sm mb-2">
                  Tech: {proj.techStack.join(", ")}
                </p>
                <div className="flex gap-4">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      className="text-green-600 hover:underline text-sm"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Skills --- */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md transition-shadow duration-300"
              >
                <p className="font-medium text-gray-800">{skill.name}</p>
                <span className="mt-1 text-sm text-gray-500">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* --- Education --- */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="bg-white shadow-sm p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">
                  {edu.institute} | {edu.year}
                </p>
                <p className="text-gray-700">Result: {edu.result}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Certifications --- */}
        <section className="mt-12 mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Certifications
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-white border-l-4 border-blue-500 shadow-sm p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {cert.title}
                </h3>
                <p className="text-gray-600">{cert.provider}</p>
                <span className="text-gray-500 text-sm">{cert.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- AI Assistant --- */}
        <section className="mt-12 mb-12">

          <AIAssistant />
        </section>
      </div>
    </div>
  );
}
