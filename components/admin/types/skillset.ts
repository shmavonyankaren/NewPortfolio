export interface Skill {
  translations?: { de?: Record<string, string> };
  name: string;
}

export interface Skillset {
  translations?: { de?: Record<string, string> };
  order?: number;
  image: string;
  _id?: string;
  title: string;
  skills: Skill[];
}
