import { Source } from '../types';

// Mock bot with ~25 keyword-based Q&A pairs
// Each entry: keywords array, markdown response, sources

interface BotResponse {
  content: string;
  sources: Source[];
}

interface QAPair {
  keywords: string[];
  response: BotResponse;
}

const qaPairs: QAPair[] = [
  {
    keywords: ['timetable', 'schedule', 'classes', 'lecture', 'ty cse', 'today'],
    response: {
      content: `## TY CSE Division A – Weekly Timetable

| Period | Time | Monday | Tuesday | Wednesday | Thursday | Friday |
|--------|------|--------|---------|-----------|----------|--------|
| 1 | 09:00–10:00 | Machine Learning | Operating Systems | DBMS | Machine Learning | Software Engg |
| 2 | 10:00–11:00 | Computer Networks | ML Tutorial | SE | DBMS Tutorial | OS |
| 3 | 11:15–12:15 | DBMS | CN | OS Tutorial | CN | ML Tutorial |
| 4 | 12:15–13:15 | Software Engg | Cloud Elective | Mini Project | Cloud Elective | — |
| 5 | 14:00–17:00 | **ML Lab** | **CN Lab** | — | **DBMS Lab** | — |

> 💡 Lunch: 1:15–2:00 PM | Saturday: Only morning sessions`,
      sources: [
        { id: 's-tt1', title: 'TY CSE Timetable Sem V 2024.pdf', page: 1, excerpt: 'Weekly timetable for TY CSE Division A, Semester V', category: 'Timetable' },
      ],
    },
  },
  {
    keywords: ['exam', 'examination', 'end semester', 'esa', 'when is exam', 'exam date'],
    response: {
      content: `## End Semester Examination – November 2024

📅 **Examinations begin: November 18, 2024**

| Branch/Year | Exam Dates |
|------------|------------|
| FY (All Branches) | Nov 18 – Nov 29 |
| SY (All Branches) | Nov 18 – Dec 2 |
| TY (All Branches) | Nov 20 – Dec 5 |
| BE (All Branches) | Nov 22 – Dec 6 |

### Important Reminders:
- 🎫 **Hall tickets release:** November 10, 2024
- 📵 Mobile phones strictly prohibited
- ⏰ Report 15 minutes early
- 🪪 Carry College ID + Hall Ticket

Check the detailed subject-wise schedule on erp.wce.ac.in`,
      sources: [
        { id: 's-ex1', title: 'Exam Schedule Nov 2024.pdf', page: 1, excerpt: 'End semester examination schedule with dates for all branches', category: 'Examination' },
        { id: 's-ex2', title: 'Exam Schedule Nov 2024.pdf', page: 3, excerpt: 'Instructions for students appearing in examinations', category: 'Examination' },
      ],
    },
  },
  {
    keywords: ['hod', 'head of department', 'department head', 'who is hod', 'cse hod', 'entc hod', 'mechanical hod', 'civil hod'],
    response: {
      content: `## Heads of Department – WCE Sangli

| Department | HOD | Email |
|-----------|-----|-------|
| Computer Science & Engineering (CSE) | **Dr. Suresh Jadhav** | hod.cse@wce.ac.in |
| Electronics & Telecomm. (ENTC) | **Dr. Priya Nair** | hod.entc@wce.ac.in |
| Mechanical Engineering | **Prof. Mohan Shinde** | hod.mech@wce.ac.in |
| Civil Engineering | **Dr. Anand Kulkarni** | hod.civil@wce.ac.in |

### College Administration:
- **Principal:** Dr. D.G. Ganage
- **Vice Principal:** Dr. A.B. Bhosle
- **Dean Academics:** Dr. S.R. Patil`,
      sources: [
        { id: 's-fac1', title: 'Faculty Directory 2024-25.docx', page: 1, excerpt: 'Department Heads and administrative staff list', category: 'Faculty' },
      ],
    },
  },
  {
    keywords: ['hostel', 'hostel rules', 'hostel curfew', 'hostel fee', 'hostel warden'],
    response: {
      content: `## WCE Hostel Rules & Regulations 2024

### 🏠 General Rules:
- **Curfew:** 10:00 PM (weekdays) | 10:30 PM (weekends)
- Visitors only in common room: **4:00 PM – 6:00 PM**
- No cooking in rooms
- Maintain discipline and cleanliness

### 🍽️ Mess Timings:
| Meal | Time |
|------|------|
| Breakfast | 7:00 AM – 8:30 AM |
| Lunch | 12:00 PM – 2:00 PM |
| Snacks | 5:30 PM – 6:30 PM |
| Dinner | 7:30 PM – 9:30 PM |

### 🚫 Prohibited:
- Alcohol, tobacco, drugs
- Electric heaters/immersion rods
- Unauthorized guests overnight

**Hostel Warden:** Contact at Hostel Office (ext: 201)`,
      sources: [
        { id: 's-hos1', title: 'Hostel Rules and Regulations 2024.pdf', page: 1, excerpt: 'General hostel rules, curfew timings and prohibited items', category: 'Rules & Policies' },
        { id: 's-hos2', title: 'Hostel Rules and Regulations 2024.pdf', page: 4, excerpt: 'Mess timings and meal schedule', category: 'Rules & Policies' },
      ],
    },
  },
  {
    keywords: ['syllabus', 'subject', 'curriculum', 'ty cse subjects', 'sem 5', 'semester 5'],
    response: {
      content: `## TY CSE Semester V – Syllabus Overview

### Core Subjects:
| Code | Subject | Credits |
|------|---------|---------|
| CSL501 | Machine Learning | 4 |
| CSL502 | Computer Networks | 4 |
| CSL503 | Database Management Systems | 4 |
| CSL504 | Software Engineering | 4 |
| CSL505 | Operating Systems | 4 |

### Electives (Choose 1):
| Code | Subject | Credits |
|------|---------|---------|
| CSE501 | Artificial Intelligence | 3 |
| CSE502 | Cloud Computing | 3 |
| CSE503 | Computer Vision | 3 |

### Labs:
| Code | Lab | Credits |
|------|-----|---------|
| CSP501 | ML Lab | 2 |
| CSP502 | CN Lab | 2 |
| CSP503 | Mini Project | 2 |
| CSP504 | DBMS Lab | 2 |

**Total Credits: 35**`,
      sources: [
        { id: 's-syl1', title: 'WCE Syllabus CSE TY 2024.pdf', page: 1, excerpt: 'TY CSE Semester V subject list and credit structure', category: 'Syllabus' },
        { id: 's-syl2', title: 'WCE Syllabus CSE TY 2024.pdf', page: 5, excerpt: 'Elective subjects available for Semester V', category: 'Syllabus' },
      ],
    },
  },
  {
    keywords: ['fee', 'fees', 'fee structure', 'tuition', 'how much', 'cost'],
    response: {
      content: `## WCE Fee Structure 2024-25

### Engineering (BE/BTech):
| Category | Annual Fee |
|---------|-----------|
| General Category | ₹1,52,000 |
| OBC Category | ₹1,20,000 |
| SC/ST Category | ₹76,000 |

### Additional Fees:
| Fee | Amount |
|-----|--------|
| Examination Fee | ₹2,000/semester |
| Library Fee | ₹500/year |
| Hostel (if applicable) | ₹45,000/year |
| Mess Fee | ₹32,000/year |

### Payment:
- **1st Installment:** At admission time
- **2nd Installment:** November 15, 2024

Pay online via ERP portal: erp.wce.ac.in | Contact: accounts@wce.ac.in`,
      sources: [
        { id: 's-fee1', title: 'Fee Structure 2024-25.pdf', page: 1, excerpt: 'Annual fee structure for engineering programs by category', category: 'Administrative' },
      ],
    },
  },
  {
    keywords: ['scholarship', 'scholarships', 'financial aid', 'ebc', 'obc scholarship', 'merit scholarship'],
    response: {
      content: `## Scholarship Information – WCE Sangli

### Available Scholarships:
| Scholarship | Eligibility | Deadline |
|------------|------------|----------|
| EBC Scholarship | Economically Backward Class | Nov 15, 2024 |
| OBC Post-Matric | OBC Category | Nov 15, 2024 |
| SC/ST Scholarship | SC/ST Category | Nov 15, 2024 |
| Minority Scholarship | Minority Communities | Nov 15, 2024 |
| Merit Scholarship | Top 10% by CGPA | Nov 30, 2024 |

### How to Apply:
1. Visit Maharashtra Scholarship Portal (mahadbt.gov.in)
2. Collect required documents (income certificate, caste certificate, marksheets)
3. Submit to college scholarship section

**Contact:** scholarship@wce.ac.in | Room No. 12, Admin Block`,
      sources: [
        { id: 's-sch1', title: 'WCE Scholarship Guidelines.docx', page: 1, excerpt: 'List of available scholarships and eligibility criteria', category: 'Administrative' },
      ],
    },
  },
  {
    keywords: ['library', 'library timing', 'library hours', 'books', 'library fine'],
    response: {
      content: `## WCE Library – Information

### 📚 Library Hours:
| Day | Timing |
|-----|--------|
| Monday – Friday | 8:00 AM – 8:00 PM |
| Saturday | 9:00 AM – 5:00 PM |
| Sunday | Closed |

### Book Borrowing Rules:
- Students: Max **4 books** for **14 days**
- Faculty: Max **8 books** for **30 days**
- Fine for overdue: **₹2 per book per day**

### 🖥️ Digital Resources:
- IEEE Xplore (campus network)
- NPTEL Video Lectures
- DELNET Inter-Library Services
- e-Books and e-Journals

**Librarian:** Mr. Pramod Wagh | library@wce.ac.in`,
      sources: [
        { id: 's-lib1', title: 'Library Rules and Catalog 2024.pdf', page: 1, excerpt: 'Library timings, book borrowing rules and fines', category: 'Rules & Policies' },
      ],
    },
  },
  {
    keywords: ['placement', 'placements', 'companies', 'recruitment', 'job', 'internship', 'tcs', 'infosys'],
    response: {
      content: `## Campus Placements 2024 – WCE Sangli

### Upcoming Drives:
| Company | Date | Eligibility |
|---------|------|------------|
| Infosys | Nov 5–6, 2024 | CGPA ≥ 6.0, No backlogs |
| TCS | Nov 8–9, 2024 | CGPA ≥ 6.5, No backlogs |
| Wipro | Nov 18, 2024 | CGPA ≥ 6.0 |
| Cognizant | Nov 25, 2024 | CGPA ≥ 6.0 |

### Past Placement Statistics (2023-24):
- **Highest Package:** ₹18 LPA (Google)
- **Average Package:** ₹6.8 LPA
- **Students Placed:** 328 out of 412

### Process:
1. Register at T&P Cell
2. Attend pre-placement talks
3. Aptitude Test → GD → Technical Interview → HR Interview

**T&P Cell:** placement@wce.ac.in | Ext: 301`,
      sources: [
        { id: 's-pl1', title: 'Placement Policy 2024.pdf', page: 1, excerpt: 'Campus recruitment details and company schedules', category: 'Placement' },
      ],
    },
  },
  {
    keywords: ['anti-ragging', 'ragging', 'complaint', 'harassment'],
    response: {
      content: `## Anti-Ragging Policy – WCE Sangli

### 🚫 Zero Tolerance Policy

WCE strictly prohibits all forms of ragging as per UGC regulations.

### Report Ragging:
| Method | Contact |
|--------|---------|
| Online Portal | antiragging.wce.ac.in |
| Helpline | 0233-XXXXXXX (24/7) |
| Email | antiragging@wce.ac.in |
| Committee | Room No. 1, Admin Block |

### Consequences:
- Immediate suspension
- FIR with police
- Expulsion from college
- Permanent academic record impact

### Anti-Ragging Committee:
- **Chairman:** Principal, WCE
- **Warden:** Hostel Warden

All complaints are **strictly confidential**.`,
      sources: [
        { id: 's-ar1', title: 'WCE Anti-Ragging Policy.pdf', page: 1, excerpt: 'Anti-ragging policy, reporting mechanisms and consequences', category: 'Rules & Policies' },
      ],
    },
  },
  {
    keywords: ['attendance', 'attendance requirement', 'minimum attendance', 'proxy'],
    response: {
      content: `## Attendance Policy – WCE Sangli

### Minimum Attendance Requirement:
- **Theory lectures:** 75%
- **Laboratory sessions:** 75%
- **Tutorial sessions:** 75%

> ⚠️ Students with less than 75% attendance will NOT be allowed to appear for end-semester examinations.

### Attendance Shortage:
Students with 65–74% attendance may apply for condonation with valid medical certificates.

### Medical Leave:
- Submit medical certificate within 7 days of rejoining
- Contact your class teacher/mentor

### Check Attendance:
Login to ERP portal: erp.wce.ac.in → Student Dashboard → Attendance`,
      sources: [
        { id: 's-att1', title: 'WCE Syllabus CSE TY 2024.pdf', page: 2, excerpt: 'Attendance requirements and condonation policy', category: 'Syllabus' },
      ],
    },
  },
  {
    keywords: ['principal', 'college administration', 'who is principal', 'vice principal'],
    response: {
      content: `## WCE Sangli – Administration

### Leadership Team:
| Position | Name | Email |
|---------|------|-------|
| **Principal** | Dr. D.G. Ganage | principal@wce.ac.in |
| **Vice Principal** | Dr. A.B. Bhosle | vp@wce.ac.in |
| **Dean Academics** | Dr. S.R. Patil | dean.acad@wce.ac.in |
| **Dean Student Affairs** | Prof. R.K. Joshi | dean.sa@wce.ac.in |
| **Registrar** | Mr. A.P. More | registrar@wce.ac.in |

### College Address:
Walchand College of Engineering
Vishrambag, Sangli – 416415
Maharashtra, India

**Phone:** 0233-2702108
**Website:** www.walchandsangli.ac.in`,
      sources: [
        { id: 's-adm1', title: 'Faculty Directory 2024-25.docx', page: 1, excerpt: 'College administration and leadership team contacts', category: 'Faculty' },
      ],
    },
  },
  {
    keywords: ['technova', 'tech fest', 'annual fest', 'festival', 'event'],
    response: {
      content: `## Technova 2024 – WCE Annual Technical Fest

### 🎉 November 14–16, 2024

### Events:
| Event | Description | Registration Fee |
|-------|-------------|-----------------|
| Code Rush | Competitive Programming | ₹200 |
| RoboWars | Robotics Battle | ₹300 |
| Paper Presentation | Research Paper Presentation | ₹150 |
| Project Expo | Final Year Project Display | Free |
| Hackathon (24hr) | Non-stop coding challenge | ₹500/team |
| Quiz Competition | Technical Quiz | ₹100 |

### Venue: WCE Campus, Sangli
### Registration: technova.wce.ac.in

🏆 **Prize Pool: ₹2,00,000+**

Contact: technova@wce.ac.in | Student Council`,
      sources: [
        { id: 's-ev1', title: 'Exam Schedule Nov 2024.pdf', page: 2, excerpt: 'Technova 2024 event details and registration', category: 'Events' },
      ],
    },
  },
  {
    keywords: ['nptel', 'online course', 'mooc', 'certificate'],
    response: {
      content: `## NPTEL Online Courses – WCE

### Current Enrollment Period: July–November 2024

### Recommended Courses for CSE:
| Course | Institute | Duration |
|--------|---------|----------|
| Intro to Machine Learning | IIT Madras | 12 weeks |
| Computer Networks | IIT Kharagpur | 8 weeks |
| Cloud Computing | IIT Kharagpur | 12 weeks |
| Data Science for Engineers | IIT Madras | 12 weeks |
| Python for Data Science | IIT Madras | 8 weeks |

### Benefits:
- Industry-recognized certificates
- Credit transfer possible
- Proctored exams at WCE center

### Enrollment:
1. Register at nptel.ac.in
2. Enroll in courses (deadline: Nov 10, 2024)
3. Proctored exam: January 2025

Contact: academic@wce.ac.in`,
      sources: [
        { id: 's-np1', title: 'WCE Scholarship Guidelines.docx', page: 3, excerpt: 'NPTEL online course enrollment details', category: 'Administrative' },
      ],
    },
  },
  {
    keywords: ['machine learning', 'ml', 'what is ml', 'ml subject'],
    response: {
      content: `## Machine Learning (CSL501) – TY CSE

### Subject Overview:
Machine Learning is a core subject in TY CSE Semester V focused on algorithms that enable computers to learn from data.

### Topics Covered:
- **Unit 1:** Introduction to ML, Types of Learning
- **Unit 2:** Regression Analysis (Linear, Logistic)
- **Unit 3:** Classification Algorithms (SVM, Decision Trees, Random Forest)
- **Unit 4:** Neural Networks & Deep Learning basics
- **Unit 5:** Clustering (K-Means, DBSCAN)
- **Unit 6:** Feature Engineering & Model Evaluation

### Faculty: Dr. Suresh Jadhav
### Credits: 4 (Theory) + 2 (Lab)

### Marks Distribution:
| Component | Marks |
|-----------|-------|
| End Semester Exam | 60 |
| Mid Semester Exam | 20 |
| Assignments/Lab | 20 |`,
      sources: [
        { id: 's-ml1', title: 'WCE Syllabus CSE TY 2024.pdf', page: 12, excerpt: 'Machine Learning subject syllabus, unit-wise topics', category: 'Syllabus' },
      ],
    },
  },
  {
    keywords: ['sports', 'sports day', 'cricket', 'football', 'basketball', 'games'],
    response: {
      content: `## WCE Sports – Annual Sports Day 2024

### 🏆 November 22, 2024

### Events:
**Athletics:**
- 100m, 200m, 400m, 1500m Dash
- Long Jump, High Jump, Shot Put

**Team Sports:**
- Cricket, Football, Volleyball

**Indoor Games:**
- Badminton, Table Tennis, Chess, Carrom

### Registration:
- Deadline: **November 10, 2024**
- Contact your class sports representative
- Email: sports@wce.ac.in

### Facilities at WCE:
- Cricket Ground, Football Field
- Indoor Sports Complex
- Swimming Pool (seasonal)
- Gymnasium`,
      sources: [
        { id: 's-sp1', title: 'Faculty Directory 2024-25.docx', page: 8, excerpt: 'Sports facilities and annual sports day information', category: 'Faculty' },
      ],
    },
  },
  {
    keywords: ['wi-fi', 'wifi', 'internet', 'network access', 'campus network'],
    response: {
      content: `## Campus Wi-Fi & Internet – WCE

### Network Access:
- **SSID:** WCE-Student / WCE-Faculty
- **Authentication:** Use your college ERP credentials
- **Coverage:** Academic blocks, library, canteen, hostel

### Bandwidth:
- Students: 5 Mbps per device (shared)
- Faculty: 10 Mbps per device
- Research Lab: Dedicated 1 Gbps

### Usage Policy:
- ✅ Permitted: Academic research, IEEE access, NPTEL, YouTube
- ❌ Restricted: Torrents, gaming, unauthorized streaming
- 📋 All traffic is monitored and logged

### Hostel Wi-Fi:
Available from **6 AM to 11 PM** daily.

**IT Support:** it@wce.ac.in | Room 15, Main Building`,
      sources: [
        { id: 's-wifi1', title: 'Hostel Rules and Regulations 2024.pdf', page: 6, excerpt: 'Campus network usage policy and hostel Wi-Fi', category: 'Rules & Policies' },
      ],
    },
  },
  {
    keywords: ['canteen', 'food', 'mess', 'cafeteria', 'eating'],
    response: {
      content: `## WCE Canteen & Mess Information

### 🍽️ Main Canteen:
**Location:** Ground floor, Main Building
**Timings:** 8:00 AM – 6:00 PM (Mon–Sat)

### Menu (Sample):
| Item | Price |
|------|-------|
| Tea / Coffee | ₹10 |
| Vada Pav | ₹15 |
| Samosa | ₹10 |
| Thali (Lunch) | ₹60 |
| Cold Drinks | ₹30 |

### Hostel Mess:
| Meal | Time |
|------|------|
| Breakfast | 7:00 – 8:30 AM |
| Lunch | 12:00 – 2:00 PM |
| Evening Snacks | 5:30 – 6:30 PM |
| Dinner | 7:30 – 9:30 PM |

*Note: The mess operates on a monthly subscription basis for hostel students.*`,
      sources: [
        { id: 's-can1', title: 'Hostel Rules and Regulations 2024.pdf', page: 4, excerpt: 'Hostel mess timings and canteen information', category: 'Rules & Policies' },
      ],
    },
  },
  {
    keywords: ['erp', 'portal', 'login portal', 'student portal', 'online portal'],
    response: {
      content: `## WCE ERP Portal

### 🌐 Access: erp.wce.ac.in

### Features Available:
| Feature | Description |
|---------|-------------|
| Attendance | View subject-wise attendance |
| Results | Marks & grade cards |
| Timetable | Class schedule |
| Fees | Payment history and dues |
| Hall Ticket | Download examination hall ticket |
| Notices | Official college notices |
| Library | Book issue status |

### Login:
- **Username:** Your PRN number (e.g., 2021BCS001)
- **Password:** Set during registration (default: DOB in DDMMYYYY format)

### Forgot Password:
Contact IT department: it@wce.ac.in or Room 15, Main Building

> 💡 Use Google Chrome or Firefox for best experience.`,
      sources: [
        { id: 's-erp1', title: 'Faculty Directory 2024-25.docx', page: 7, excerpt: 'ERP portal features and login instructions', category: 'Administrative' },
      ],
    },
  },
  {
    keywords: ['result', 'results', 'marks', 'grade', 'cgpa', 'sgpa'],
    response: {
      content: `## Examination Results – WCE

### Mid Semester Exam (October 2024):
Results have been **declared** ✅

Check at: erp.wce.ac.in → Results

### Grading System:
| Grade | Marks Range | Points |
|-------|------------|--------|
| O | 91–100 | 10 |
| A+ | 81–90 | 9 |
| A | 71–80 | 8 |
| B+ | 61–70 | 7 |
| B | 51–60 | 6 |
| C | 41–50 | 5 |
| F | Below 40 | 0 |

### For Revaluation:
- Apply within **7 days** of result declaration
- Fee: ₹200 per subject
- Submit at Examination Department

**Contact:** examination@wce.ac.in`,
      sources: [
        { id: 's-res1', title: 'Exam Schedule Nov 2024.pdf', page: 5, excerpt: 'Grading system and result checking procedure', category: 'Examination' },
      ],
    },
  },
  {
    keywords: ['faculty', 'professor', 'teacher', 'staff', 'contact faculty'],
    response: {
      content: `## CSE Department Faculty – WCE Sangli

| Name | Designation | Specialization | Email |
|------|------------|----------------|-------|
| Dr. Suresh Jadhav | HOD & Prof. | Machine Learning, AI | suresh.j@wce.ac.in |
| Prof. Anita More | Associate Prof. | Computer Networks | anita.m@wce.ac.in |
| Dr. Vijay Kulkarni | Assistant Prof. | Databases, Big Data | vijay.k@wce.ac.in |
| Prof. Rekha Patil | Assistant Prof. | Software Engineering | rekha.p@wce.ac.in |
| Prof. Sandeep Gawade | Assistant Prof. | Cloud, DevOps | sandeep.g@wce.ac.in |

### Faculty Office Hours:
Monday – Friday: 4:00 PM – 5:00 PM (or by appointment)

For full faculty list, refer to the Faculty Directory or visit wce.ac.in`,
      sources: [
        { id: 's-fac2', title: 'Faculty Directory 2024-25.docx', page: 2, excerpt: 'CSE department faculty list with designations and contact', category: 'Faculty' },
      ],
    },
  },
  {
    keywords: ['project', 'mini project', 'final year project', 'fyp', 'be project'],
    response: {
      content: `## Project Guidelines – WCE CSE

### TY Mini Project (CSP503):
- **Duration:** Full semester (Sem V)
- **Team Size:** 3–4 students
- **Credits:** 2
- **Guide:** Assigned by department

### BE Final Year Project (CSP601 + CSP602):
- **Duration:** Both BE semesters
- **Team Size:** 3–4 students  
- **Credits:** 6 (total)
- **Domains:** AI/ML, Web/App Dev, Networking, Data Science

### Milestones:
| Milestone | Timeline |
|-----------|----------|
| Topic Selection | August Week 1 |
| Proposal Submission | August Week 3 |
| Mid-Review 1 | October |
| Mid-Review 2 | December |
| Final Presentation | March/April |

### Rules:
- Open source tools only (no plagiarism)
- Weekly guide meetings mandatory
- Minimum 2 publications encouraged`,
      sources: [
        { id: 's-proj1', title: 'WCE Syllabus CSE TY 2024.pdf', page: 20, excerpt: 'Mini project and final year project guidelines', category: 'Syllabus' },
      ],
    },
  },
  {
    keywords: ['hall ticket', 'admit card', 'download hall ticket'],
    response: {
      content: `## Hall Ticket – Examination

### 📄 Download Hall Ticket:

**Available from:** November 10, 2024

### Steps:
1. Login to erp.wce.ac.in
2. Go to **Examination → Hall Ticket**
3. Verify your details
4. Download and print (A4 size, color preferred)

### Requirements to get Hall Ticket:
| Requirement | Status Check |
|------------|-------------|
| Minimum 75% attendance | ERP attendance module |
| Fees paid (all installments) | Accounts clearance |
| Library books returned | Library clearance |
| No disciplinary action pending | Admin clearance |

> ⚠️ Students with clearance issues must resolve them before November 9, 2024

**Examination Department:** examination@wce.ac.in`,
      sources: [
        { id: 's-ht1', title: 'Exam Schedule Nov 2024.pdf', page: 2, excerpt: 'Hall ticket download process and eligibility requirements', category: 'Examination' },
      ],
    },
  },
  {
    keywords: ['about wce', 'about walchand', 'college history', 'when was wce founded', 'wce ranking'],
    response: {
      content: `## About Walchand College of Engineering, Sangli

### 🏛️ Overview:
**Walchand College of Engineering (WCE)** is one of the oldest and most prestigious engineering colleges in Maharashtra, established in **1947** by Seth Walchand Hirachand.

### Accreditation & Rankings:
- **NAAC Grade:** A+ (Accredited)
- **NBA Accredited:** CSE, ENTC, Civil, Mechanical
- **Ranked:** NIRF Top 100 Engineering Colleges
- **Affiliated to:** Shivaji University, Kolhapur

### Programs Offered:
| Program | Branches |
|---------|---------|
| B.E. (4 years) | CSE, ENTC, Civil, Mechanical |
| M.E. (2 years) | CSE, ENTC, Civil, Structural |
| Ph.D. | All departments |

### Campus:
- Area: 12 acres
- Location: Vishrambag, Sangli – 416415
- Website: www.walchandsangli.ac.in`,
      sources: [
        { id: 's-ab1', title: 'Faculty Directory 2024-25.docx', page: 1, excerpt: 'College overview, history and accreditation details', category: 'Administrative' },
      ],
    },
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'what can you do', 'who are you'],
    response: {
      content: `# 👋 Welcome to CampusMind!

I'm your AI assistant for **Walchand College of Engineering, Sangli**. I can help you with:

### 📚 Academic:
- Timetables & schedules
- Syllabus and subject information
- Exam dates and hall tickets
- Results and grading

### 🏛️ Campus:
- Faculty and HOD information
- College rules and policies
- Hostel rules and timings
- Library information

### 💼 Administrative:
- Fee structure and payment
- Scholarships and financial aid
- Placements and recruitment
- ERP portal guidance

### 🎉 Events:
- Technova and cultural fests
- Sports events
- Guest lectures

**Try asking:** *"What is today's TY CSE timetable?"* or *"When is the exam schedule?"*`,
      sources: [],
    },
  },
];

