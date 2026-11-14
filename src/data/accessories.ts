import { AccessoryProduct } from '../types/laptop';
import mouseWirelessErgoImg from '../assets/images/mouse_wireless_ergo_1794566243988.jpg';
import mouseRgbGamingImg from '../assets/images/mouse_rgb_gaming_1794566244381.jpg';
import mouseBluetoothSlimImg from '../assets/images/mouse_bluetooth_slim_1794566241880.jpg';
import mouseUsbOpticalImg from '../assets/images/mouse_usb_optical_1794566244269.jpg';
import mouseHpWirelessImg from '../assets/images/mouse_hp_wireless_1794566244817.jpg';
import mouseDellProImg from '../assets/images/mouse_dell_pro_1794566244413.jpg';
import mouseLogitechGImg from '../assets/images/mouse_logitech_g_1794566245873.jpg';
import mouseLenovoThinkImg from '../assets/images/mouse_lenovo_think_1794566246425.jpg';
import mouseEsportsLightImg from '../assets/images/mouse_esports_light_1794566246470.jpg';

import kbdMechanicalProImg from '../assets/images/kbd_mechanical_pro_1794566246220.jpg';
import kbdWirelessSlimImg from '../assets/images/kbd_wireless_slim_1794566246193.jpg';
import kbdRgbGamingImg from '../assets/images/kbd_rgb_gaming_1794566248160.jpg';
import kbdUsbOfficeImg from '../assets/images/kbd_usb_office_1794566247300.jpg';
import kbdBluetoothCompactImg from '../assets/images/kbd_bluetooth_compact_1794566247344.jpg';
import kbdHpBusinessImg from '../assets/images/kbd_hp_business_1794566247396.jpg';
import kbdDellPremierImg from '../assets/images/kbd_dell_premier_1794566248562.jpg';
import kbdLogitechMxImg from '../assets/images/kbd_logitech_mx_1794566248231.jpg';
import kbdLenovoThinkImg from '../assets/images/kbd_lenovo_think_1794566248686.jpg';

import accLaptopBagImg from '../assets/images/acc_laptop_bag_1794566249085.jpg';
import accLaptopChargerImg from '../assets/images/acc_laptop_charger_1794566249416.jpg';
import accCoolingPadImg from '../assets/images/acc_cooling_pad_1794566248711.jpg';
import accHeadphonesImg from '../assets/images/acc_headphones_1794566250227.jpg';
import accUsbHubImg from '../assets/images/acc_usb_hub_1794566250638.jpg';
import accMousePadImg from '../assets/images/acc_mouse_pad_1794566250766.jpg';
import accLaptopStandImg from '../assets/images/acc_laptop_stand_1794566250147.jpg';

export const ACCESSORY_IMAGES = {
  // Mouse Collection (9 unique images)
  mouseWirelessErgo: mouseWirelessErgoImg,
  mouseRgbGaming: mouseRgbGamingImg,
  mouseBluetoothSlim: mouseBluetoothSlimImg,
  mouseUsbOptical: mouseUsbOpticalImg,
  mouseHpWireless: mouseHpWirelessImg,
  mouseDellPro: mouseDellProImg,
  mouseLogitechG: mouseLogitechGImg,
  mouseLenovoThink: mouseLenovoThinkImg,
  mouseEsportsLight: mouseEsportsLightImg,

  // Keyboard Collection (9 unique images)
  kbdMechanicalPro: kbdMechanicalProImg,
  kbdWirelessSlim: kbdWirelessSlimImg,
  kbdRgbGaming: kbdRgbGamingImg,
  kbdUsbOffice: kbdUsbOfficeImg,
  kbdBluetoothCompact: kbdBluetoothCompactImg,
  kbdHpBusiness: kbdHpBusinessImg,
  kbdDellPremier: kbdDellPremierImg,
  kbdLogitechMx: kbdLogitechMxImg,
  kbdLenovoThink: kbdLenovoThinkImg,

  // Other Accessories (7 unique images)
  accLaptopBag: accLaptopBagImg,
  accLaptopCharger: accLaptopChargerImg,
  accCoolingPad: accCoolingPadImg,
  accHeadphones: accHeadphonesImg,
  accUsbHub: accUsbHubImg,
  accMousePad: accMousePadImg,
  accLaptopStand: accLaptopStandImg,
};

