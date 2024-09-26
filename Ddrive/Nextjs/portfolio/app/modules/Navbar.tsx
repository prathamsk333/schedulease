import React from 'react'
import { motion } from 'framer-motion'

interface NavbarProps {
  name: string;
  links: string[];
}

const Navbar: React.FC<NavbarProps> = ({ name, links }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        {name}
      </motion.h1>
      <nav>
        <motion.ul 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex space-x-4"
        >
          {links.map((item) => (
            <motion.li key={item}>
              <a href={`#${item.toLowerCase()}`} className="hover:text-red-500 transition-colors">
                {item}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </header>
  )
}

export default Navbar
