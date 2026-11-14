import { AccessoryProduct, BrandMeta, Laptop, OrderableProduct, PriceCategoryMeta, SpecialCollectionKey } from '../types/laptop';
import heroFloatingLaptopsImg from '../assets/images/hero_floating_laptops_1794549712380.jpg';
import hpElitebookImg from '../assets/images/hp_elitebook_silver_1794549712408.jpg';
import hpProbookImg from '../assets/images/hp_probook_grey_1794549712881.jpg';
import dellXpsImg from '../assets/images/dell_xps_platinum_1794549713358.jpg';
import dellLatitudeImg from '../assets/images/dell_latitude_carbon_1794549713812.jpg';
import lenovoThinkpadImg from '../assets/images/lenovo_thinkpad_black_1794549714539.jpg';
import lenovoIdeapadImg from '../assets/images/lenovo_ideapad_arctic_1794549713717.jpg';
import macbookProImg from '../assets/images/macbook_pro_spaceblack_1794549714364.jpg';
import macbookAirImg from '../assets/images/macbook_air_midnight_1794549714669.jpg';
import asusRogImg from '../assets/images/asus_rog_gaming_1794549715754.jpg';
import asusVivobookImg from '../assets/images/asus_vivobook_silver_1794549716165.jpg';
import acerNitroImg from '../assets/images/acer_nitro_gaming_1794549715801.jpg';
import acerAspireImg from '../assets/images/acer_aspire_steel_1794549717049.jpg';
import msiStealthImg from '../assets/images/msi_gaming_stealth_1794549716153.jpg';
import surfaceLaptopImg from '../assets/images/microsoft_surface_laptop_1794549716666.jpg';
import samsungGalaxyBookImg from '../assets/images/samsung_galaxy_book_1794549717769.jpg';
import toshibaDynabookImg from '../assets/images/toshiba_dynabook_clean_1794549736060.jpg';

export const STORE_INFO = {
  name: 'FS SHOP',
  tagline: 'Your World of Technology',
  owner: 'Fiza',
  phoneDisplay: '03086421306',
  phoneHref: 'tel:03086421306',
  whatsappUrl: 'https://wa.me/923086421306',
  location: 'Pakistan',
};

export const HERO_IMAGE = heroFloatingLaptopsImg;

export const IMAGES = {
  hpElitebook: hpElitebookImg,
  hpProbook: hpProbookImg,
  dellXps: dellXpsImg,
  dellLatitude: dellLatitudeImg,
  lenovoThinkpad: lenovoThinkpadImg,
  lenovoIdeapad: lenovoIdeapadImg,
  macbookPro: macbookProImg,
  macbookAir: macbookAirImg,
  asusRog: asusRogImg,
  asusVivobook: asusVivobookImg,
  acerNitro: acerNitroImg,
  acerAspire: acerAspireImg,
  msiStealth: msiStealthImg,
  surfaceLaptop: surfaceLaptopImg,
  samsungGalaxyBook: samsungGalaxyBookImg,
  toshibaDynabook: toshibaDynabookImg,
};