export const MOUSE_COLLECTION: AccessoryProduct[] = [
  {
    id: 'mouse-wireless-mx-master',
    category: 'Mouse Collection',
    subType: 'Wireless Mouse',
    brand: 'Logitech',
    name: 'Logitech MX Master 3S Wireless Mouse',
    pricePkr: 28500,
    originalPricePkr: 31000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseWirelessErgo,
    gallery: [ACCESSORY_IMAGES.mouseWirelessErgo],
    description:
      'Flagship sculpted wireless mouse with MagSpeed electromagnetic scroll wheel, 8000 DPI darkfield glass tracking, and quiet-click switches for multi-PC workflows.',
    highlights: [
      { label: 'Connectivity', value: 'Bluetooth + Logi Bolt USB' },
      { label: 'Sensor', value: '8,000 DPI Darkfield' },
      { label: 'Battery', value: 'Up to 70 Days (USB-C)' },
      { label: 'Weight', value: '141 g' },
    ],
  },
  {
    id: 'mouse-gaming-esports',
    category: 'Mouse Collection',
    subType: 'Gaming Mouse',
    brand: 'Glorious',
    name: 'Glorious Model O- Ultralight Gaming Mouse',
    pricePkr: 14900,
    originalPricePkr: 16500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseEsportsLight,
    gallery: [ACCESSORY_IMAGES.mouseEsportsLight],
    description:
      'Featherweight honeycomb esports shell engineered for high-speed FPS flicks, 100% PTFE G-Skates, and crisp 80M-rated optical switches.',
    highlights: [
      { label: 'Connectivity', value: 'Ascended Braided USB' },
      { label: 'Sensor', value: 'BAMF 19,000 DPI' },
      { label: 'Polling Rate', value: '1,000 Hz (1ms)' },
      { label: 'Weight', value: '58 g Ultralight' },
    ],
  },
  {
    id: 'mouse-bluetooth-slim',
    category: 'Mouse Collection',
    subType: 'Bluetooth Mouse',
    brand: 'Satechi',
    name: 'Satechi M1 Aluminum Bluetooth Mouse',
    pricePkr: 8900,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseBluetoothSlim,
    gallery: [ACCESSORY_IMAGES.mouseBluetoothSlim],
    description:
      'Anodized silver aluminum travel Bluetooth mouse with rechargeable USB-C port, designed to complement MacBook Air, Surface, and sleek ultrabooks.',
    highlights: [
      { label: 'Connectivity', value: 'Bluetooth 4.0 Wireless' },
      { label: 'Range', value: 'Up to 10 Meters' },
      { label: 'Charging', value: 'USB-C Rechargeable' },
      { label: 'Finish', value: 'Brushed Silver Aluminum' },
    ],
  },
  {
    id: 'mouse-usb-optical',
    category: 'Mouse Collection',
    subType: 'USB Mouse',
    brand: 'Corsair',
    name: 'Corsair Katar Pro XT Wired USB Mouse',
    pricePkr: 6500,
    originalPricePkr: 7200,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseUsbOptical,
    gallery: [ACCESSORY_IMAGES.mouseUsbOptical],
    description:
      'Zero-latency wired USB optical mouse with drag-reducing paracord cable, symmetric compact grip, and crisp Omron micro-switches for daily work and gaming.',
    highlights: [
      { label: 'Connectivity', value: 'Wired USB-A Paracord' },
      { label: 'Sensor', value: '18,000 DPI PixArt' },
      { label: 'Buttons', value: '6 Programmable' },
      { label: 'Weight', value: '73 g' },
    ],
  },
  {
    id: 'mouse-rgb-gaming',
    category: 'Mouse Collection',
    subType: 'RGB Gaming Mouse',
    brand: 'Razer',
    name: 'Razer Cobra Pro RGB Gaming Mouse',
    pricePkr: 16500,
    originalPricePkr: 18500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseRgbGaming,
    gallery: [ACCESSORY_IMAGES.mouseRgbGaming],
    description:
      'Precision RGB gaming mouse featuring programmable electric-blue underglow zones, Gen-3 optical switches with 0.2ms actuation, and textured thumb grips.',
    highlights: [
      { label: 'Lighting', value: 'Multi-Zone RGB Chroma' },
      { label: 'Sensor', value: 'Focus Pro 30K Optical' },
      { label: 'Switches', value: '90M Optical Gen-3' },
      { label: 'Connectivity', value: 'Braided Speedflex USB' },
    ],
  },
  {
    id: 'mouse-hp-430',
    category: 'Mouse Collection',
    subType: 'HP Mouse',
    brand: 'HP',
    name: 'HP 430 Multi-Device Wireless Mouse',
    pricePkr: 7800,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseHpWireless,
    gallery: [ACCESSORY_IMAGES.mouseHpWireless],
    description:
      'Official HP enterprise wireless mouse with brushed silver top deck, 4-way tilt scroll wheel, and seamless pairing across 2 devices via Bluetooth or 2.4GHz dongle.',
    highlights: [
      { label: 'Connectivity', value: '2.4GHz USB + Bluetooth' },
      { label: 'Sensor', value: 'Up to 4,000 DPI' },
      { label: 'Buttons', value: '4 Programmable' },
      { label: 'Battery Life', value: 'Up to 24 Months' },
    ],
  },
  {
    id: 'mouse-dell-ms5120w',
    category: 'Mouse Collection',
    subType: 'Dell Mouse',
    brand: 'Dell',
    name: 'Dell Premier MS5120W Mobile Pro Mouse',
    pricePkr: 11500,
    originalPricePkr: 12800,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseDellPro,
    gallery: [ACCESSORY_IMAGES.mouseDellPro],
    description:
      'Titan-gray sculpted Dell Mobile Pro mouse supporting dual-mode RF + Bluetooth 5.0 connectivity, sculpted side thumb rests, and 36-month battery endurance.',
    highlights: [
      { label: 'Connectivity', value: 'Dual 2.4GHz + BT 5.0' },
      { label: 'Resolution', value: '1,600 DPI (Adjustable)' },
      { label: 'Buttons', value: '7 Programmable' },
      { label: 'Compatibility', value: 'Windows / macOS / Linux' },
    ],
  },
  {
    id: 'mouse-logitech-gpro',
    category: 'Mouse Collection',
    subType: 'Logitech Mouse',
    brand: 'Logitech',
    name: 'Logitech G Pro Wireless Esports Mouse',
    pricePkr: 32000,
    originalPricePkr: 35000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseLogitechG,
    gallery: [ACCESSORY_IMAGES.mouseLogitechG],
    description:
      'Tournament-grade Logitech G Pro mouse built with HERO 25K sub-micron sensor, 1ms LIGHTSPEED wireless response, and ambidextrous removable side buttons.',
    highlights: [
      { label: 'Sensor', value: 'HERO 25K (25,600 DPI)' },
      { label: 'Wireless', value: '1ms LIGHTSPEED / USB' },
      { label: 'Weight', value: '80 g' },
      { label: 'Battery', value: 'Up to 60 Hours' },
    ],
  },
  {
    id: 'mouse-lenovo-thinkpad',
    category: 'Mouse Collection',
    subType: 'Lenovo Mouse',
    brand: 'Lenovo',
    name: 'Lenovo ThinkPad Precision Wireless Mouse',
    pricePkr: 6200,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.mouseLenovoThink,
    gallery: [ACCESSORY_IMAGES.mouseLenovoThink],
    description:
      'Matte carbon-black ThinkPad signature mouse featuring a red anodized scroll wheel, blue optical tracking on nearly any surface, and compact USB nano receiver.',
    highlights: [
      { label: 'Connectivity', value: '2.4GHz Wireless / BT' },
      { label: 'Sensor', value: 'Blue Optical 1,600 DPI' },
      { label: 'Design', value: 'ThinkPad Soft-Touch Black' },
      { label: 'Battery', value: 'Up to 9 Months' },
    ],
  },
];

