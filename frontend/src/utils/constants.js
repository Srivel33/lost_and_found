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
