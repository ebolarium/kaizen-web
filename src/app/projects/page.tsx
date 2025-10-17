import Link from 'next/link';
import projectsData from '@/data/projects.json';

const projects = projectsData;

export default function Projects() {
  // Combine all Erasmus projects from K1 and K2
  const allErasmusProjects = [
    ...projects.erasmus.k1.k152,
    ...projects.erasmus.k1.k153,
    ...projects.erasmus.k2.k210,
    ...projects.erasmus.k2.k220
  ];

  // Helper function to get project type label
  const getProjectTypeLabel = (projectId: string) => {
    if (projectId.includes('k152')) return 'K1-K152';
    if (projectId.includes('k153')) return 'K1-K153';
    if (projectId.includes('k210')) return 'K2-K210';
    if (projectId.includes('k220')) return 'K2-K220';
    return 'Erasmus+';
  };

  // Helper function to get project type color
  const getProjectTypeColor = (projectId: string) => {
    if (projectId.includes('k152')) return 'bg-blue-100 text-blue-800';
    if (projectId.includes('k153')) return 'bg-green-100 text-green-800';
    if (projectId.includes('k210')) return 'bg-purple-100 text-purple-800';
    if (projectId.includes('k220')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

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
              
              {allErasmusProjects.length > 0 ? (
                <div className="mb-8">
                  {/* Projects Table */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allErasmusProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4">
                                <Link href={`/projects/${project.id}`} className="flex items-center">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
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
                                  <div className="ml-4">
                                    <Link 
                                      href={`/projects/${project.id}`}
                                      className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors duration-200"
                                    >
                                      {project.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {project.description}
                                    </p>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectTypeColor(project.id)}`}>
                                  {getProjectTypeLabel(project.id)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  project.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : project.status === 'active'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(project.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No Erasmus+ projects available at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back soon for upcoming projects!</p>
                </div>
              )}
              
            </div>
          </div>
          
        </div>
      </section>


    </div>
  );
}
