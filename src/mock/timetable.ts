import { TimetableEntry } from '../types';

export const mockTimetable: TimetableEntry[] = [
  // TY CSE Division A
  { id: 't1', day: 'Monday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Machine Learning', subjectCode: 'CSL501', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#6366f1' },
  { id: 't2', day: 'Monday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Computer Networks', subjectCode: 'CSL502', faculty: 'Prof. Anita More', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#8b5cf6' },
  { id: 't3', day: 'Monday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Database Management', subjectCode: 'CSL503', faculty: 'Dr. Vijay Kulkarni', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#06b6d4' },
  { id: 't4', day: 'Monday', period: 4, startTime: '12:15', endTime: '13:15', subject: 'Software Engineering', subjectCode: 'CSL504', faculty: 'Prof. Rekha Patil', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#10b981' },
  { id: 't5', day: 'Monday', period: 5, startTime: '14:00', endTime: '17:00', subject: 'Machine Learning Lab', subjectCode: 'CSP501', faculty: 'Dr. Suresh Jadhav', room: 'Lab-1', department: 'CSE', year: 'TY', division: 'A', type: 'lab', color: '#f59e0b' },

  { id: 't6', day: 'Tuesday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Operating Systems', subjectCode: 'CSL505', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#6366f1' },
  { id: 't7', day: 'Tuesday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Machine Learning', subjectCode: 'CSL501', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#ec4899' },
  { id: 't8', day: 'Tuesday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Computer Networks', subjectCode: 'CSL502', faculty: 'Prof. Anita More', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#8b5cf6' },
  { id: 't9', day: 'Tuesday', period: 4, startTime: '12:15', endTime: '13:15', subject: 'Elective - Cloud Computing', subjectCode: 'CSE502', faculty: 'Prof. Sandeep Gawade', room: 'C302', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#14b8a6' },
  { id: 't10', day: 'Tuesday', period: 5, startTime: '14:00', endTime: '17:00', subject: 'CN Lab', subjectCode: 'CSP502', faculty: 'Prof. Anita More', room: 'Net-Lab', department: 'CSE', year: 'TY', division: 'A', type: 'lab', color: '#f97316' },

  { id: 't11', day: 'Wednesday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Database Management', subjectCode: 'CSL503', faculty: 'Dr. Vijay Kulkarni', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#06b6d4' },
  { id: 't12', day: 'Wednesday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Software Engineering', subjectCode: 'CSL504', faculty: 'Prof. Rekha Patil', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#10b981' },
  { id: 't13', day: 'Wednesday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Operating Systems', subjectCode: 'CSL505', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#6366f1' },
  { id: 't14', day: 'Wednesday', period: 4, startTime: '12:15', endTime: '13:15', subject: 'Mini Project', subjectCode: 'CSP503', faculty: 'Dr. Suresh Jadhav', room: 'C303', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#a855f7' },

  { id: 't15', day: 'Thursday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Machine Learning', subjectCode: 'CSL501', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#6366f1' },
  { id: 't16', day: 'Thursday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Database Management', subjectCode: 'CSL503', faculty: 'Dr. Vijay Kulkarni', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#06b6d4' },
  { id: 't17', day: 'Thursday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Computer Networks', subjectCode: 'CSL502', faculty: 'Prof. Anita More', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#8b5cf6' },
  { id: 't18', day: 'Thursday', period: 4, startTime: '12:15', endTime: '13:15', subject: 'Elective - Cloud Computing', subjectCode: 'CSE502', faculty: 'Prof. Sandeep Gawade', room: 'C302', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#14b8a6' },
  { id: 't19', day: 'Thursday', period: 5, startTime: '14:00', endTime: '17:00', subject: 'DBMS Lab', subjectCode: 'CSP504', faculty: 'Dr. Vijay Kulkarni', room: 'DB-Lab', department: 'CSE', year: 'TY', division: 'A', type: 'lab', color: '#06b6d4' },

  { id: 't20', day: 'Friday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Software Engineering', subjectCode: 'CSL504', faculty: 'Prof. Rekha Patil', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#10b981' },
  { id: 't21', day: 'Friday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Operating Systems', subjectCode: 'CSL505', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#6366f1' },
  { id: 't22', day: 'Friday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Machine Learning', subjectCode: 'CSL501', faculty: 'Dr. Suresh Jadhav', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#ec4899' },

  { id: 't23', day: 'Saturday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Elective - Cloud Computing', subjectCode: 'CSE502', faculty: 'Prof. Sandeep Gawade', room: 'C302', department: 'CSE', year: 'TY', division: 'A', type: 'lecture', color: '#14b8a6' },
  { id: 't24', day: 'Saturday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Software Engineering', subjectCode: 'CSL504', faculty: 'Prof. Rekha Patil', room: 'C301', department: 'CSE', year: 'TY', division: 'A', type: 'tutorial', color: '#10b981' },

  // SY ENTC Division B
  { id: 't25', day: 'Monday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Signals & Systems', subjectCode: 'ENL301', faculty: 'Prof. Meena Desai', room: 'E201', department: 'ENTC', year: 'SY', division: 'B', type: 'lecture', color: '#6366f1' },
  { id: 't26', day: 'Monday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Digital Electronics', subjectCode: 'ENL302', faculty: 'Prof. Sanjay Kulkarni', room: 'E201', department: 'ENTC', year: 'SY', division: 'B', type: 'lecture', color: '#8b5cf6' },
  { id: 't27', day: 'Monday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Analog Circuits', subjectCode: 'ENL303', faculty: 'Prof. Meena Desai', room: 'E201', department: 'ENTC', year: 'SY', division: 'B', type: 'lecture', color: '#06b6d4' },
  { id: 't28', day: 'Tuesday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Digital Electronics', subjectCode: 'ENL302', faculty: 'Prof. Sanjay Kulkarni', room: 'E201', department: 'ENTC', year: 'SY', division: 'B', type: 'tutorial', color: '#8b5cf6' },
  { id: 't29', day: 'Tuesday', period: 5, startTime: '14:00', endTime: '17:00', subject: 'DE Lab', subjectCode: 'ENP301', faculty: 'Prof. Sanjay Kulkarni', room: 'E-Lab1', department: 'ENTC', year: 'SY', division: 'B', type: 'lab', color: '#f59e0b' },

  // FY Mechanical Division C
  { id: 't30', day: 'Monday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Engineering Mathematics I', subjectCode: 'MEC101', faculty: 'Dr. Ashok Nair', room: 'M101', department: 'Mechanical', year: 'FY', division: 'C', type: 'lecture', color: '#6366f1' },
  { id: 't31', day: 'Monday', period: 2, startTime: '10:00', endTime: '11:00', subject: 'Engineering Physics', subjectCode: 'MEC102', faculty: 'Dr. Suman Roy', room: 'M101', department: 'Mechanical', year: 'FY', division: 'C', type: 'lecture', color: '#8b5cf6' },
  { id: 't32', day: 'Monday', period: 3, startTime: '11:15', endTime: '12:15', subject: 'Engineering Drawing', subjectCode: 'MEC103', faculty: 'Prof. Vijay Pawar', room: 'Drawing Hall', department: 'Mechanical', year: 'FY', division: 'C', type: 'lecture', color: '#06b6d4' },
  { id: 't33', day: 'Tuesday', period: 1, startTime: '09:00', endTime: '10:00', subject: 'Basic Electronics', subjectCode: 'MEC104', faculty: 'Prof. Anjali Singh', room: 'M101', department: 'Mechanical', year: 'FY', division: 'C', type: 'lecture', color: '#10b981' },
  { id: 't34', day: 'Wednesday', period: 5, startTime: '14:00', endTime: '17:00', subject: 'Workshop Practice', subjectCode: 'MEP101', faculty: 'Prof. Vijay Pawar', room: 'Workshop', department: 'Mechanical', year: 'FY', division: 'C', type: 'lab', color: '#f59e0b' },
];
