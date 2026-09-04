export interface Category {
  id: string;
  name: string;
  subtitle?: string;
  emoji?: string;
  image?: string;
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
  originalPrice?: number;
  category: string;
  image: string;
  note?: string;
  badge?: string;
  isPopular?: boolean;
  isCombo?: boolean;
  isPromo?: boolean;
  comboItems?: string[];
  tags?: string[];
  variants?: ItemVariant[];
  availableSauces?: string[];
}

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  selectedVariant?: ItemVariant;
  selectedSauces?: string[];
  specialInstructions?: string;
}
