import React from 'react'

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Contact Me</h3>
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input type="text" id="name" className="w-full px-3 py-2 text-black rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 text-black rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea id="message" rows={4} className="w-full px-3 py-2 text-black rounded"></textarea>
          </div>
          <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
