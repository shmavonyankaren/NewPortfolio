import React from "react";

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 pb-10 bg-[#000319]">
      <div className="w-full h-full md:px-20 px-5">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Me</h1>
        <p className="text-lg text-gray-300 mb-6">
          I&apos;m currently open to new opportunities and collaborations. Feel
          free to reach out to me via the following methods:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          <li>
            Email:
            <a
              href="mailto:2003.karen.shmavonyan@gmail.com"
              className="text-purple-400 hover:underline ml-2"
            >
              Email Me
            </a>
          </li>
          <li>
            Phone:
            <a
              href="tel: +(374)-95-72-66-78"
              className="text-purple-400 hover:underline ml-2"
            >
              Call Me
            </a>
          </li>
        </ul>
        <p className="text-lg text-gray-300">
          I look forward to connecting with you!
        </p>
      </div>
    </div>
  );
}

export default ContactPage;