export const KEYBOARD_COLLECTION: AccessoryProduct[] = [
  {
    id: 'kbd-mechanical-keychron-q1',
    category: 'Keyboard Collection',
    subType: 'Mechanical Keyboard',
    brand: 'Keychron',
    name: 'Keychron Q1 Pro CNC Mechanical Keyboard',
    pricePkr: 36500,
    originalPricePkr: 39500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdMechanicalPro,
    gallery: [ACCESSORY_IMAGES.kbdMechanicalPro],
    description:
      'Full CNC aluminum tenkeyless mechanical keyboard with hot-swappable tactile switches, double-gasket mount acoustics, and double-shot PBT navy-slate keycaps.',
    highlights: [
      { label: 'Switches', value: 'Hot-Swappable Tactile Brown' },
      { label: 'Chassis', value: 'CNC Anodized Aluminum' },
      { label: 'Keycaps', value: 'Double-Shot PBT' },
      { label: 'Connectivity', value: 'USB-C Coiled + Bluetooth' },
    ],
  },
  {
    id: 'kbd-wireless-slim',
    category: 'Keyboard Collection',
    subType: 'Wireless Keyboard',
    brand: 'Apple / Universal',
    name: 'Ultra-Slim Aluminum Wireless Scissor Keyboard',
    pricePkr: 29500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdWirelessSlim,
    gallery: [ACCESSORY_IMAGES.kbdWirelessSlim],
    description:
      'Whisper-quiet low-profile scissor-switch wireless keyboard crafted from brushed silver aluminum with long-life rechargeable USB-C battery.',
    highlights: [
      { label: 'Mechanism', value: 'Low-Profile Scissor Switch' },
      { label: 'Connectivity', value: 'Bluetooth + USB-C' },
      { label: 'Battery', value: 'Up to 1 Month per Charge' },
      { label: 'Compatibility', value: 'macOS & Windows' },
    ],
  },
  {
    id: 'kbd-rgb-gaming',
    category: 'Keyboard Collection',
    subType: 'RGB Gaming Keyboard',
    brand: 'SteelSeries',
    name: 'SteelSeries Apex Pro RGB Gaming Keyboard',
    pricePkr: 18500,
    originalPricePkr: 21000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdRgbGaming,
    gallery: [ACCESSORY_IMAGES.kbdRgbGaming],
    description:
      'Compact 65% mechanical gaming keyboard featuring per-key electric-blue RGB illumination, full N-key rollover anti-ghosting, and linear gaming switches.',
    highlights: [
      { label: 'Backlight', value: 'Per-Key RGB (16.8M Colors)' },
      { label: 'Switches', value: 'Fast Linear Red Mechanical' },
      { label: 'Anti-Ghosting', value: '100% N-Key Rollover' },
      { label: 'Cable', value: 'Detachable Braided USB-C' },
    ],
  },
  {
    id: 'kbd-usb-office',
    category: 'Keyboard Collection',
    subType: 'USB Keyboard',
    brand: 'Logitech',
    name: 'Logitech K120 Pro Full-Size Wired USB Keyboard',
    pricePkr: 4200,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdUsbOffice,
    gallery: [ACCESSORY_IMAGES.kbdUsbOffice],
    description:
      'Spill-resistant full-size USB keyboard with dedicated numeric keypad, curved spacebar, and laser-etched keycaps built for heavy office and coding sessions.',
    highlights: [
      { label: 'Layout', value: '104-Key Full Size + Numpad' },
      { label: 'Connectivity', value: 'Plug-and-Play USB-A' },
      { label: 'Durability', value: 'Spill-Resistant Chassis' },
      { label: 'Keystroke Life', value: '10 Million Keystrokes' },
    ],
  },
  {
    id: 'kbd-bluetooth-compact',
    category: 'Keyboard Collection',
    subType: 'Bluetooth Keyboard',
    brand: 'Keychron',
    name: 'Keychron K2 75% Multi-Device Bluetooth Keyboard',
    pricePkr: 24000,
    originalPricePkr: 26500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdBluetoothCompact,
    gallery: [ACCESSORY_IMAGES.kbdBluetoothCompact],
    description:
      'Connect up to 3 laptops, tablets, or phones simultaneously via Bluetooth 5.1 with instant toggle keys and tactile mechanical switches.',
    highlights: [
      { label: 'Multi-Host', value: 'Pairs 3 Devices via BT 5.1' },
      { label: 'Layout', value: '75% Compact (84 Keys)' },
      { label: 'Battery', value: '4,000mAh Rechargeable' },
      { label: 'Mode', value: 'Bluetooth + Wired USB-C' },
    ],
  },
  {
    id: 'kbd-hp-970',
    category: 'Keyboard Collection',
    subType: 'HP Keyboard',
    brand: 'HP',
    name: 'HP 970 Programmable Silver Business Keyboard',
    pricePkr: 15800,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdHpBusiness,
    gallery: [ACCESSORY_IMAGES.kbdHpBusiness],
    description:
      'Brushed aluminum HP wireless keyboard featuring smart proximity backlit keys, 24 programmable shortcuts, and AES-128 encrypted wireless connectivity.',
    highlights: [
      { label: 'Backlighting', value: 'Smart Auto-Dimming White' },
      { label: 'Security', value: 'AES-128 Hardware Encryption' },
      { label: 'Connectivity', value: 'Bluetooth + HP Unifying USB' },
      { label: 'Battery', value: 'Up to 6 Months (USB-C)' },
    ],
  },
  {
    id: 'kbd-dell-kb700',
    category: 'Keyboard Collection',
    subType: 'Dell Keyboard',
    brand: 'Dell',
    name: 'Dell Premier KB700 Multi-Device Keyboard',
    pricePkr: 17500,
    originalPricePkr: 19200,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdDellPremier,
    gallery: [ACCESSORY_IMAGES.kbdDellPremier],
    description:
      'Titan-gray full-size Dell Premier wireless keyboard with silent scissor keys, 12 programmable function keys, and tilt legs for ergonomic typing.',
    highlights: [
      { label: 'Multi-Device', value: 'RF 2.4GHz + Dual Bluetooth' },
      { label: 'Layout', value: 'Full Size + Numpad' },
      { label: 'Battery', value: 'Up to 36 Months' },
      { label: 'Finish', value: 'Titan Gray Matte' },
    ],
  },
  {
    id: 'kbd-logitech-mx-keys',
    category: 'Keyboard Collection',
    subType: 'Logitech Keyboard',
    brand: 'Logitech',
    name: 'Logitech MX Keys S Illuminated Wireless Keyboard',
    pricePkr: 33500,
    originalPricePkr: 36000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdLogitechMx,
    gallery: [ACCESSORY_IMAGES.kbdLogitechMx],
    description:
      'Spherically-dished Perfect Stroke keys tailored for fingertips, smart hand-proximity backlighting, and Flow cross-computer typing.',
    highlights: [
      { label: 'Keys', value: 'Spherically-Dished Low Profile' },
      { label: 'Backlighting', value: 'Smart Proximity Sensors' },
      { label: 'Connectivity', value: 'Bluetooth + Logi Bolt' },
      { label: 'Charging', value: 'USB-C Quick Charge' },
    ],
  },
  {
    id: 'kbd-lenovo-thinkpad',
    category: 'Keyboard Collection',
    subType: 'Lenovo Keyboard',
    brand: 'Lenovo',
    name: 'Lenovo ThinkPad TrackPoint II Wireless Keyboard',
    pricePkr: 26000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.kbdLenovoThink,
    gallery: [ACCESSORY_IMAGES.kbdLenovoThink],
    description:
      'Authentic ThinkPad scissor-switch typing experience in a compact wireless chassis complete with integrated red TrackPoint nub and mouse buttons.',
    highlights: [
      { label: 'Pointer', value: 'Integrated Red TrackPoint' },
      { label: 'Connectivity', value: 'Bluetooth 5.0 + 2.4GHz USB' },
      { label: 'Layout', value: 'ThinkPad Ergonomic 6-Row' },
      { label: 'Battery', value: 'Up to 2 Months (USB-C)' },
    ],
  },
];

