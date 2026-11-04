import { Conversation } from '../types';

export const mockChatHistory: Conversation[] = [
  {
    id: 'conv1',
    userId: 'u1',
    title: 'TY CSE Timetable Query',
    createdAt: '2024-10-22T08:00:00Z',
    updatedAt: '2024-10-22T08:15:00Z',
    messages: [
      {
        id: 'm1',
        conversationId: 'conv1',
        role: 'user',
        content: "What is today's TY CSE timetable?",
        timestamp: '2024-10-22T08:00:00Z',
      },
      {
        id: 'm2',
        conversationId: 'conv1',
        role: 'assistant',
        content: "Here is the **TY CSE Division A** timetable for **Monday**:\n\n| Period | Time | Subject | Faculty | Room |\n|--------|------|---------|---------|------|\n| 1 | 09:00–10:00 | Machine Learning | Dr. Suresh Jadhav | C301 |\n| 2 | 10:00–11:00 | Computer Networks | Prof. Anita More | C301 |\n| 3 | 11:15–12:15 | Database Management | Dr. Vijay Kulkarni | C301 |\n| 4 | 12:15–13:15 | Software Engineering | Prof. Rekha Patil | C301 |\n| 5 | 14:00–17:00 | Machine Learning Lab | Dr. Suresh Jadhav | Lab-1 |\n\n> 💡 Lunch break is from 1:15 PM to 2:00 PM.",
        timestamp: '2024-10-22T08:00:05Z',
        sources: [
          { id: 's1', title: 'TY CSE Timetable Sem V 2024.pdf', page: 1, excerpt: 'Monday schedule for TY CSE Division A', category: 'Timetable' },
        ],
        feedback: 'up',
      },
    ],
  },
  {
    id: 'conv2',
    userId: 'u1',
    title: 'Exam Schedule Inquiry',
    createdAt: '2024-10-21T14:00:00Z',
    updatedAt: '2024-10-21T14:10:00Z',
    messages: [
      {
        id: 'm3',
        conversationId: 'conv2',
        role: 'user',
        content: 'When is the end semester exam starting?',
        timestamp: '2024-10-21T14:00:00Z',
      },
      {
        id: 'm4',
        conversationId: 'conv2',
        role: 'assistant',
        content: "## End Semester Examination Schedule\n\nThe **End Semester Examination** for all branches will commence from **November 18, 2024**.\n\n### Key Dates:\n- 📋 **Hall Ticket Release:** November 10, 2024\n- 🎓 **FY Exams:** November 18–29, 2024\n- 📚 **SY Exams:** November 18–December 2, 2024\n- 🔬 **TY Exams:** November 20–December 5, 2024\n- 🎯 **BE Exams:** November 22–December 6, 2024\n\n### Important Instructions:\n1. Carry Hall Ticket + College ID\n2. Arrive 15 minutes before exam\n3. Mobile phones are **strictly prohibited**",
        timestamp: '2024-10-21T14:00:07Z',
        sources: [
          { id: 's2', title: 'Exam Schedule Nov 2024.pdf', page: 1, excerpt: 'End semester examination schedule November 2024', category: 'Examination' },
        ],
        feedback: null,
      },
    ],
  },
  {
    id: 'conv3',
    userId: 'u1',
    title: 'Hostel Rules',
    createdAt: '2024-10-20T11:00:00Z',
    updatedAt: '2024-10-20T11:08:00Z',
    messages: [
      {
        id: 'm5',
        conversationId: 'conv3',
        role: 'user',
        content: 'What are the hostel rules?',
        timestamp: '2024-10-20T11:00:00Z',
      },
      {
        id: 'm6',
        conversationId: 'conv3',
        role: 'assistant',
        content: "## WCE Hostel Rules & Regulations\n\n### General Rules:\n- Hostel curfew: **10:00 PM** on weekdays, **10:30 PM** on weekends\n- Visitors allowed only in common room during visiting hours (4–6 PM)\n- No cooking in rooms (mess facilities available)\n- Maintain cleanliness in rooms and common areas\n\n### Mess Timings:\n| Meal | Time |\n|------|------|\n| Breakfast | 7:00 AM – 8:30 AM |\n| Lunch | 12:00 PM – 2:00 PM |\n| Dinner | 7:30 PM – 9:30 PM |\n\n### Prohibited Items:\n- Alcohol, tobacco, and narcotics\n- Electric heaters and immersion rods\n- Pets\n\nFor full rules, refer to the Hostel Handbook.",
        timestamp: '2024-10-20T11:00:06Z',
        sources: [
          { id: 's3', title: 'Hostel Rules and Regulations 2024.pdf', page: 2, excerpt: 'General hostel rules and mess timings', category: 'Rules & Policies' },
        ],
        feedback: null,
      },
    ],
  },
];