export const BRANDS: BrandMeta[] = [
  {
    name: 'HP',
    tagline: 'EliteBook & ProBook Enterprise Workstations',
    featuredImage: IMAGES.hpElitebook,
    origin: 'USA',
  },
  {
    name: 'Dell',
    tagline: 'Precision XPS & Latitude Business Systems',
    featuredImage: IMAGES.dellXps,
    origin: 'USA',
  },
  {
    name: 'Lenovo',
    tagline: 'Legendary ThinkPad & Everyday IdeaPad',
    featuredImage: IMAGES.lenovoThinkpad,
    origin: 'Global',
  },
  {
    name: 'Apple MacBook',
    tagline: 'Apple Silicon MacBook Air & MacBook Pro',
    featuredImage: IMAGES.macbookPro,
    origin: 'California',
  },
  {
    name: 'Asus',
    tagline: 'ROG Gaming Rigs & VivoBook OLED',
    featuredImage: IMAGES.asusRog,
    origin: 'Taiwan',
  },
  {
    name: 'Acer',
    tagline: 'Nitro Gaming & Aspire Performance',
    featuredImage: IMAGES.acerNitro,
    origin: 'Taiwan',
  },
  {
    name: 'MSI',
    tagline: 'Stealth & Raider Enthusiast Gaming',
    featuredImage: IMAGES.msiStealth,
    origin: 'Taiwan',
  },
  {
    name: 'Microsoft Surface',
    tagline: 'Alcantara & Aluminum PixelSense Ultrabooks',
    featuredImage: IMAGES.surfaceLaptop,
    origin: 'USA',
  },
  {
    name: 'Samsung',
    tagline: 'Galaxy Book Dynamic AMOLED 2X Series',
    featuredImage: IMAGES.samsungGalaxyBook,
    origin: 'South Korea',
  },
  {
    name: 'Toshiba',
    tagline: 'Dynabook Reliable Japanese Engineering',
    featuredImage: IMAGES.toshibaDynabook,
    origin: 'Japan',
  },
];

export const PRICE_CATEGORIES: PriceCategoryMeta[] = [
  {
    key: 'budget',
    label: 'Budget Laptops',
    rangeLabel: 'PKR 25,000 – 50,000',
    minPkr: 25000,
    maxPkr: 50000,
    summary: 'Reliable Core i5 corporate-grade machines for students, office work, and daily browsing.',
  },
  {
    key: 'affordable',
    label: 'Affordable Laptops',
    rangeLabel: 'PKR 50,000 – 80,000',
    minPkr: 50000,
    maxPkr: 80000,
    summary: 'Balanced 11th & 12th Gen laptops built for multitasking, coding, and university workloads.',
  },
  {
    key: 'mid-range',
    label: 'Mid-Range Laptops',
    rangeLabel: 'PKR 80,000 – 150,000',
    minPkr: 80000,
    maxPkr: 150000,
    summary: 'Crisp OLED & IPS ultrabooks with fast NVMe storage and modern Intel Iris Xe performance.',
  },
  {
    key: 'premium',
    label: 'Premium Laptops',
    rangeLabel: 'PKR 150,000 – 250,000',
    minPkr: 150000,
    maxPkr: 250000,
    summary: 'CNC aluminum flagships including MacBook Air, Dell XPS, ThinkPad X1 Carbon, and RTX 4050.',
  },
  {
    key: 'high-end',
    label: 'High-End Gaming & Pro',
    rangeLabel: 'PKR 250,000 – 600,000+',
    minPkr: 250000,
    maxPkr: null,
    summary: 'Extreme RTX 4060/4070 gaming rigs and M3 Pro studio workstations for 3D, AI, and 4K editing.',
  },
];

export const SPECIAL_COLLECTIONS: { key: SpecialCollectionKey; label: string }[] = [
  { key: 'all', label: 'All Laptops' },
  { key: 'best-selling', label: 'Best Selling Laptops' },
  { key: 'latest-arrivals', label: 'Latest Arrivals' },
  { key: 'budget-friendly', label: 'Budget Friendly Laptops' },
  { key: 'gaming', label: 'Gaming Laptops' },
  { key: 'business', label: 'Business Laptops' },
  { key: 'student', label: 'Student Laptops' },
  { key: 'premium-macbooks', label: 'Premium MacBooks' },
  { key: 'special-discounts', label: 'Special Discounts' },
];

