import Link from 'next/link';
import projectsData from '@/data/projects.json';

const projects = projectsData;

export default function Projects() {
  const erasmusK2Projects = [...projects.erasmus.k2.k210, ...projects.erasmus.k2.k220];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              KAIZEN focuses both domestic and international subjects on education, research, development, youth work, environment, nature, tourism, digitalization, culture, art, social entrepreneurship, innovation, active citizenship, inclusion, lifelong learning, disadvantaged groups of society, green practises, sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            {/* Erasmus Projects */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Erasmus+ Projects</h3>
                <p className="text-gray-600">
                  International partnerships that bring together institutions across Europe to collaborate on innovative educational initiatives.
                </p>
              </div>
              
              <div className="mb-8">
                {/* Projects Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {erasmusK2Projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/projects/${project.id}`} className="block">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                  {project.image ? (
                                    <img 
                                      src={project.image} 
                                      alt={project.title}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <Link 
                                href={`/projects/${project.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors duration-200"
                              >
                                {project.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.id.includes('k210') ? 'K210' : 'K220'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                project.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : project.status === 'ongoing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>


    </div>
  );
}
