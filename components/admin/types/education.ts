export interface Skill {
  name: string;
  image?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree?: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  logo?: string;
  isCurrentlyStudying: boolean;
  skills: Skill[];
}
