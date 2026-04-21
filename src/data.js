export const COURSES = [
  { code: 'CS401', name: 'Data Structures & Algorithms', faculty: 'Dr. Anand Rao', credits: 4, type: 'theory', attendance: 74, color: '#EEF4FF', border: '#2D5BE3' },
  { code: 'MA401', name: 'Engineering Mathematics IV', faculty: 'Dr. Meena Sharma', credits: 4, type: 'theory', attendance: 88, color: '#E8F5EC', border: '#1E8449' },
  { code: 'PH401', name: 'Applied Physics', faculty: 'Prof. Suresh K', credits: 3, type: 'theory', attendance: 91, color: '#FEF6E7', border: '#C9952A' },
  { code: 'EN401', name: 'Technical Writing & Comm.', faculty: 'Ms. Divya Nair', credits: 2, type: 'theory', attendance: 82, color: '#FDF0F0', border: '#C0392B' },
  { code: 'CS402', name: 'Data Structures Lab', faculty: 'Dr. Anand Rao', credits: 2, type: 'lab', attendance: 95, color: '#F0F4FF', border: '#5B3FD4' },
  { code: 'CS403', name: 'Machine Learning (Elective)', faculty: 'Dr. Priya V', credits: 3, type: 'elective', attendance: 79, color: '#F0FEF4', border: '#1A7F74' },
];

export const RESULTS = [
  { sub: 'Data Structures', code: 'CS401', int: 24, mid: 38, end: null, total: null, grade: '--', status: 'ongoing' },
  { sub: 'Engg. Math IV', code: 'MA401', int: 26, mid: 42, end: null, total: null, grade: '--', status: 'ongoing' },
  { sub: 'Applied Physics', code: 'PH401', int: 22, mid: 35, end: null, total: null, grade: '--', status: 'ongoing' },
  { sub: 'Tech. Writing', code: 'EN401', int: 28, mid: 44, end: null, total: null, grade: '--', status: 'ongoing' },
  { sub: 'DS Lab', code: 'CS402', int: 28, mid: 46, end: null, total: null, grade: '--', status: 'ongoing' },
  { sub: 'Machine Learning', code: 'CS403', int: 25, mid: 40, end: null, total: null, grade: '--', status: 'ongoing' },
];

export const NOTIFICATIONS_TEMPLATE = [
  { title: '📢 Exam Schedule Released', body: 'End-semester exams begin May 12. Check your hall ticket.', time: '2 hrs ago', unread: true },
  { title: '⚠️ Attendance Warning – CS401', body: 'Your attendance in Data Structures is at 74%. Please attend.', time: '5 hrs ago', unread: true },
  { title: '💳 Fee Due Reminder', body: 'Semester 4 fees of ₹12,000 due by April 30.', time: '1 day ago', unread: true },
  { title: '📚 Library Book Due', body: '"Operating Systems" by Silberschatz is due in 2 days.', time: '1 day ago', unread: true },
  { title: '🎉 Holiday Notice', body: 'Campus closed on April 14 (Ambedkar Jayanti).', time: '3 days ago', unread: false },
  { title: '📋 Internal Marks Published', body: 'CS401 Internal 2 marks are now available in Results.', time: '4 days ago', unread: false },
];

export const TIMETABLE_DATA = [
  ['9–10', 'CS401', 'MA401', 'CS401', 'MA401', 'PH401'],
  ['10–11', 'MA401', 'CS401', 'PH401', 'CS401', 'MA401'],
  ['11–12', 'PH401', 'EN401', 'MA401', 'CS403', 'CS401'],
  ['1–2', 'CS402', 'CS402', 'CS403', 'EN401', 'CS403'],
  ['2–3', 'CS403', 'CS403', 'CS402', 'CS402', 'EN401'],
];

export const CLASS_STYLES = { CS401: 'tt-cs', MA401: 'tt-math', PH401: 'tt-phy', EN401: 'tt-eng', CS402: 'tt-lab', CS403: 'tt-lab' };

export const ISSUED_BOOKS = [
  { title: 'Introduction to Algorithms', author: 'Cormen et al.', issued: 'Mar 20', due: 'Apr 20', status: 'due' },
  { title: 'Operating Systems', author: 'Silberschatz', issued: 'Mar 28', due: 'Apr 11', status: 'overdue' },
  { title: 'Computer Networks', author: 'Tanenbaum', issued: 'Apr 1', due: 'Apr 28', status: 'ok' },
];

export const FEE_ITEMS = [
  { label: 'Tuition Fee', amount: 8000 },
  { label: 'Exam Fee', amount: 1500 },
  { label: 'Library Fee', amount: 500 },
  { label: 'Sports Fee', amount: 500 },
  { label: 'Lab Fee', amount: 1500 },
];

export const PAY_HISTORY = [
  { date: 'Oct 15, 2024', desc: 'Semester 3 Tuition Fee', amount: '₹8,000', method: 'UPI', status: 'paid' },
  { date: 'Oct 15, 2024', desc: 'Semester 3 Exam Fee', amount: '₹1,500', method: 'UPI', status: 'paid' },
  { date: 'Mar 1, 2024', desc: 'Semester 2 Fees', amount: '₹12,000', method: 'Net Banking', status: 'paid' },
];

