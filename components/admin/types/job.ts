export interface Skill {
  name: string;
  image?: string;
}

export interface Responsibility {
  name: string;
}

export interface Job {
  order?: number;
  _id?: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  skills: Skill[];
  responsibilities: Responsibility[];
  logo: string;
}