function getDefaultResponse(query: string): BotResponse {
  return {
    content: `I couldn't find specific information about **"${query}"** in the knowledge base.

### You might want to:
- 📞 Contact the relevant department directly
- 🌐 Check the college website: www.walchandsangli.ac.in
- 📧 Email: info@wce.ac.in
- 🖥️ Login to ERP: erp.wce.ac.in

### Or try asking about:
- Timetables, exam schedules, syllabus
- Faculty and HOD information
- Hostel rules and fees
- Placements and scholarships

*This answer could not be retrieved from available documents. The admin team has been notified.*`,
    sources: [],
  };
}

export function getMockBotResponse(query: string): BotResponse {
  const lowerQuery = query.toLowerCase();
  
  for (const pair of qaPairs) {
    if (pair.keywords.some(kw => lowerQuery.includes(kw))) {
      return pair.response;
    }
  }
  
  return getDefaultResponse(query);
}

export function streamMockResponse(
  content: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  chunkSize = 3,
  delay = 30
): () => void {
  let i = 0;
  let cancelled = false;
  
  const stream = () => {
    if (cancelled) return;
    if (i < content.length) {
      const end = Math.min(i + chunkSize, content.length);
      onChunk(content.slice(i, end));
      i = end;
      setTimeout(stream, delay);
    } else {
      onComplete();
    }
  };
  
  setTimeout(stream, 50);
  
  return () => { cancelled = true; };
}
