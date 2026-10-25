export interface BlogPost {
  translations?: { de?: Record<string, string> };
  order?: number;
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
