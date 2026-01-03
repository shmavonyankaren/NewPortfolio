import React from "react";
import Image from "next/image";
import { Comment } from "../admin/types/comment";

interface AboutTestimonialsProps {
  comments?: Comment[];
}

const AboutTestimonials = ({ comments }: AboutTestimonialsProps) => {
  const testimonialData =
    comments &&
    comments.map((comment) => ({
      name: comment.name,
      role: comment.position,
      text: comment.comment,
      avatar: "👤",
      image: comment.image || "",
    }));

  if (!testimonialData || testimonialData.length === 0) {
    return null;
  }
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
                {testimonial.image && testimonial.image.trim() !== "" ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-3xl md:text-4xl shrink-0">
                    {testimonial.avatar}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base wrap-break-words">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-purple-400 text-xs sm:text-sm wrap-break-words">
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
