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
    className: "text-center  lg:col-span-2 md:col-span-3 md:row-span-2",
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
    des: "Comprehensive functionality for creating, reading, updating, and deleting events, giving users full control over event management.  ",
    img: "/assets/images/Events.png",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/fm.svg", "/c.svg"],
    link: "https://eventsweb.vercel.app/",
    gitHubLink: "https://github.com/shmavonyankaren/events.git",
  },
  {
    id: 2,
    title: "BlogSpace-Next.js TypeScript App",
    des: "A full-stack blog application built entirely with Next.js. and TypeScript. It supports user authentication, blog creation, comments, likes, and favorites, all within a clean and responsive interface.",
    img: "/assets/images/BlogSpace.png",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "https://blogspace-application.vercel.app/",
    gitHubLink: "https://github.com/shmavonyankaren/Blog-Application",
  },
  {
    id: 3,
    title: "YouTube Clone application",
    des: "A YouTube clone application that mimics the core functionalities of YouTube, including video browsing, searching, and playback, providing users with a familiar video streaming experience.",
    img: "/assets/images/YouTubeClone.png",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "https://my-youtube-karen.netlify.app/",
    gitHubLink: "https://github.com/shmavonyankaren/youtube-clone.git",
  },
  {
    id: 4,
    title: "Scieone-Ecommerce Website",
    des: "An eCommerce website built with React and TypeScript, featuring a sleek design and seamless user experience. It includes product listings, a shopping cart, and secure checkout functionality.",
    img: "/assets/images/Scieone.png",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "https://ecommerce-sanity-stripe-ofkz.vercel.app/",
    gitHubLink: "https://github.com/shmavonyankaren/ecommerce_app.git",
  },
];

export const testimonials: QuoteItem[] = [
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
