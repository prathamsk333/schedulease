import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8"
          >
            {subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex space-x-4"
          >
            <a href="#projects" className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
              View Projects
            </a>
            <a href="#contact" className="border border-current px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Contact Me
            </a>
          </motion.div>
        </div>
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative w-full h-[400px]"
          >
            <Image
              src={imageUrl}
              alt="Your Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
