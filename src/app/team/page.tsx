'use client';

import { motion } from 'framer-motion';

export default function Team() {
  const founders = [
    {
      name: "Şerife Yüksel",
      role: "English Teacher",
      bio: "Experienced in Erasmus+ KA2 projects. Project consultant and manager.",
      image: "/images/team/Şerife Yüksel.png",
      expertise: ["Erasmus+ KA2", "Project Management", "English Teaching"]
    },
    {
      name: "Özlem Boğa",
      role: "English Teacher",
      bio: "Experienced in Erasmus+ KA2 projects. Master's Degree in Educational Technologies. Project manager.",
      image: "/images/team/Özlem Boğa.png",
      expertise: ["Erasmus+ KA2", "Educational Technologies", "Project Management"]
    }
  ];

  const teamMembers = [
    {
      name: "Barış Boğa",
      role: "Technical Advisor",
      bio: "Technical Advisor with expertise in software development and technology consulting",
      image: "/images/team/Barış Boğa.png",
      expertise: ["Technical Consulting", "Software Development", "Digital Strategy"]
    },
    {
      name: "Yiğit Soysal",
      role: "Youth Worker | Engineering Student",
      bio: "Engaged in Erasmus+ and Creative Youth Initiatives",
      image: "/images/team/Yiğit Soysal.png",
      expertise: ["Erasmus+", "Youth Work", "Creative Initiatives"]
    }
  ];

  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-green-50"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Founders */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Founders
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-4 mx-auto"></div>
          </div>
            <p className="text-gray-600 max-w-xl mx-auto mb-10 text-center">
              Meet the core team behind KAIZEN's initiatives.
            </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
            {founders.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-64 flex items-center justify-center p-2">
                  <div className="w-56 h-56 rounded-full overflow-hidden transform transition-transform duration-500 hover:scale-105">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                              <div class="text-white text-center">
                                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                                  <span class="text-lg font-bold">${member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}</span>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
                    {member.name}
                  </h3>
                  <p className="text-black font-bold mb-3 text-center">
                    {member.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4 text-center">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Team Members
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-4 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-64 flex items-center justify-center p-2">
                  <div className="w-56 h-56 rounded-full overflow-hidden transform transition-transform duration-500 hover:scale-105">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                              <div class="text-white text-center">
                                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                                  <span class="text-lg font-bold">${member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}</span>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
                    {member.name}
                  </h3>
                  <p className="text-black font-bold mb-3 text-center">
                    {member.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4 text-center">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
