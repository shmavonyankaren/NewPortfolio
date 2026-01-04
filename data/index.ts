import {
  CompanyItem,
  GridItem,
  NavItem,
  ProjectItem,
  QuoteItem,
  SocialMediaItem,
  WorkExperienceAndEducation,
} from "@/lib/types";

export const navItems: NavItem[] = [
  { name: "Home", link: "/" },
  { name: "Projects", link: "/projects" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
  { name: "Blog", link: "/posts" },
];

export const gridItems: GridItem[] = [
  {
    id: 1,
    title: "I prefer quality over quantity, always delivering my best work.",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/assets/images/image6.png",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className:
      "bg-purple-300 text-center  lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: " lg:col-span-2  md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "w-full h-full object-cover object-top",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently building personal ecosystem of projects.",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: "Events-Next.js Event Management App",
    shortDescription:
      "Comprehensive functionality for creating, reading, updating, and deleting events, giving users full control over event management.",
    description:
      "Comprehensive functionality for creating, reading, updating, and deleting events, giving users full control over event management.",
    image: "/assets/images/Events.png",
    technologies: [
      { name: "Next.js", icon: "/next.svg" },
      { name: "Tailwind CSS", icon: "/tail.svg" },
      { name: "TypeScript", icon: "/ts.svg" },
      { name: "Firebase", icon: "/fm.svg" },
      { name: "Clerk", icon: "/c.svg" },
    ],
    demoUrl: "https://eventsweb.vercel.app/",
    githubUrl: "https://github.com/shmavonyankaren/events.git",
    teamType: "solo",
    status: "Live & Maintained",
    duration: "",
    features: [],
    challenges: [],
  },
  {
    id: 2,
    title: "BlogSpace-Next.js TypeScript App",
    shortDescription:
      "A full-stack blog application built entirely with Next.js and TypeScript.",
    description:
      "A full-stack blog application built entirely with Next.js. and TypeScript. It supports user authentication, blog creation, comments, likes, and favorites, all within a clean and responsive interface.",
    image: "/assets/images/BlogSpace.png",
    technologies: [
      { name: "Next.js", icon: "/next.svg" },
      { name: "Tailwind CSS", icon: "/tail.svg" },
      { name: "TypeScript", icon: "/ts.svg" },
      { name: "Stream", icon: "/stream.svg" },
      { name: "Clerk", icon: "/c.svg" },
    ],
    demoUrl: "https://blogspace-application.vercel.app/",
    githubUrl: "https://github.com/shmavonyankaren/Blog-Application",
    teamType: "solo",
    status: "Live & Maintained",
    duration: "",
    features: [],
    challenges: [],
  },
  {
    id: 3,
    title: "YouTube Clone application",
    shortDescription:
      "A YouTube clone application that mimics the core functionalities of YouTube.",
    description:
      "A YouTube clone application that mimics the core functionalities of YouTube, including video browsing, searching, and playback, providing users with a familiar video streaming experience.",
    image: "/assets/images/YoutubeClone.png",
    technologies: [
      { name: "React", icon: "/re.svg" },
      { name: "Tailwind CSS", icon: "/tail.svg" },
      { name: "TypeScript", icon: "/ts.svg" },
      { name: "Three.js", icon: "/three.svg" },
      { name: "Clerk", icon: "/c.svg" },
    ],
    demoUrl: "https://my-youtube-karen.netlify.app/",
    githubUrl: "https://github.com/shmavonyankaren/youtube-clone.git",
    teamType: "solo",
    status: "Live & Maintained",
    duration: "",
    features: [],
    challenges: [],
  },
  {
    id: 4,
    title: "Scieone-Ecommerce Website",
    shortDescription: "An eCommerce website built with React and TypeScript.",
    description:
      "An eCommerce website built with React and TypeScript, featuring a sleek design and seamless user experience. It includes product listings, a shopping cart, and secure checkout functionality.",
    image: "/assets/images/Scieone.png",
    technologies: [
      { name: "Next.js", icon: "/next.svg" },
      { name: "Tailwind CSS", icon: "/tail.svg" },
      { name: "TypeScript", icon: "/ts.svg" },
      { name: "Three.js", icon: "/three.svg" },
      { name: "GSAP", icon: "/gsap.svg" },
    ],
    demoUrl: "https://ecommerce-sanity-stripe-ofkz.vercel.app/",
    githubUrl: "https://github.com/shmavonyankaren/ecommerce_app.git",
    teamType: "solo",
    status: "Live & Maintained",
    duration: "",
    features: [],
    challenges: [],
  },
];

export const testimonials: QuoteItem[] = [
  {
    quote:
      "I think that great programming is not all that dissimilar to great art. Once you start thinking in concepts of programming it makes you a better person…as does learning a foreign language, as does learning math, as does learning how to read.",
    name: "Jack Dorsey",
    title: "Creator, Twitter and Founder & CEO, Square",
    img: "/assets/images/insight1.png",
  },
  {
    quote:
      "Learning to write programs stretches your mind, and helps you think better, creates a way of thinking about things that I think is helpful in all domains",
    name: "Bill Gates",
    title:
      "Co-Chairman, Bill & Melinda Gates Foundation and Co-Founder, Microsoft",
    img: "/assets/images/insight2.png",
  },
  {
    quote:
      "I believe technology should give us superpowers. Everyone should have the opportunity to learn to think, analyze, and create with technology. It’s a new literacy. It’s a new superpower.",
    name: "Hilary Mason",
    title:
      "Founder, Fast Forward Labs and Data Scientist in Residence, Accel Partners",
    img: "/assets/images/insight3.png",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
    img: "",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
    img: "",
  },
];

export const companies: CompanyItem[] = [
  {
    id: 1,
    className:
      "brightness-0  dark:invert dark:sepia dark:saturate-[3] dark:hue-rotate-240",
    name: "cloudinary",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience: WorkExperienceAndEducation[] = [
  {
    id: 1,
    title: "Frontend Engineer Intern",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    duration: "June 2022 - Aug 2022",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Mobile App Dev - JSM Tech",
    desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
    duration: "Sep 2022 - Dec 2022",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Freelance App Dev Project",
    desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
    duration: "Jan 2023 - May 2023",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Lead Frontend Developer",
    desc: "Developed and maintained user-facing features using modern frontend technologies.",
    duration: "June 2023 - Present",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia: SocialMediaItem[] = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/shmavonyankaren/",
  },
  {
    id: 2,
    img: "/assets/icons/x_icon.svg",
    link: "https://x.com/Karen1162461865",
  },
  {
    id: 3,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/shmavonyan-karen/",
  },
];

export const expCards = [
  {
    review:
      "Adrian brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/exp1.svg",
    logoPath: "/assets/images/logo1.png",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review:
      "Adrian’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/exp2.svg",
    logoPath: "/assets/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2020 - December 2023",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review:
      "Adrian’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/exp4.svg",
    logoPath: "/assets/images/logo3.png",
    title: "React Native Developer",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

export const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];
