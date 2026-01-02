export interface Skill {
  name: string;
}

export interface Skillset {
  _id?: string;
  title: string;
  skills: Skill[];
}
