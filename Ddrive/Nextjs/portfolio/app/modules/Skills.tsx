import React from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from 'framer-motion'

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillsProps {
  skills: Skill[];
  darkMode: boolean;
}

const Skills: React.FC<SkillsProps> = ({ skills, darkMode }) => {
  const skillsAnimation = useAnimation()

  React.useEffect(() => {
    skillsAnimation.start({
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    })
  }, [skillsAnimation])

  return (
    <section className={`py-16 transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4">
        <h3 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Skills</h3>
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex space-x-4 whitespace-nowrap"
            animate={skillsAnimation}
          >
            {[...skills, ...skills].map((skill, index) => (
              <div key={index} className={`shadow-md rounded-lg px-6 py-3 flex items-center space-x-2 transition-colors duration-500 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                {skill.icon}
                <span>{skill.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Skills
