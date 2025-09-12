import { client, urlFor } from "../lib/sanity";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AIAssistant from "./AIAssistant";

// Fetch data from Sanity
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
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stars canvas
  useEffect(() => {
    const canvas = document.getElementById("spaceCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.8 + 0.2,
    }));

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
      });
      requestAnimationFrame(animateStars);
    };
    animateStars();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  if (!personalInfo) return <p>Loading...</p>;

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-gray-100">
      {/* Stars */}
      <canvas id="spaceCanvas" className="fixed inset-0 w-full h-full z-0" />

      {/* Nebula layers */}
      <img
        src="/nebula1.jpg"
        className="fixed inset-0 w-full h-full object-cover opacity-30 z-0 animate-floatClouds"
        alt="nebula"
      />
      <img
        src="/nebula2.jpg"
        className="fixed inset-0 w-full h-full object-cover opacity-20 z-0 animate-floatCloudsSlow"
        alt="nebula"
      />

      {/* Floating astronauts */}
      <motion.img
        src="/astronaut1.png"
        className="fixed w-24 z-10"
        animate={{ y: [0, 20, 0], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "15%" }}
      />
      <motion.img
        src="/astronaut2.png"
        className="fixed w-32 z-10"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "60%", left: "70%" }}
      />

      <div className="relative max-w-6xl mx-auto z-10 px-6 py-12">
        {/* Personal Info */}
        <motion.section
          className="flex flex-col items-center gap-4 text-center mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{ transform: `translateY(${offsetY * 0.05}px)` }}
        >
          <motion.div
            className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-purple-500"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={
                personalInfo?.profileImage
                  ? urlFor(personalInfo.profileImage).width(500).height(500).url()
                  : "/default-profile.png"
              }
              alt={personalInfo?.name || "Your Name"}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.h1
            className="text-5xl font-serif font-bold text-purple-400 glow-text"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {personalInfo?.name}
          </motion.h1>
          <h2 className="text-2xl text-gray-300 font-serif">{personalInfo?.role}</h2>
          <p className="mt-2 text-gray-300 max-w-2xl">{personalInfo?.about}</p>
          <div className="mt-3 flex gap-6 justify-center">
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo?.github && (
              <a href={personalInfo.github} target="_blank" className="text-gray-300 hover:underline">
                GitHub
              </a>
            )}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section className="mb-20" initial="hidden" animate="visible" variants={fadeLeft}>
          <h2 className="text-4xl font-serif font-bold text-purple-300 mb-6 border-b border-purple-500 pb-2 glow-text">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
              >
                <h3 className="text-lg font-semibold text-purple-300">{exp.company}</h3>
                <p className="text-gray-400">{exp.role} | {exp.duration}</p>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section className="mb-20" initial="hidden" animate="visible" variants={fadeRight}>
          <h2 className="text-4xl font-serif font-bold text-purple-300 mb-6 border-b border-purple-500 pb-2 glow-text">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
              >
                <h3 className="text-lg font-semibold text-purple-300 mb-2">{proj.title}</h3>
                {proj.image && (
                  <img
                    src={urlFor(proj.image).url()}
                    alt={proj.title}
                    className="rounded-lg w-full max-h-48 object-cover mb-2"
                  />
                )}
                <p className="text-gray-300 text-sm mb-2">{proj.description}</p>
                <p className="text-gray-400 text-sm mb-2">Tech: {proj.techStack.join(", ")}</p>
                <div className="flex gap-4">
                  {proj.github && <a href={proj.github} target="_blank" className="text-blue-400 hover:underline text-sm">GitHub</a>}
                  {proj.demo && <a href={proj.demo} target="_blank" className="text-green-400 hover:underline text-sm">Live Demo</a>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section className="mb-20" initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-4xl font-serif font-bold text-purple-300 mb-6 border-b border-purple-500 pb-2 glow-text">
            Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 border border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <p className="font-medium text-purple-300">{skill.name}</p>
                <span className="mt-1 text-sm text-gray-400">{skill.level}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education & Certifications */}
        <motion.section className="mb-20" initial="hidden" animate="visible" variants={fadeLeft}>
          <h2 className="text-4xl font-serif font-bold text-purple-300 mb-6 border-b border-purple-500 pb-2 glow-text">Education</h2>
          <div className="space-y-6">
            {education.map((edu, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
              >
                <h3 className="text-lg font-semibold text-purple-300">{edu.degree}</h3>
                <p className="text-gray-400">{edu.institute} | {edu.year}</p>
                <p className="text-gray-300">Result: {edu.result}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="text-4xl font-serif font-bold text-purple-300 mt-16 mb-6 border-b border-purple-500 pb-2 glow-text">Certifications</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 border-l-4 border-purple-500 shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-purple-300">{cert.title}</h3>
                <p className="text-gray-400">{cert.provider}</p>
                <span className="text-gray-500 text-sm">{cert.year}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Assistant */}
        <section className="mb-20">
          <AIAssistant />
        </section>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&display=swap');

        .font-serif {
          font-family: 'Merriweather', serif;
        }

        .glow-text {
          text-shadow: 0 0 8px #9f7aea, 0 0 16px #6b46c1;
        }

        @keyframes floatClouds {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(50px) translateY(30px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        .animate-floatClouds { animation: floatClouds 60s linear infinite; }

        @keyframes floatCloudsSlow {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-50px) translateY(20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        .animate-floatCloudsSlow { animation: floatCloudsSlow 90s linear infinite; }
      `}</style>
    </div>
  );
}
