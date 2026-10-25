export interface Skill {
  translations?: { de?: Record<string, string> };
  name: string;
  image?: string;
  description?: string;
}

export interface Education {
  translations?: { de?: Record<string, string> };
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
  outcomeItems?: Array<{ _id: string; name: string; translations?: { de?: Record<string, string> } }>;
}
