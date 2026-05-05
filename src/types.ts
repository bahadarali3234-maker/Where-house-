export type Category = 'Entertainment & Games' | 'Utility & Web Tools' | 'Lab & Experiments';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  techStack: string[];
  link: string;
  imageUrl?: string;
  isFeatured?: boolean;
  size?: 'small' | 'medium' | 'large'; // for bento grid distribution
}
