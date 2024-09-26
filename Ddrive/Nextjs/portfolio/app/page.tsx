import React from 'react'
import Navbar from './modules/Navbar'
import Hero from './modules/Hero'
import Skills from './modules/Skills'
import Projects from './modules/Projects'
import Contact from './modules/Contact'
import Footer from './modules/Footer'
import { FaReact, FaNodeJs, FaCss3Alt, FaHtml5, FaJs } from 'react-icons/fa'

const Portfolio: React.FC = () => {
  const skills = [
    { name: 'React', icon: <FaReact /> },
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'CSS3', icon: <FaCss3Alt /> },
    { name: 'HTML5', icon: <FaHtml5 /> },
    { name: 'JavaScript', icon: <FaJs /> },
  ]

  return (
    <div>
      <Navbar name="Your Name" links={['Hero', 'Skills', 'Projects', 'Contact']} />
      <Hero title="Hi, I'm Your Name" subtitle="Full Stack Developer" imageUrl="/your-image.png" />
      <Skills skills={skills} darkMode={false} />
      <Projects darkMode={false} />
      <Contact />
      <Footer />
    </div>
  )
}

export default Portfolio
