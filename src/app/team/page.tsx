'use client';

import Link from 'next/link';

export default function Team() {
  const teamMembers = [
    {
      name: "Şerife Yüksel",
      role: "English Teacher",
      bio: "Experienced in Erasmus+KA2 projects. Project consultant and manager.",
      image: "/images/team/Şerife Yüksel.png",
      expertise: ["Erasmus+ KA2", "Project Management", "English Teaching"]
    },
    {
      name: "Özlem Boğa",
      role: "English Teacher",
      bio: "Experienced in Erasmus+KA2 projects. Master's Degree in Educational Technologies. Project manager.",
      image: "/images/team/Özlem Boğa.png",
      expertise: ["Erasmus+ KA2", "Educational Technologies", "Project Management"]
    }
  ];


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Meet the passionate individuals who make Kaizen's mission possible through their expertise, dedication, and commitment to continuous improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Founders</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="h-64 flex items-center justify-center p-2">
                  <div className="w-56 h-56 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                              <div class="text-white text-center">
                                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                                  <span class="text-lg font-bold">${member.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <p class="text-xs opacity-80">Photo coming soon</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
