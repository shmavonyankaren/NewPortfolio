export interface Skill {
  name: string;
  image?: string;
  description?: string;
}

export interface Education {
  order?: number;
  _id?: string;
  institution: string;
  degree?: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  logo: string;
  isCurrentlyStudying: boolean;
  skills: Skill[];
  learningOutcomes?: string[];
}
