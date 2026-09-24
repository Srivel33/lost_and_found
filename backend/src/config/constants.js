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
  { id: 'wallet', label: 'Wallet / Purse' },
  { id: 'bag', label: 'Bag / Backpack' },
  { id: 'id_card', label: 'College ID Card' },
  { id: 'keys', label: 'Keys' },
  { id: 'earphones', label: 'Earphones / Earbuds' },
  { id: 'bottle', label: 'Water Bottle' },
  { id: 'laptop', label: 'Laptop / Tablet' },
  { id: 'other', label: 'Other' }
];

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
  'a', 'an', 'the', 'in', 'on', 'at', 'with', 'for', 'to', 'of', 'and', 'or', 'is', 'it', 'my', 'near', 'from', 'left', 'found', 'lost'
]);

export const SYNONYM_MAP = {
  'navy': 'blue',
  'darkblue': 'blue',
  'backpack': 'bag',
  'sack': 'bag',
  'duffle': 'bag',
  'purse': 'wallet',
  'cardholder': 'wallet',
  'earbuds': 'earphones',
  'buds': 'earphones',
  'airpods': 'earphones',
  'headphones': 'earphones',
  'mobile': 'phone',
  'smartphone': 'phone',
  'cellphone': 'phone',
  'galaxy': 'phone',
  'iphone': 'phone',
  'flask': 'bottle',
  'sipper': 'bottle',
  'hydroflask': 'bottle',
  'idcard': 'id_card',
  'identity': 'id_card',
  'lanyard': 'id_card'
};

export const COLLEGE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(snsct\.org|college\.edu)$/i;
export const REG_NUMBER_REGEX = /^[a-zA-Z0-9]{8,14}$/;
export const PHONE_REGEX = /^\d{10}$/;
