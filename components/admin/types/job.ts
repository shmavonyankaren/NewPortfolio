export interface Skill {
  translations?: { de?: Record<string, string> };
  name: string;
  image?: string;
}

export interface Responsibility {
  translations?: { de?: Record<string, string> };
  name: string;
}

export interface Job {
  translations?: { de?: Record<string, string> };
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
