export type ProjectItem = {
  id?: number;
  _id?: string;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  gitHubLink: string;
};

export type GridItem = {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName?: string;
  titleClassName?: string;
  img: string;
  spareImg?: string;
};

export type NavItem = {
  name: string;
  link: string;
};

export type QuoteItem = {
  quote: string;
  name: string;
  title: string;
  img: string;
};

export type CompanyItem = {
  id: number;
  name: string;
  img: string;
  nameImg: string;
  className?: string;
};

export type WorkExperienceAndEducation = {
  id: number;
  title: string;
  desc: string;
  duration: string;
  className: string; // change to md:col-span-2
  thumbnail: string;
};

export type SocialMediaItem = {
  id: number;
  img: string;
  link: string;
};

//   id: 1,
//     title: "I prefer quality over quantity, always delivering my best work.",
//     description: "",
//     className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
//     imgClassName: "w-full h-full",
//     titleClassName: "justify-end",
//     img: "/assets/images/image6.png",
//     spareImg: "",

// title: "Event Management App",
// des: "Comprehensive functionality for creating, reading, updating, and deleting events, giving users full control over event management.  ",
// img: "/p1.svg",
// iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/fm.svg", "/c.svg"],
// link: "https://eventsweb.vercel.app/",
// githubLink: "",
