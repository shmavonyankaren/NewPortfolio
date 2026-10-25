export interface Comment {
  translations?: { de?: Record<string, string> };
  order?: number;
  _id?: string;
  name: string;
  position: string;
  comment: string;
  image?: string;
}
