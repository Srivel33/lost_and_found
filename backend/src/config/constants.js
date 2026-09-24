export const CAMPUS_PLACES = [
  'Block A',
  'Block B',
  'Library',
  'Labs',
  'Canteen',
  'Auditorium',
  'Sports Ground',
  'Bus Bay',
  'Parking',
  'Hostel area',
  'Admin Block'
];

export const CAMPUS_ZONES = {
  'Block A': ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'],
  'Block B': ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'],
  'Library': ['Ground Floor Reading Room', '1st Floor Digital Library', '2nd Floor Reference Section'],
  'Labs': ['AI & Robotics Lab', 'IoT & Embedded Lab', 'CAD/CAM Lab', 'Computer Center'],
  'Canteen': ['Main Dining Hall', 'Juice Corner', 'First Floor Balcony'],
  'Admin Block': ['Reception & Helpdesk', 'Exam Cell', 'Principal Office'],
  'Auditorium': ['Ground Seating', 'Stage Backstage', 'Mezzanine'],
  'Sports Ground': ['Football Field', 'Basketball Court', 'Cricket Nets'],
  'Bus Bay': ['Boarding Platform 1-5', 'Boarding Platform 6-10'],
  'Parking': ['Two Wheeler Parking', 'Four Wheeler Parking'],
  'Hostel area': ['Boys Hostel Block', 'Girls Hostel Block', 'Mess Hall']
};

export const CAMPUS_ADJACENCY = {
  'Library': ['Block A'],
  'Block A': ['Library', 'Block B'],
  'Block B': ['Block A', 'Labs'],
  'Labs': ['Block B'],
  'Canteen': ['Auditorium'],
  'Auditorium': ['Canteen', 'Admin Block'],
  'Admin Block': ['Auditorium'],
  'Bus Bay': ['Parking'],
  'Parking': ['Bus Bay'],
  'Sports Ground': ['Hostel area'],
  'Hostel area': ['Sports Ground']
};

export const CATEGORIES = [
  { id: 'phone', label: 'Phone / Mobile' },
  { id: 'wallet', label: 'Wallet / Purse / Money' },
  { id: 'bag', label: 'Bag / Backpack' },
  { id: 'id_card', label: 'College ID Card' },
  { id: 'keys', label: 'Keys' },
  { id: 'earphones', label: 'Earphones / Earbuds' },
  { id: 'bottle', label: 'Water Bottle' },
  { id: 'laptop', label: 'Laptop / Charger / Tablet' },
  { id: 'other', label: 'Other / Stationery' }
];

// Production Dynamic Thresholds per Category
export const CATEGORY_THRESHOLDS = {
  wallet: 0.75,      // High security: cash, credit cards, confidential IDs
  phone: 0.75,       // High security: personal data, expensive
  laptop: 0.75,      // High security: high value electronics
  earphones: 0.65,   // Medium security
  id_card: 0.65,     // Medium security
  keys: 0.60,        // Medium security
  bag: 0.60,         // Medium security
  bottle: 0.55,      // Low security
  other: 0.55        // Low security
};

export const COMMON_COLORS = [
  'Black',
  'White',
  'Blue',
  'Navy / Dark Blue',
  'Red',
  'Green',
  'Yellow',
  'Brown',
  'Silver / Grey',
  'Gold',
  'Purple',
  'Orange',
  'Pink',
  'Multicolor',
  'Other'
];

export const FOUND_CURRENT_LOCATIONS = [
  'With me',
  'Security desk',
  'Department office'
];

export const POST_STATUSES = {
  OPEN: 'open',
  MATCHED: 'matched',
  CLAIMED: 'claimed',
  RETURNED: 'returned',
  EXPIRED: 'expired',
  WITHDRAWN: 'withdrawn'
};

export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'with', 'for', 'to', 'of', 'and', 'or', 'is', 'it', 'my', 'near', 'from', 'left', 'found', 'lost', 'item', 'please'
]);

// Expanded Semantic Synonym Mapping for cross-lingual & natural campus terminology
export const SYNONYM_MAP = {
  'navy': 'blue',
  'darkblue': 'blue',
  'silver': 'grey',
  'gray': 'grey',
  'slate': 'grey',
  'ash': 'grey',
  'golden': 'gold',
  
  // Bags
  'backpack': 'bag',
  'sack': 'bag',
  'duffle': 'bag',
  'tote': 'bag',
  'kitbag': 'bag',
  
  // Wallets & Currency
  'purse': 'wallet',
  'cardholder': 'wallet',
  'billfold': 'wallet',
  'cash': 'wallet',
  'money': 'wallet',
  'currency': 'wallet',
  'notes': 'wallet',
  'rupees': 'wallet',
  
  // Audio & Earphones
  'earbuds': 'earphones',
  'buds': 'earphones',
  'airpods': 'earphones',
  'headphones': 'earphones',
  'headset': 'earphones',
  'neckband': 'earphones',
  'tws': 'earphones',
  
  // Phones
  'mobile': 'phone',
  'smartphone': 'phone',
  'cellphone': 'phone',
  'galaxy': 'phone',
  'iphone': 'phone',
  'oneplus': 'phone',
  'redmi': 'phone',
  
  // Laptops, Chargers, Adapters
  'charger': 'adapter',
  'power': 'adapter',
  'cable': 'adapter',
  'cord': 'adapter',
  'wire': 'adapter',
  'brick': 'adapter',
  'typec': 'adapter',
  'macbook': 'laptop',
  'dell': 'laptop',
  'hp': 'laptop',
  'lenovo': 'laptop',
  'thinkpad': 'laptop',
  'notebook': 'laptop',
  
  // Bottles
  'flask': 'bottle',
  'sipper': 'bottle',
  'hydroflask': 'bottle',
  'thermos': 'bottle',
  'tumbler': 'bottle',
  
  // ID Cards
  'idcard': 'id_card',
  'identity': 'id_card',
  'lanyard': 'id_card',
  'badge': 'id_card',
  'smartcard': 'id_card',

  // Stationery
  'pen': 'stationery',
  'pencil': 'stationery',
  'calculator': 'stationery',
  'casio': 'stationery',
  'drafter': 'stationery',
  'compass': 'stationery',
  'scale': 'stationery',
  'ruler': 'stationery'
};

export const COLLEGE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(snsct\.org|college\.edu)$/i;
export const REG_NUMBER_REGEX = /^[a-zA-Z0-9]{8,14}$/;
export const PHONE_REGEX = /^\d{10}$/;
