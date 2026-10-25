export interface Insight {
  translations?: { de?: Record<string, string> };
  order?: number;
  _id?: string;
  name: string;
  position: string;
  insight: string;
  image?: string;
}
