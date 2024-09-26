import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProjectsProps {
  darkMode: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ darkMode }) => {
  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <motion.div 
              key={project}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: project * 0.1 }}
              className={`shadow-lg rounded-lg overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Image src={`/placeholder.svg`} alt={`Project ${project}`} width={400} height={200} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Project {project}</h4>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
