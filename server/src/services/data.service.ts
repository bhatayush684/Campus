import { ScrapedData } from './scraper.service.js';

export interface ProcessedData {
  notices: Notice[];
  timetables: Timetable[];
  faculty: Faculty[];
  departments: Department[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  sourceUrl: string;
}

export interface Timetable {
  id: string;
  department: string;
  year: string;
  division: string;
  schedule: ScheduleItem[];
  sourceUrl: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  designation: string;
  email?: string;
  phone?: string;
  sourceUrl: string;
}

export interface Department {
  id: string;
  name: string;
  head?: string;
  description: string;
  programs: string[];
  sourceUrl: string;
}

export class DataService {
  /**
   * Process scraped data and extract structured information
   */
  processData(scrapedData: ScrapedData[]): ProcessedData {
    const processed: ProcessedData = {
      notices: [],
      timetables: [],
      faculty: [],
      departments: [],
    };

    for (const data of scrapedData) {
      // Extract notices
      if (data.url.includes('notice') || data.url.includes('news')) {
        const notices = this.extractNotices(data);
        processed.notices.push(...notices);
      }

      // Extract timetables
      if (data.url.includes('timetable') || data.url.includes('exam')) {
        const timetables = this.extractTimetables(data);
        processed.timetables.push(...timetables);
      }

      // Extract faculty info
      if (data.url.includes('faculty') || data.url.includes('staff')) {
        const faculty = this.extractFaculty(data);
        processed.faculty.push(...faculty);
      }

      // Extract department info
      if (data.url.includes('department')) {
        const departments = this.extractDepartments(data);
        processed.departments.push(...departments);
      }
    }

    return processed;
  }

  /**
   * Extract notices from scraped content
   */
  private extractNotices(data: ScrapedData): Notice[] {
    const notices: Notice[] = [];
    const lines = data.content.split('\n');
    
    let currentNotice: Partial<Notice> | null = null;

    for (const line of lines) {
      // Simple pattern matching - in production, use more sophisticated NLP
      if (line.match(/notice|circular|announcement/i)) {
        if (currentNotice) {
          notices.push(this.completeNotice(currentNotice, data.url));
        }
        currentNotice = {
          title: line.trim(),
          content: '',
          date: new Date(),
          category: 'General',
          sourceUrl: data.url,
        };
      } else if (currentNotice) {
        currentNotice.content += line + '\n';
      }
    }

    if (currentNotice) {
      notices.push(this.completeNotice(currentNotice, data.url));
    }

    return notices;
  }

  /**
   * Extract timetables from scraped content
   */
  private extractTimetables(data: ScrapedData): Timetable[] {
    const lines = data.content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const header = `${data.title} ${data.url}`;
    const department = this.findValue(header, ['CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics']) || 'General';
    const year = this.findValue(header, ['FY', 'SY', 'TY', 'BE']) || 'All';
    const division = this.findValue(header, ['Division A', 'Division B', 'Division C', 'Div A', 'Div B', 'Div C'])
      ?.replace(/.*(?:division|div)\s*/i, '').toUpperCase() || 'All';
    const schedule = lines
      .map(line => line.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\s+(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})\s+(.+?)(?:\s+\|\s*(.+))?$/i))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map(match => ({ day: match[1], time: `${match[2]}-${match[3]}`, subject: match[4].trim(), faculty: match[5]?.trim() || 'Not specified', room: 'Not specified' }));
    return [{ id: this.generateId(), department, year, division, schedule, sourceUrl: data.url }];
  }

  /**
   * Extract faculty information from scraped content
   */
  private extractFaculty(data: ScrapedData): Faculty[] {
    const lines = data.content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const department = this.findValue(`${data.title} ${data.url}`, ['CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics']) || 'General';
    const faculty: Faculty[] = [];
    for (const line of lines) {
        const match = line.match(/^([^|,-]{3,})\s*(?:\||,|-)\s*(Professor|Associate Professor|Assistant Professor|Dean|HOD|Head|Lecturer)\b\s*(?:\||,|-)?\s*(.*)$/i);
        if (!match) continue;
        const email = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
        faculty.push({ id: this.generateId(), name: match[1].trim(), department, designation: match[2].trim(), ...(email ? { email } : {}), sourceUrl: data.url });
    }
    return faculty;
  }

  /**
   * Extract department information from scraped content
   */
  private extractDepartments(data: ScrapedData): Department[] {
    const lines = data.content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const knownDepartments = ['Computer Engineering', 'Information Technology', 'Electronics and Telecommunication', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Artificial Intelligence'];
    return lines
      .filter(line => knownDepartments.some(name => line.toLowerCase().includes(name.toLowerCase())))
      .map(line => {
        const name = knownDepartments.find(value => line.toLowerCase().includes(value.toLowerCase())) || line;
        return { id: this.generateId(), name, description: line, programs: [], sourceUrl: data.url };
      })
      .filter((department, index, all) => all.findIndex(item => item.name === department.name) === index);
  }

  private findValue(value: string, candidates: string[]): string | undefined {
    return candidates.find(candidate => new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(value));
  }

  private completeNotice(notice: Partial<Notice>, url: string): Notice {
    return {
      id: this.generateId(),
      title: notice.title || 'Untitled',
      content: notice.content || '',
      date: notice.date || new Date(),
      category: notice.category || 'General',
      sourceUrl: url,
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const dataService = new DataService();
