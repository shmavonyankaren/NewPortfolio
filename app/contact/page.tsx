import React from "react";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { QuickActions } from "@/components/contact/QuickActions";
import { ContactForm } from "@/components/contact/ContactForm";

const EMAIL = "2003.karen.shmavonyan@gmail.com";
const PHONE = "+37495726678";
const CV_LINK = "/assets/resume/Karen_Shmavonyan_Resume.pdf";

function ContactPage() {
  return (
    <main className="pt-8 min-h-screen bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5 scroll-smooth">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 md:py-24">
        <div className="flex flex-col gap-10 sm:gap-12">
          <ContactHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickActions email={EMAIL} phone={PHONE} cvLink={CV_LINK} />
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
