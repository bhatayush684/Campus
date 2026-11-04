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
    // Placeholder implementation - would need actual parsing logic
    return [{
      id: this.generateId(),
      department: 'CSE',
      year: 'TY',
      division: 'A',
      schedule: [],
      sourceUrl: data.url,
    }];
  }

  /**
   * Extract faculty information from scraped content
   */
  private extractFaculty(data: ScrapedData): Faculty[] {
    // Placeholder implementation - would need actual parsing logic
    return [];
  }

  /**
   * Extract department information from scraped content
   */
  private extractDepartments(data: ScrapedData): Department[] {
    // Placeholder implementation - would need actual parsing logic
    return [];
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
