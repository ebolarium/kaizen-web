'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [projects, setProjects] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects from API...');
        const response = await fetch('/api/projects', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Projects data received:', data);
          setProjects(data);
        } else {
          console.error('API response not ok:', response.status);
          // Fallback to static data
          const projectsData = await import('@/data/projects.json');
          setProjects(projectsData.default);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to static data
        const projectsData = await import('@/data/projects.json');
        setProjects(projectsData.default);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading || !projects) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get latest events (local projects) - most recent first
  const latestEvents = projects.local
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Get latest activities from all projects - most recent first
  const allProjects = [
    ...projects.local,
    ...projects.erasmus.k1.k152,
    ...projects.erasmus.k1.k153,
    ...projects.erasmus.k2.ka210,
    ...projects.erasmus.k2.k220
  ];
  
  const allActivities = allProjects
    .filter((project: any) => project.activities && project.activities.length > 0)
    .flatMap((project: any) => 
      project.activities.map((activity: any) => ({
        ...activity,
        projectTitle: project.title,
        projectId: project.id,
        projectImage: project.image
      }))
    )
    .sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id)) // Sort by ID (timestamp) descending - newest first
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-cover bg-no-repeat text-white" style={{backgroundImage: 'url(/images/home_page_hero.JPG)', backgroundPosition: 'center bottom'}}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
<h2 className="text-5xl md:text-8xl font-bold text-white tracking-widest" style={{fontFamily: 'TT Firs Neue, sans-serif'}}>
  KAIZEN
</h2>
            </div>
<h1 className="text-base md:text-2xl font-bold mb-6 text-white max-w-6xl mx-auto typewriter" style={{fontFamily: 'Candara, sans-serif'}}>
  Intercultural Communication and Educational Research Association
</h1>
          </div>
        </div>
      </section>
      <br/><br/>
      {/* Content with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
        {/* About Section */}
        <section id="about" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              About Us
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-8 mx-auto"></div>
          </div>
<div className="flex flex-col md:flex-row items-center gap-8">
  {/* Logo - sadece md ve üstü */}
  <div className="hidden md:flex md:w-1/5 justify-center">
    <Image
      src="/images/logo.png"
      alt="Kaizen Logo"
      width={180}
      height={180}
      className="w-48 h-48 object-contain"
    />
  </div>
            
  {/* Text */}
  <div className="w-full md:w-4/5">
    <p className="text-lg text-gray-700 leading-relaxed">
              KAIZEN started its activities in 2023 as a non governmental organization in Adana, Turkiye.
              The founders of the association
              are experienced in international projects such as Erasmus+,
              Youth, e-Twinning and in projects in the field of science and education
              carried out in the national arena, who are executives in this field,
              and who also provide training on these issues for more than 10 years.
              </p> <br/>
              <p className="text-lg text-gray-700 leading-relaxed">
Besides its founders, KAIZEN consists of more than 15 people who are competent in their field,
attach importance to personal development, and apply the understanding of lifelong
learning in their own lives.
</p> <br/>
<p className="text-lg text-gray-700 leading-relaxed">
Believing that lifelong learning should be supported so that the individual does not lag
behind the developments, we carry out our activities in different fields with different age
groups especially with youth.




 </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Activities */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Project Updates
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-8 mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our recent project activities and progress.
            </p>
          </div>
          
          {allActivities.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {allActivities.map((activity: any, index: number) => (
                <article key={activity.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg mb-4 flex items-center justify-center">
                    {activity.images && activity.images.length > 0 ? (
                      <Image
                        src={activity.images[0]}
                        alt={`${activity.projectTitle} activity`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : activity.projectImage ? (
                      <Image
                        src={activity.projectImage}
                        alt={activity.projectTitle}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold">{activity.projectTitle.charAt(0)}</span>
                        </div>
                        <p className="text-sm opacity-80">Activity Image</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.projectTitle}</h3>
                  <div className="text-sm text-gray-600 mb-4 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }} dangerouslySetInnerHTML={{ 
                    __html: activity.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') 
                  }} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(parseInt(activity.id)).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/projects/${activity.projectId}`}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                    >
                      View Project →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No activities available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for project updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest Events
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-8 mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most recent local and online events.
            </p>
          </div>
          
          {latestEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {latestEvents.map((event: any) => (
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

    </div>
  );
}