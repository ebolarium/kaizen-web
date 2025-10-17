import Link from 'next/link';
import Image from 'next/image';
import projectsData from '@/data/projects.json';

const projects = projectsData;

export default function Home() {
  // Get latest events (local projects) - most recent first
  const latestEvents = projects.local
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
        <Image
                src="/images/logo.png"
                alt="Kaizen Logo"
                width={160}
                height={160}
                className="w-40 h-40 object-contain"
              />
            </div>
            <p className="text-lg md:text-xl mb-6 text-blue-100 max-w-4xl mx-auto">
              KAIZEN is a non-governmental organization founded in 2023 by experts with over 10 years of experience in international education and cultural projects. We promote lifelong learning across all age groups through diverse activities and initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/projects" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Explore Our Projects
              </Link>
              <Link 
                href="/about" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Latest Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most recent local events and community initiatives.
            </p>
          </div>
          
          {latestEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {latestEvents.map((event) => (
                <article key={event.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg mb-4 flex items-center justify-center">
                    {event.image ? (
            <Image
                        src={event.image}
                        alt={event.title}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold">{event.title.charAt(0)}</span>
                        </div>
                        <p className="text-sm opacity-80">Event Image</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                    <Link 
                      href={`/projects/${event.id}`}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                    >
                      Learn More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No events available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for upcoming events!</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}