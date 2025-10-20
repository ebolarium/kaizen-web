import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className="bg-white">
      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">KAIZEN Intercultural Communication and Education Research Association</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  KAIZEN started its activities in 2023 as a non governmental organization. Although the date of establishment is new, 
                  the founders of the association are experienced in international projects such as Erasmus+, Youth, e-Twinning and in 
                  projects in the field of science and education carried out in the national arena, who are executives in this field, 
                  and who also provide training on these issues for more than 10 years.
                </p>
                <p>
                  Besides its founders, KAIZEN consists of 14 people who are competent in their field, attach importance to personal 
                  development, and apply the understanding of lifelong learning in their own lives.
                </p>
                <p>
                  Believing that lifelong learning should be supported so that the individual does not lag behind the developments, 
                  we carry out our activities in different fields with different age groups within the framework of this idea.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/uploads/about-us.jpg"
                alt="About KAIZEN"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
