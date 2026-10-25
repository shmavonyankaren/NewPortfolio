import { pageMetadata } from "@/lib/seo";
import { publicContent } from "@/lib/content/public";
export const revalidate = 60;

import React from "react";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { QuickActions } from "@/components/contact/QuickActions";
import { ContactForm } from "@/components/contact/ContactForm";

async function fetchContactInfo() {
  try {
    const content = await publicContent("contacts", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return null;
    const contacts = await res.json();
    return contacts[0] || null; // Get the first contact
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return null;
  }
}

async function ContactPage() {
  const contactInfo = await fetchContactInfo();

  const EMAIL = contactInfo?.email || "2003.karen.shmavonyan@gmail.com";
  const PHONE = contactInfo?.phone || "+37495726678";
  const CV_LINK =
    contactInfo?.cvUrl || "/assets/resume/Karen_Shmavonyan_Resume.pdf";

  return (
    <main className="pt-8 min-h-screen bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5 scroll-smooth">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 md:py-24">
        <div className="flex flex-col gap-10 sm:gap-12">
          <ContactHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickActions email={EMAIL} phone={PHONE} cvLink={CV_LINK} location={contactInfo?.location} />
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) { return pageMetadata((await params).locale, "contact"); }
