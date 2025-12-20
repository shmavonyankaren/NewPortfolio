import React from "react";

const AboutTestimonials = () => {
  const testimonialData = [
    {
      name: "John Smith",
      role: "CTO at Tech Innovations",
      text: "Karen's expertise in frontend development and her ability to lead teams made her invaluable to our projects. Highly recommended!",
      avatar: "👨‍💼",
    },
    {
      name: "Sarah Johnson",
      role: "Product Manager at StartUp Ventures",
      text: "Working with Karen was a game-changer. She delivered high-quality code on time and was a pleasure to collaborate with.",
      avatar: "👩‍💼",
    },
    {
      name: "Mike Wilson",
      role: "Founder at Digital Solutions",
      text: "Karen's problem-solving skills and attention to detail are exceptional. She transformed our entire frontend architecture.",
      avatar: "👨‍💻",
    },
    {
      name: "Emily Chen",
      role: "Senior Developer at Tech Innovations",
      text: "Karen mentored me throughout my learning journey. Her guidance was instrumental in my growth as a developer.",
      avatar: "👩‍💻",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl sm:text-3xl md:text-4xl">
          <span className="text-purple-500 dark:text-purple-300">
            {" "}
            🗣️ What People Say
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonialData.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-purple-500/20"
            >
              <div className="flex items-start gap-3 md:gap-4 mb-4">
                <div className="text-3xl md:text-4xl flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-purple-400 text-xs sm:text-sm break-words">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonials;
