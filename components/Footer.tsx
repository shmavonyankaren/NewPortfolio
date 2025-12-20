import { FaPhone, FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          width={1920}
          height={1080}
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take{" "}
          <span className="text-purple-500 dark:text-purple-300">your</span>{" "}
          digital presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <div className="flex md:gap-6 gap-4 mt-6">
          <a href="mailto:2003.karen.shmavonyan@gmail.com">
            <MagicButton
              title="Let's get in touch"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
          <a href="tel: +(374)-95-72-66-78" className="p-text">
            <MagicButton title="Call Me" icon={<FaPhone />} position="right" />
          </a>
        </div>
      </div>
      <div className="flex mt-16 mb-8 md:mb-0  md:flex-row md:gap-100  gap-8 flex-col-reverse  justify-around items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          ©{" "}
          <time
            suppressHydrationWarning
            dateTime={new Date().getFullYear().toLocaleString()}
          >
            {new Date().getFullYear()}
          </time>{" "}
          Karen Shmavonyan. All rights reserved.
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              href={info.link}
              target="_blank"
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-gradient-to-r from-[#161a31] to-[#06091f] rounded-lg border border-black/[0.1] hover:border-white/[0.2] transition-all"
            >
              <Image width={20} height={20} src={info.img} alt="icons" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
