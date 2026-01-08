
export interface Category {
  id: number | string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Guardamos el nombre de la categoría
  image: string;
  note?: string;
  isPopular?: boolean;
  tags?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface AppImagesConfig {
  logo: string;
  menuLogo: string;
  selectorLogo: string;
  aiAvatar: string;
  slideBackgrounds: string[];
  menuBackground: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface AppConfig {
  images: AppImagesConfig;
  menu: MenuItem[];
  whatsappNumber: string;
  socialMedia: SocialMedia;
}
