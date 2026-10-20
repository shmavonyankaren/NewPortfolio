export interface Skill {
  name: string;
}

export interface Skillset {
  order?: number;
  image: string;
  _id?: string;
  title: string;
  skills: Skill[];
}
