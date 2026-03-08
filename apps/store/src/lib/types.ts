export type Product = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  price: number;
  currency: string;
  sizeMl: number;
  concentration: string;
  image: {
    url: string;
    alt: string;
  };
  images?: { url: string }[];
  intensity?: number;
  variants?: {
    optionName: string;
    values: { label: string; price: number }[];
  }[];
  isActive: boolean;
  likesCount?: number;
  likedByIps?: string[];
  averageRating?: number;
  totalReviews?: number;
};
