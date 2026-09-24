export const CAMPUS_PLACES = [
  'Block A',
  'Block B',
  'Block C',
  'Block D',
  'Food Court',
  'Playground',
  'Parking',
  'Open Auditorium',
  'Cafe',
  'Lawn',
  'Office Room',
  'Library',
  'Staff Room',
  'Others'
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
  'Library': ['Block A', 'Office Room'],
  'Block A': ['Library', 'Block B', 'Office Room'],
  'Block B': ['Block A', 'Block C', 'Staff Room', 'Labs'],
  'Block C': ['Block B', 'Block D', 'Staff Room'],
  'Block D': ['Block C', 'Open Auditorium', 'Auditorium', 'Parking'],
  'Food Court': ['Cafe', 'Open Auditorium', 'Canteen'],
  'Canteen': ['Auditorium', 'Food Court', 'Cafe'],
  'Auditorium': ['Canteen', 'Admin Block', 'Open Auditorium', 'Block D'],
  'Open Auditorium': ['Food Court', 'Block D', 'Auditorium', 'Cafe'],
  'Cafe': ['Food Court', 'Lawn', 'Canteen'],
  'Lawn': ['Playground', 'Cafe'],
  'Playground': ['Lawn', 'Parking', 'Sports Ground'],
  'Parking': ['Block A', 'Block D', 'Bus Bay', 'Playground'],
  'Bus Bay': ['Parking'],
  'Sports Ground': ['Playground', 'Hostel area'],
  'Hostel area': ['Sports Ground'],
  'Labs': ['Block B'],
  'Admin Block': ['Auditorium'],
  'Office Room': ['Library', 'Block A'],
  'Staff Room': ['Block C', 'Block B'],
  'Others': []
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

export const CATEGORY_THRESHOLDS = {
  wallet: 0.75,
  phone: 0.75,
  laptop: 0.75,
  earphones: 0.65,
  id_card: 0.65,
  keys: 0.60,
  bag: 0.60,
  bottle: 0.55,
  other: 0.55
};

export const COMMON_COLORS = [
  'Black',
  'White',
  'Blue',
  'Navy / Dark Blue',
  'Red',
  'Green',
  'Yellow',
  'Silver / Grey',
  'Gold',
  'Brown',
  'Other'
];

export const FOUND_CURRENT_LOCATIONS = [
  'With me',
  'Security desk',
  'Department office',
  'Staff Room'
];

export const POST_STATUSES = {
  OPEN: 'open',
  MATCHED: 'matched',
  CLAIMED: 'claimed',
  RETURNED: 'returned',
  EXPIRED: 'expired',
  WITHDRAWN: 'withdrawn'
};