export const INITIAL_LAPTOPS: Laptop[] = [
  {
    id: 'apple-macbook-pro-14-m3-pro',
    category: 'Laptops',
    brand: 'Apple MacBook',
    model: 'MacBook Pro 14 (M3 Pro)',
    name: 'Apple MacBook Pro 14 M3 Pro Space Black',
    pricePkr: 485000,
    originalPricePkr: 515000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.macbookPro,
    gallery: [IMAGES.macbookPro, IMAGES.macbookAir, HERO_IMAGE],
    description:
      'Engineered with the Apple M3 Pro 11-Core chip, 18GB Unified Memory, and a 14.2-inch Liquid Retina XDR 120Hz ProMotion display. Built for software engineers, 4K ProRes editors, and demanding creative workflows.',
    specs: {
      processor: 'Apple M3 Pro (11-Core CPU)',
      ram: '18GB Unified Memory',
      storage: '512GB NVMe SSD',
      display: '14.2" Liquid Retina XDR 120Hz',
      graphics: 'Apple 14-Core GPU',
      battery: 'Up to 18 Hours',
      weight: '1.61 kg',
      os: 'macOS Sonoma',
    },
    collections: ['best-selling', 'latest-arrivals', 'premium-macbooks', 'special-discounts'],
  },
  {
    id: 'apple-macbook-air-13-m2',
    category: 'Laptops',
    brand: 'Apple MacBook',
    model: 'MacBook Air 13.6 (M2)',
    name: 'Apple MacBook Air 13.6 M2 Midnight',
    pricePkr: 239000,
    originalPricePkr: 258000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.macbookAir,
    gallery: [IMAGES.macbookAir, IMAGES.macbookPro],
    description:
      'Strikingly thin fanless aluminum unibody powered by Apple M2 silicon. Features MagSafe 3 fast charging, 1080p FaceTime HD camera, and silent all-day endurance for executives and university students.',
    specs: {
      processor: 'Apple M2 (8-Core CPU)',
      ram: '8GB Unified Memory',
      storage: '256GB NVMe SSD',
      display: '13.6" Liquid Retina IPS',
      graphics: 'Apple 8-Core GPU',
      battery: 'Up to 18 Hours',
      weight: '1.24 kg',
      os: 'macOS Sonoma',
    },
    collections: ['best-selling', 'premium-macbooks', 'student', 'special-discounts'],
  },
  {
    id: 'asus-rog-strix-g16-rtx4060',
    category: 'Laptops',
    brand: 'Asus',
    model: 'ROG Strix G16 (G614)',
    name: 'Asus ROG Strix G16 Core i7 RTX 4060',
    pricePkr: 345000,
    originalPricePkr: 368000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.asusRog,
    gallery: [IMAGES.asusRog, IMAGES.msiStealth],
    description:
      'High-refresh esports powerhouse equipped with Intel Core i7-13650HX, NVIDIA GeForce RTX 4060 8GB GDDR6 with MUX Switch, and ROG Intelligent Cooling Tri-Fan architecture.',
    specs: {
      processor: 'Intel Core i7-13650HX (14-Core)',
      ram: '16GB DDR5 4800MHz',
      storage: '1TB PCIe 4.0 NVMe SSD',
      display: '16" FHD+ 165Hz 100% sRGB',
      graphics: 'NVIDIA GeForce RTX 4060 8GB',
      battery: '90Wh Fast Charge',
      weight: '2.50 kg',
      os: 'Windows 11 Home',
    },
    collections: ['best-selling', 'latest-arrivals', 'gaming', 'special-discounts'],
  },
  {
    id: 'msi-stealth-16-studio-rtx4070',
    category: 'Laptops',
    brand: 'MSI',
    model: 'Stealth 16 Studio A13V',
    name: 'MSI Stealth 16 Studio Core i9 RTX 4070',
    pricePkr: 415000,
    originalPricePkr: 445000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.msiStealth,
    gallery: [IMAGES.msiStealth, IMAGES.asusRog],
    description:
      'Magnesium-aluminum alloy chassis packing an Intel Core i9-13900H and RTX 4070 8GB Studio GPU under 2kg. Built for competitive gamers, architects, and Unreal Engine creators.',
    specs: {
      processor: 'Intel Core i9-13900H (14-Core)',
      ram: '32GB DDR5 5200MHz',
      storage: '1TB PCIe Gen4 NVMe SSD',
      display: '16" QHD+ 240Hz IPS-Level',
      graphics: 'NVIDIA GeForce RTX 4070 8GB',
      battery: '99.9Wh 4-Cell',
      weight: '1.99 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['latest-arrivals', 'gaming', 'special-discounts'],
  },
  {
    id: 'acer-nitro-v-15-rtx4050',
    category: 'Laptops',
    brand: 'Acer',
    model: 'Nitro V 15 (ANV15-51)',
    name: 'Acer Nitro V 15 Core i5 RTX 4050',
    pricePkr: 198000,
    originalPricePkr: 215000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.acerNitro,
    gallery: [IMAGES.acerNitro, IMAGES.acerAspire],
    description:
      'Best-value ray-tracing gaming laptop in Pakistan. Combines 13th Gen Intel Core i5-13420H with NVIDIA RTX 4050 6GB and a smooth 144Hz FHD IPS panel with dual-fan exhaust.',
    specs: {
      processor: 'Intel Core i5-13420H (8-Core)',
      ram: '16GB DDR5 5200MHz',
      storage: '512GB PCIe Gen4 SSD',
      display: '15.6" FHD 144Hz IPS',
      graphics: 'NVIDIA GeForce RTX 4050 6GB',
      battery: '57Wh 4-Cell',
      weight: '2.11 kg',
      os: 'Windows 11 Home',
    },
    collections: ['best-selling', 'gaming', 'student', 'special-discounts'],
  },
  {
    id: 'dell-xps-13-plus-9320',
    category: 'Laptops',
    brand: 'Dell',
    model: 'XPS 13 Plus 9320',
    name: 'Dell XPS 13 Plus 9320 3.5K OLED',
    pricePkr: 235000,
    originalPricePkr: 252000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.dellXps,
    gallery: [IMAGES.dellXps, IMAGES.dellLatitude],
    description:
      'CNC-machined platinum aluminum flagship featuring a zero-lattice keyboard, invisible haptic glass touchpad, and edge-to-edge 3.5K OLED InfinityEdge touch display.',
    specs: {
      processor: 'Intel Core i7-1360P (12-Core)',
      ram: '16GB LPDDR5 6000MHz',
      storage: '512GB PCIe Gen4 SSD',
      display: '13.4" 3.5K OLED Touch',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 13 Hours',
      weight: '1.26 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['latest-arrivals', 'business', 'special-discounts'],
  },
  {
    id: 'lenovo-thinkpad-x1-carbon-g10',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 10',
    name: 'Lenovo ThinkPad X1 Carbon Gen 10',
    pricePkr: 218000,
    originalPricePkr: 234000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.lenovoThinkpad,
    gallery: [IMAGES.lenovoThinkpad, IMAGES.lenovoIdeapad],
    description:
      'MIL-STD-810H carbon-fiber ultrabook weighing just 1.12 kg. Trusted by software leads and corporate executives for its legendary tactile keyboard and enterprise security.',
    specs: {
      processor: 'Intel Core i7-1260P (12-Core)',
      ram: '16GB LPDDR5 5200MHz',
      storage: '512GB PCIe Gen4 SSD',
      display: '14" WUXGA (1920x1200) IPS',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 15 Hours',
      weight: '1.12 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['best-selling', 'business', 'special-discounts'],
  },
  {
    id: 'samsung-galaxy-book3-pro',
    category: 'Laptops',
    brand: 'Samsung',
    model: 'Galaxy Book3 Pro 14',
    name: 'Samsung Galaxy Book3 Pro AMOLED',
    pricePkr: 215000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.samsungGalaxyBook,
    gallery: [IMAGES.samsungGalaxyBook],
    description:
      'Ultra-slim graphite aluminum laptop sporting a breathtaking 14-inch 3K Dynamic AMOLED 2X 120Hz screen, AKG quad speakers, and Intel Evo certified responsiveness.',
    specs: {
      processor: 'Intel Core i7-1360P (12-Core)',
      ram: '16GB LPDDR5',
      storage: '512GB NVMe SSD',
      display: '14" 3K (2880x1800) AMOLED 120Hz',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 16 Hours',
      weight: '1.17 kg',
      os: 'Windows 11 Home',
    },
    collections: ['latest-arrivals', 'business'],
  },
  {
    id: 'microsoft-surface-laptop-5',
    category: 'Laptops',
    brand: 'Microsoft Surface',
    model: 'Surface Laptop 5 (13.5")',
    name: 'Microsoft Surface Laptop 5 Platinum',
    pricePkr: 168000,
    originalPricePkr: 182000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.surfaceLaptop,
    gallery: [IMAGES.surfaceLaptop],
    description:
      'Precision-crafted anodized aluminum chassis with signature 3:2 PixelSense touchscreen, Thunderbolt 4 connectivity, and Dolby Vision IQ clarity for modern professionals.',
    specs: {
      processor: 'Intel Core i5-1235U (10-Core)',
      ram: '16GB LPDDR5x',
      storage: '512GB Removable NVMe SSD',
      display: '13.5" PixelSense Touch (2256x1504)',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 18 Hours',
      weight: '1.29 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['business', 'student', 'special-discounts'],
  },
  {
    id: 'asus-vivobook-15-oled',
    category: 'Laptops',
    brand: 'Asus',
    model: 'VivoBook 15 OLED (X1505)',
    name: 'Asus VivoBook 15 OLED Core i5 13th Gen',
    pricePkr: 124000,
    originalPricePkr: 135000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.asusVivobook,
    gallery: [IMAGES.asusVivobook],
    description:
      'Color-accurate Pantone Validated FHD OLED display paired with a 13th Gen Intel Core i5 processor, 180-degree lay-flat hinge, and antimicrobial guard.',
    specs: {
      processor: 'Intel Core i5-1335U (10-Core)',
      ram: '16GB DDR4 3200MHz',
      storage: '512GB M.2 NVMe SSD',
      display: '15.6" FHD OLED 600-nit',
      graphics: 'Intel Iris Xe Graphics',
      battery: '50Wh Fast Charge',
      weight: '1.70 kg',
      os: 'Windows 11 Home',
    },
    collections: ['best-selling', 'latest-arrivals', 'student', 'special-discounts'],
  },
  {
    id: 'hp-elitebook-840-g8',
    category: 'Laptops',
    brand: 'HP',
    model: 'EliteBook 840 G8',
    name: 'HP EliteBook 840 G8 Business Ultrabook',
    pricePkr: 92000,
    originalPricePkr: 102000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.hpElitebook,
    gallery: [IMAGES.hpElitebook, IMAGES.hpProbook],
    description:
      'CNC aluminum enterprise notebook with Bang & Olufsen audio, backlit spill-resistant keyboard, dual Thunderbolt 4 ports, and 11th Gen Intel vPro performance.',
    specs: {
      processor: 'Intel Core i5-1145G7 (4-Core / 8-Thread)',
      ram: '16GB DDR4 3200MHz',
      storage: '512GB PCIe NVMe SSD',
      display: '14" FHD IPS Anti-Glare',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 12 Hours',
      weight: '1.32 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['best-selling', 'business', 'special-discounts'],
  },
  {
    id: 'toshiba-dynabook-tecra-a40',
    category: 'Laptops',
    brand: 'Toshiba',
    model: 'Dynabook Tecra A40-J',
    name: 'Toshiba Dynabook Tecra A40-J Dark Navy',
    pricePkr: 89000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.toshibaDynabook,
    gallery: [IMAGES.toshibaDynabook],
    description:
      'Japanese-engineered business reliability featuring a Mystic Blue chassis, dual Thunderbolt 4 ports, full-size RJ-45 Ethernet, and MIL-STD-810H durability.',
    specs: {
      processor: 'Intel Core i5-1135G7 (Quad-Core)',
      ram: '16GB DDR4 3200MHz',
      storage: '512GB PCIe NVMe SSD',
      display: '14" FHD Anti-Glare IPS',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 10.5 Hours',
      weight: '1.45 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['business', 'student'],
  },
  {
    id: 'hp-probook-450-g9',
    category: 'Laptops',
    brand: 'HP',
    model: 'ProBook 450 G9',
    name: 'HP ProBook 450 G9 12th Gen',
    pricePkr: 76500,
    originalPricePkr: 84000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.hpProbook,
    gallery: [IMAGES.hpProbook, IMAGES.hpElitebook],
    description:
      '15.6-inch full numeric keypad business notebook powered by 12th Gen Intel Core i5-1235U, engineered for accounting, software development, and corporate offices.',
    specs: {
      processor: 'Intel Core i5-1235U (10-Core)',
      ram: '8GB DDR4 (Upgradable to 32GB)',
      storage: '256GB PCIe NVMe SSD',
      display: '15.6" FHD Anti-Glare',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 10 Hours',
      weight: '1.74 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['business', 'student', 'special-discounts'],
  },
  {
    id: 'acer-aspire-5-a515',
    category: 'Laptops',
    brand: 'Acer',
    model: 'Aspire 5 A515-57',
    name: 'Acer Aspire 5 12th Gen Steel Gray',
    pricePkr: 74000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.acerAspire,
    gallery: [IMAGES.acerAspire, IMAGES.acerNitro],
    description:
      'Crisp 15.6-inch Full HD IPS screen, elevated ergonomic hinge, and fast 512GB NVMe SSD storage tailored for university assignments, freelancing, and home offices.',
    specs: {
      processor: 'Intel Core i3-1215U (6-Core)',
      ram: '8GB DDR4 3200MHz',
      storage: '512GB PCIe NVMe SSD',
      display: '15.6" FHD IPS SlimBezel',
      graphics: 'Intel UHD Graphics',
      battery: 'Up to 8.5 Hours',
      weight: '1.76 kg',
      os: 'Windows 11 Home',
    },
    collections: ['student'],
  },
  {
    id: 'lenovo-ideapad-slim-3',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'IdeaPad Slim 3 (15AMN8)',
    name: 'Lenovo IdeaPad Slim 3 Ryzen 5',
    pricePkr: 69500,
    originalPricePkr: 76000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.lenovoIdeapad,
    gallery: [IMAGES.lenovoIdeapad, IMAGES.lenovoThinkpad],
    description:
      'Lightweight Arctic Grey laptop driven by AMD Ryzen 5 7520U with LPDDR5 memory and Rapid Charge Boost—giving 2 hours of runtime in a 15-minute charge.',
    specs: {
      processor: 'AMD Ryzen 5 7520U (Quad-Core)',
      ram: '8GB LPDDR5 5500MHz',
      storage: '512GB PCIe NVMe SSD',
      display: '15.6" FHD Anti-Glare',
      graphics: 'AMD Radeon 610M',
      battery: 'Up to 11 Hours',
      weight: '1.62 kg',
      os: 'Windows 11 Home',
    },
    collections: ['best-selling', 'student', 'special-discounts'],
  },
  {
    id: 'dell-latitude-5420',
    category: 'Laptops',
    brand: 'Dell',
    model: 'Latitude 5420',
    name: 'Dell Latitude 5420 11th Gen 16GB',
    pricePkr: 68000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.dellLatitude,
    gallery: [IMAGES.dellLatitude, IMAGES.dellXps],
    description:
      'Dependable 14-inch business laptop with 16GB RAM out of the box, dual Thunderbolt 4 USB-C ports, and ExpressCharge capability.',
    specs: {
      processor: 'Intel Core i5-1135G7 (Quad-Core)',
      ram: '16GB DDR4 3200MHz',
      storage: '256GB NVMe SSD',
      display: '14" FHD IPS Anti-Glare',
      graphics: 'Intel Iris Xe Graphics',
      battery: 'Up to 10 Hours',
      weight: '1.37 kg',
      os: 'Windows 11 Pro',
    },
    collections: ['business', 'student'],
  },
  {
    id: 'lenovo-thinkpad-t480',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'ThinkPad T480',
    name: 'Lenovo ThinkPad T480 Corporate Edition',
    pricePkr: 46000,
    originalPricePkr: 52000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.lenovoThinkpad,
    gallery: [IMAGES.lenovoThinkpad],
    description:
      'Pakistan’s most trusted budget coding & office machine. Quad-core Intel Core i5-8250U, dual-battery Power Bridge design, and upgradable RAM/SSD slots.',
    specs: {
      processor: 'Intel Core i5-8250U (8th Gen Quad-Core)',
      ram: '8GB DDR4 (2 Expandable Slots)',
      storage: '256GB NVMe SSD',
      display: '14" FHD IPS',
      graphics: 'Intel UHD Graphics 620',
      battery: 'Dual Battery System',
      weight: '1.65 kg',
      os: 'Windows 11 Pro Ready',
    },
    collections: ['best-selling', 'budget-friendly', 'student', 'business', 'special-discounts'],
  },
  {
    id: 'dell-latitude-7490',
    category: 'Laptops',
    brand: 'Dell',
    model: 'Latitude 7490',
    name: 'Dell Latitude 7490 Carbon Budget Pro',
    pricePkr: 42000,
    originalPricePkr: 47000,
    availability: 'Available · Confirm Stock on Order',
    image: IMAGES.dellLatitude,
    gallery: [IMAGES.dellLatitude],
    description:
      'Slim carbon-fiber Dell Latitude under PKR 45,000 featuring backlit keyboard, 8th Gen Quad-Core i5 speed, and solid-state storage for students and freelancers.',
    specs: {
      processor: 'Intel Core i5-8350U (8th Gen Quad-Core)',
      ram: '8GB DDR4',
      storage: '256GB M.2 SSD',
      display: '14" FHD Anti-Glare',
      graphics: 'Intel UHD Graphics 620',
      battery: '60Wh 4-Cell',
      weight: '1.40 kg',
      os: 'Windows 11 Pro Ready',
    },
    collections: ['budget-friendly', 'student', 'special-discounts'],
  },
];

export function formatPkr(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function getDiscountPercent(pricePkr: number, originalPricePkr?: number): number | null {
  if (!originalPricePkr || originalPricePkr <= pricePkr) return null;
  return Math.round(((originalPricePkr - pricePkr) / originalPricePkr) * 100);
}

export function buildWhatsAppOrderUrl(params: {
  laptop?: Laptop;
  product?: OrderableProduct;
  quantity?: number;
  customerName?: string;
  deliveryAddress?: string;
  contactNumber?: string;
}): string {
  const { laptop, product, quantity = 1, customerName, deliveryAddress, contactNumber } = params;

  const target: {
    name: string;
    brand: string;
    category: string;
    pricePkr: number;
  } | null = product
    ? {
        name: product.item.name,
        brand: product.item.brand,
        category: product.item.category,
        pricePkr: product.item.pricePkr,
      }
    : laptop
      ? {
          name: laptop.name,
          brand: laptop.brand,
          category: laptop.category,
          pricePkr: laptop.pricePkr,
        }
      : null;

  if (!target) {
    const generalMsg =
      'Hello FS SHOP (Fiza), I would like to inquire about purchasing a laptop or computer accessory.';
    return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(generalMsg)}`;
  }

  const total = target.pricePkr * quantity;
  const lines = [
    `Hello FS SHOP (Fiza), I want to order this product:`,
    `• Product: ${target.name}`,
    `• Brand: ${target.brand}`,
    `• Category: ${target.category}`,
    `• Unit Price: ${formatPkr(target.pricePkr)}`,
    `• Quantity: ${quantity}`,
    `• Total: ${formatPkr(total)}`,
  ];

  if (customerName?.trim()) lines.push(`• Customer Name: ${customerName.trim()}`);
  if (deliveryAddress?.trim()) lines.push(`• Delivery Address: ${deliveryAddress.trim()}`);
  if (contactNumber?.trim()) lines.push(`• Contact Number: ${contactNumber.trim()}`);

  return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function toOrderableLaptop(laptop: Laptop): OrderableProduct {
  return { kind: 'laptop', item: laptop };
}

export function toOrderableAccessory(accessory: AccessoryProduct): OrderableProduct {
  return { kind: 'accessory', item: accessory };
}
