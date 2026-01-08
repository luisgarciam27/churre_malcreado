
export interface Category {
  id: number | string;
  name: string;
}

export interface ItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  note?: string;
  isPopular?: boolean;
  tags?: string[];
  variants?: ItemVariant[]; 
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedVariant?: ItemVariant; 
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
  paymentQr?: string;      // URL del QR de Yape/Plin
  paymentName?: string;    // Nombre del titular de la cuenta
}