export const BUILDING_INFO = {
  main: { name: 'Main Block', icon: '🏛️', desc: "Administrative offices, Principal's office, HOD chambers and conference rooms.", floors: 'G+3', rooms: '48 rooms', hours: '8 AM – 6 PM' },
  cs: { name: 'CS Department', icon: '💻', desc: 'All CS theory classrooms, computer labs, faculty cabins, seminar hall.', floors: 'G+2', rooms: '22 rooms', hours: '8 AM – 7 PM' },
  lib: { name: 'Central Library', icon: '📚', desc: '40,000+ books, digital resources, reading hall (200 seats), rare books section.', floors: 'G+1', rooms: '6 halls', hours: '8 AM – 8 PM' },
  aud: { name: 'Auditorium', icon: '🎭', desc: 'Main auditorium for events, annual day, guest lectures, and department fests.', floors: 'G+1', rooms: '1 hall', hours: '8 AM – 9 PM' },
  workshop: { name: 'Workshop / ME Lab', icon: '🔧', desc: 'Mechanical workshop, fabrication lab, 3D printing, and project garage.', floors: 'G+1', rooms: '4 labs', hours: '9 AM – 6 PM' },
  health: { name: 'Health Center', icon: '🏥', desc: 'Campus clinic, first aid, vaccination drives, and counselling referrals.', floors: 'G', rooms: '4 rooms', hours: '9 AM – 5 PM' },
  canteen: { name: 'Canteen', icon: '🍽️', desc: 'Multi-cuisine cafeteria, juice corner, bakery and outdoor seating area.', floors: 'G', rooms: '1 hall', hours: '7 AM – 9 PM' },
  ground: { name: 'Sports Ground', icon: '⚽', desc: 'Cricket pitch, football field, basketball courts, indoor badminton hall.', floors: '--', rooms: '6 courts', hours: '6 AM – 8 PM' },
  hostel: { name: 'Hostel', icon: '🏠', desc: 'Boys Block A & B (300 rooms), Girls Block (150 rooms), common room, gym.', floors: 'G+4', rooms: '450 rooms', hours: '24/7' },
  parking: { name: 'Visitor Parking', icon: '🅿️', desc: 'P1 & P2 lots, visitor passes at security, EV charging bays near east end.', floors: '--', rooms: '180 bays', hours: '24/7' },
  bus: { name: 'Bus Bay', icon: '🚌', desc: 'City buses, college shuttles, and night drop-off. Live board on the Campus app.', floors: '--', rooms: '4 bays', hours: '6 AM – 10 PM' },
  atm: { name: 'ATM & Services', icon: '🏧', desc: 'ATM, print / copy kiosk, and parcel locker. Maintained by campus facilities.', floors: 'G', rooms: '1 lobby', hours: '24/7' },
};

export const SEARCH_DATA = [
  { icon: '📚', label: 'Data Structures (CS401)', cat: 'Course', page: 'courses' },
  { icon: '📊', label: 'My Results', cat: 'Page', page: 'results' },
  { icon: '🗺️', label: 'Campus Map', cat: 'Page', page: 'campus' },
  { icon: '💳', label: 'Pay Fees', cat: 'Page', page: 'fees' },
  { icon: '📅', label: 'Weekly Timetable', cat: 'Page', page: 'timetable' },
  { icon: '📖', label: 'Library — Issued Books', cat: 'Page', page: 'library' },
  { icon: '👤', label: 'My Profile', cat: 'Page', page: 'profile' },
  { icon: '🏛️', label: 'Main Block', cat: 'Building', page: 'campus' },
  { icon: '💻', label: 'CS Department', cat: 'Building', page: 'campus' },
  { icon: '📚', label: 'Central Library Building', cat: 'Building', page: 'campus' },
  { icon: '🎭', label: 'Auditorium', cat: 'Building', page: 'campus' },
  { icon: '🔧', label: 'Workshop ME Lab', cat: 'Building', page: 'campus' },
  { icon: '🏥', label: 'Health Center', cat: 'Building', page: 'campus' },
  { icon: '🅿️', label: 'Visitor Parking', cat: 'Building', page: 'campus' },
  { icon: '🚌', label: 'Bus Bay', cat: 'Building', page: 'campus' },
  { icon: '🏧', label: 'ATM Campus', cat: 'Building', page: 'campus' },
];

export const PAGE_LABELS = {
  dashboard: 'Dashboard',
  courses: 'Courses',
  timetable: 'Timetable',
  results: 'Results & Grades',
  library: 'Library',
  campus: 'Campus Map',
  fees: 'Fees & Payments',
  profile: 'My Profile',
};

export const MAP_ROUTE_START = { x: 215, y: 210 };

export const MAP_BUILDING_CENTERS = {
  main: { cx: 100, cy: 98 },
  cs: { cx: 440, cy: 98 },
  lib: { cx: 750, cy: 98 },
  aud: { cx: 275, cy: 100 },
  workshop: { cx: 591, cy: 100 },
  health: { cx: 100, cy: 194 },
  canteen: { cx: 100, cy: 300 },
  ground: { cx: 420, cy: 310 },
  hostel: { cx: 750, cy: 305 },
  parking: { cx: 440, cy: 411 },
  bus: { cx: 260, cy: 237 },
  atm: { cx: 643, cy: 213 },
};

export function mapRoutePathD(cx, cy) {
  const { x: sx, y: sy } = MAP_ROUTE_START;
  const apronY = sy + 11;
  if (cx < sx) {
    const stagingX = sx + 19;
    return `M ${sx} ${sy} L ${sx} ${apronY} L ${stagingX} ${apronY} L ${cx} ${apronY} L ${cx} ${cy}`;
  }
  return `M ${sx} ${sy} L ${sx} ${apronY} L ${cx} ${apronY} L ${cx} ${cy}`;
}
