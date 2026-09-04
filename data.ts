import { Category, MenuItem } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'sanguches',
    name: 'Sánguches',
    subtitle: '9 con calle • Ver →',
    emoji: '🥪',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800'
  },
  {
    id: 'chifles',
    name: 'Chifles Piuranos',
    subtitle: '3 opciones • Ver →',
    emoji: '🍌',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=800'
  },
  {
    id: 'bebidas',
    name: 'Jugos & Bebidas',
    subtitle: '7 refrescantes • Ver →',
    emoji: '🥤',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800'
  }
];

export const SAUCE_OPTIONS: string[] = [
  'Salsa Chimichurri Especial 🌿',
  'Mayonesa al Ajo 🧄',
  'Sarsa Criolla Norteña 🧅',
  'Crema de Ají Piurano 🌶️',
  'Mostaza y Kétchup 🍅'
];

export const MENU_ITEMS: MenuItem[] = [
  // ================= SANGUCHES =================
  {
    id: 'sg-churre-malcriado',
    name: 'Churre Malcriado',
    description: 'Jugoso seco de res + queso + tocino ahumado + salsa chimichurri especial.',
    price: 19,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800',
    badge: 'La Especialidad de la Casa 🔥',
    isPopular: true,
    isPromo: false,
    tags: ['seco de res', 'tocino', 'chimichurri', 'top'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-churre-educado',
    name: 'Churre Educado',
    description: 'Suave seco de res + queso + chorizo de finas hierbas + chimichurri especial.',
    price: 23,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=800',
    badge: 'El Más Contundente 👑',
    isPopular: true,
    isPromo: false,
    tags: ['seco de res', 'chorizo', 'contundente'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-tonderito',
    name: 'Tonderito',
    description: 'Delicioso pollo acompañado de cebolla caramelizada con algarrobina con toques de BBQ, queso, champiñones y mayonesa al ajo.',
    price: 23,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800',
    badge: 'Con Algarrobina Piurana ✨',
    isPopular: true,
    isPromo: false,
    tags: ['pollo', 'algarrobina', 'bbq', 'champiñones'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-lomo-a-lo-pobre',
    name: 'Lomo a lo Pobre',
    description: 'Jugoso lomo a lo pobre acompañado de plátanos de freír y huevito.',
    price: 19,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
    badge: 'Clásico Criollo 🍳',
    isPopular: true,
    isPromo: false,
    tags: ['lomo', 'plátano', 'huevo', 'criollo'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-pavo-al-horno',
    name: 'Pavo al Horno',
    description: 'Delicioso pavo al horno + sarsa criolla.',
    price: 17,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
    badge: 'Receta Tradicional 🦃',
    isPopular: false,
    isPromo: false,
    tags: ['pavo', 'horno', 'sarsa criolla'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-mal-mandao',
    name: 'Mal Mandao',
    description: 'Exquisito seco de res + mayonesa al ajo + sarsa criollita.',
    price: 15,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=800',
    badge: 'Puro Sabor Norteño 🥩',
    isPopular: true,
    isPromo: false,
    tags: ['seco de res', 'mayonesa al ajo', 'norteño'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-lechon-al-horno',
    name: 'Lechón al Horno',
    description: 'Jugoso lechón al horno + sarsa criolla.',
    price: 15,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800',
    badge: 'Crocante y Jugoso 🐖',
    isPopular: false,
    isPromo: false,
    tags: ['lechón', 'horno', 'sarsa criolla'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-pan-con-chicharron',
    name: 'Pan con Chicharrón',
    description: 'Crocante chicharrón de chanchito + camotes fritos + sarsa criolla.',
    price: 15,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800',
    badge: 'Favorito del Desayuno ⭐',
    isPopular: true,
    isPromo: false,
    tags: ['chicharrón', 'camote', 'sarsa criolla'],
    availableSauces: SAUCE_OPTIONS
  },
  {
    id: 'sg-choripan',
    name: 'Choripán',
    description: 'Jugoso chorizo de finas hierbas + mayonesa al ajo + chimichurri especial.',
    price: 12,
    category: 'Sánguches',
    image: 'https://images.unsplash.com/photo-1629814249584-bd4d53cb0ee0?q=80&w=800',
    badge: 'Al Paso con Sabor 🌭',
    isPopular: false,
    isPromo: false,
    tags: ['chorizo', 'chimichurri', 'al paso'],
    availableSauces: SAUCE_OPTIONS
  },

  // ================= CHIFLES =================
  {
    id: 'ch-chifles-carne-seca',
    name: 'Chifles con Carne Seca',
    description: 'Crocantes chifles norteños servidos con auténtica carne seca piurana.',
    price: 20,
    category: 'Chifles Piuranos',
    image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800',
    badge: 'Especialidad Piurana 🇵🇪',
    isPopular: true,
    isPromo: false,
    tags: ['chifles', 'carne seca', 'piura']
  },
  {
    id: 'ch-chifles-bolsa-grande',
    name: 'Chifles en Bolsa Grande',
    description: 'Generosa bolsa grande de crocantes chifles piuranos artesanales.',
    price: 20,
    category: 'Chifles Piuranos',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=800',
    badge: 'Bolsa Familiar 🍌',
    isPopular: false,
    isPromo: false,
    tags: ['chifles', 'bolsa grande', 'snack']
  },
  {
    id: 'ch-chifles-bandeja',
    name: 'Chifles en Bandeja',
    description: 'Porción de chifles piuranos crocantes servidos en bandeja.',
    price: 10,
    category: 'Chifles Piuranos',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=800',
    badge: 'Porción Personal 🍟',
    isPopular: true,
    isPromo: false,
    tags: ['chifles', 'bandeja', 'porción']
  },

  // ================= JUGOS & BEBIDAS =================
  {
    id: 'jb-maracumango',
    name: 'Maracumango',
    description: 'Jugo refrescante de maracuyá ácido combinado con pulpa de dulce mango piurano.',
    price: 10,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=800',
    badge: 'Favorito Frutal 🥭',
    isPopular: true,
    isPromo: false,
    tags: ['maracuyá', 'mango', 'jugo natural']
  },
  {
    id: 'jb-fresa-con-leche',
    name: 'Fresa con Leche',
    description: 'Batido cremoso de fresas frescas seleccionadas con leche.',
    price: 10,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800',
    badge: 'Cremoso y Dulce 🍓',
    isPopular: true,
    isPromo: false,
    tags: ['fresa', 'leche', 'batido']
  },
  {
    id: 'jb-pina',
    name: 'Piña',
    description: 'Jugo natural de piña golden fresca recién preparada.',
    price: 7,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=800',
    badge: '100% Fruta 🍍',
    isPopular: false,
    isPromo: false,
    tags: ['piña', 'natural', 'saludable']
  },
  {
    id: 'jb-papaya',
    name: 'Papaya',
    description: 'Jugo clásico y saludable de papaya fresca de estación.',
    price: 7,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800',
    badge: 'Clásico Saludable 🥤',
    isPopular: false,
    isPromo: false,
    tags: ['papaya', 'natural']
  },
  {
    id: 'jb-surtido',
    name: 'Surtido',
    description: 'Jugo surtido tradicional con deliciosa mezcla de frutas de estación.',
    price: 7,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800',
    badge: 'Surtido Tradicional 🍹',
    isPopular: false,
    isPromo: false,
    tags: ['surtido', 'frutas']
  },
  {
    id: 'jb-chicha-morada',
    name: 'Chicha Morada',
    description: 'Chicha morada casera de maíz morado hervido con piña, membrillo, manzana, canela y limón.',
    price: 5,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    badge: 'Receta Casera 🍇',
    isPopular: true,
    isPromo: false,
    tags: ['chicha morada', 'casera', 'refresco']
  },
  {
    id: 'jb-cafe',
    name: 'Café Pasado',
    description: 'Café pasado recién elaborado, caliente, aromático y de puro grano.',
    price: 7,
    category: 'Jugos & Bebidas',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800',
    badge: 'Café Calientito ☕',
    isPopular: false,
    isPromo: false,
    tags: ['café', 'caliente', 'pasa gota a gota']
  }
];
