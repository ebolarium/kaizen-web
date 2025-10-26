import Link from 'next/link';
import Image from 'next/image';
import projectsData from '@/data/projects.json';

const projects = projectsData;

export default function Events() {
  const localEvents = projects.local;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Events and Trainings
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-8 mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our local community events and training programs that bring people together for education, culture, and social development.
            </p>
          </div>
          
          {localEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localEvents.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/projects/${event.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 group"
                >
                  <div className="relative h-48">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-r from-blue-400 to-green-400"></div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold group-hover:text-blue-800 transition-colors duration-200">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6">
                We&apos;re working on organizing exciting local events. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
