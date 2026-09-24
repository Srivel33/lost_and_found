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
  { id: 'electronics', label: 'Electronics' },
  { id: 'gadgets', label: 'Gadgets' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'money', label: 'Money' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'documents', label: 'Documents' },
  { id: 'id_card', label: 'ID Card' },
  { id: 'others', label: 'Others' }
];

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