export const OTHER_ACCESSORIES: AccessoryProduct[] = [
  {
    id: 'acc-laptop-bag-targus',
    category: 'Other Accessories',
    subType: 'Laptop Bags',
    brand: 'Targus',
    name: 'Targus Pro Commuter 15.6" Backpack & Sleeve',
    pricePkr: 9500,
    originalPricePkr: 11000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accLaptopBag,
    gallery: [ACCESSORY_IMAGES.accLaptopBag],
    description:
      'Weather-resistant ballistic nylon laptop backpack paired with a plush shock-absorbing 15.6-inch sleeve, hidden passport pocket, and luggage pass-through strap.',
    highlights: [
      { label: 'Laptop Fit', value: 'Up to 16-inch Laptops' },
      { label: 'Protection', value: '360° High-Density Foam' },
      { label: 'Material', value: 'Water-Repellent Ballistic Nylon' },
      { label: 'Includes', value: 'Backpack + Padded Sleeve' },
    ],
  },
  {
    id: 'acc-laptop-charger-gan',
    category: 'Other Accessories',
    subType: 'Laptop Chargers',
    brand: 'Anker',
    name: 'Anker 100W GaN II Fast USB-C Laptop Charger',
    pricePkr: 11800,
    originalPricePkr: 13200,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accLaptopCharger,
    gallery: [ACCESSORY_IMAGES.accLaptopCharger],
    description:
      'Compact Gallium Nitride (GaN II) 100W Power Delivery fast charger compatible with MacBook Pro, Dell XPS, HP EliteBook, Lenovo ThinkPad, and USB-C laptops.',
    highlights: [
      { label: 'Output', value: '100W Max USB-C PD 3.0' },
      { label: 'Technology', value: 'Cool-Running GaN II Chip' },
      { label: 'Cable', value: '2m 100W Braided USB-C' },
      { label: 'Safety', value: 'ActiveShield Surge Protection' },
    ],
  },
  {
    id: 'acc-cooling-pad-deepcool',
    category: 'Other Accessories',
    subType: 'Cooling Pads',
    brand: 'DeepCool',
    name: 'DeepCool Dual-Fan Mesh Laptop Cooling Pad',
    pricePkr: 7400,
    originalPricePkr: 8500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accCoolingPad,
    gallery: [ACCESSORY_IMAGES.accCoolingPad],
    description:
      'Perforated steel-mesh cooling pad with dual 140mm silent electric-blue airflow fans, 5-stage height tilt adjustment, and integrated dual USB pass-through.',
    highlights: [
      { label: 'Fans', value: 'Dual 140mm Silent Fans' },
      { label: 'Compatibility', value: '13" to 17.3" Gaming Laptops' },
      { label: 'Angles', value: '5 Adjustable Ergonomic Heights' },
      { label: 'Noise Level', value: '21 dBA Ultra-Quiet' },
    ],
  },
  {
    id: 'acc-headphones-sony',
    category: 'Other Accessories',
    subType: 'Headphones',
    brand: 'Sony',
    name: 'Studio Wireless ANC Over-Ear Headphones',
    pricePkr: 24500,
    originalPricePkr: 27900,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accHeadphones,
    gallery: [ACCESSORY_IMAGES.accHeadphones],
    description:
      'Brushed-aluminum and memory-foam wireless studio headphones with Hybrid Active Noise Cancellation, crystal-clear beamforming call mic, and 40-hour battery.',
    highlights: [
      { label: 'Noise Control', value: 'Hybrid Active Noise Cancelling' },
      { label: 'Drivers', value: '40mm Hi-Res Acoustic' },
      { label: 'Battery', value: '40 Hours (USB-C Fast Charge)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
    ],
  },
  {
    id: 'acc-usb-hub-anker',
    category: 'Other Accessories',
    subType: 'USB Hubs',
    brand: 'Anker',
    name: 'Anker 8-in-1 Aluminum USB-C Multiport Hub',
    pricePkr: 12500,
    originalPricePkr: 14000,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accUsbHub,
    gallery: [ACCESSORY_IMAGES.accUsbHub],
    description:
      'Precision space-gray aluminum dock expanding a single USB-C port into 4K 60Hz HDMI, Gigabit RJ45 Ethernet, 100W PD pass-through, SD/microSD slots, and dual USB 3.1.',
    highlights: [
      { label: 'Video Out', value: '4K @ 60Hz HDMI' },
      { label: 'Power', value: '100W PD Charging Pass-Through' },
      { label: 'Network', value: 'Gigabit RJ45 Ethernet' },
      { label: 'Card Readers', value: 'SD + microSD UHS-I' },
    ],
  },
  {
    id: 'acc-mouse-pad-xl',
    category: 'Other Accessories',
    subType: 'Mouse Pads',
    brand: 'SteelSeries',
    name: 'SteelSeries QcK Heavy XL Stitched Desk Mouse Pad',
    pricePkr: 4800,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accMousePad,
    gallery: [ACCESSORY_IMAGES.accMousePad],
    description:
      '900 × 400mm extended micro-weave cloth desk mat with anti-fray stitched edges and high-grip natural rubber base for effortless keyboard and mouse glide.',
    highlights: [
      { label: 'Dimensions', value: '900 × 400 × 4 mm (XL)' },
      { label: 'Surface', value: 'High-Thread Micro-Weave' },
      { label: 'Edges', value: 'Anti-Fray Precision Stitched' },
      { label: 'Base', value: 'Non-Slip Natural Rubber' },
    ],
  },
  {
    id: 'acc-laptop-stand-alu',
    category: 'Other Accessories',
    subType: 'Laptop Stands',
    brand: 'Twelve South',
    name: 'CNC Aluminum Foldable Ergonomic Laptop Stand',
    pricePkr: 8200,
    originalPricePkr: 9500,
    availability: 'In Stock · Ready to Ship',
    image: ACCESSORY_IMAGES.accLaptopStand,
    gallery: [ACCESSORY_IMAGES.accLaptopStand],
    description:
      'Heavy-duty anodized aluminum dual-hinge laptop riser elevating your display to eye level, improving posture and passive underside airflow.',
    highlights: [
      { label: 'Material', value: '4mm CNC Brushed Aluminum' },
      { label: 'Load Capacity', value: 'Up to 10 kg (11"–17" Laptops)' },
      { label: 'Adjustability', value: 'Dual-Axis Height & Tilt' },
      { label: 'Pads', value: 'Anti-Scratch Silicone Grips' },
    ],
  },
];

export const ALL_ACCESSORIES: AccessoryProduct[] = [
  ...MOUSE_COLLECTION,
  ...KEYBOARD_COLLECTION,
  ...OTHER_ACCESSORIES,
];
