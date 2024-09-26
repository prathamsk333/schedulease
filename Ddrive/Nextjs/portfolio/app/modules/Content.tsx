import Image from 'next/image'

export default function Content() {
  const skills = ["Node.js", "Next.js", "MongoDB", "AWS", "JavaScript", "C++"]
  const projects = [
    { id: 1, title: "Project 1", description: "A brief description of Project 1" },
    { id: 2, title: "Project 2", description: "A brief description of Project 2" },
    { id: 3, title: "Project 3", description: "A brief description of Project 3" },
  ]

  return (
    <div>
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center text-black">Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg px-6 py-3">
                <span className="text-black">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center text-black">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Image src={`/placeholder.svg`} alt={project.title} width={400} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="text-xl font-bold mb-2 text-black">{project.title}</h4>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  )
}