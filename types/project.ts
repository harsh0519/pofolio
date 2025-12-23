export interface Project {
  _id: string;
  title: string;
  categories: ('Frontend & Animation' | 'Full Stack' | 'Company')[];
  image: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  order: number;
}
