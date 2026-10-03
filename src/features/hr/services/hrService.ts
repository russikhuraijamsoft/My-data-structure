import { collection, query, getDocs } from 'firebase/firestore';
import { Employee, Attendance, LeaveRequest, Payroll } from '../models/hr';
import { db } from '../../../core/firebase/firebaseConfig';

class HrService {
  async getEmployees(): Promise<Employee[]> {
    if (!db) {
      return [
        {
          id: 'emp_1',
          employeeId: 'EMP-001',
          firstName: 'Russi',
          lastName: 'Khuraijam',
          email: 'russi.khuraijam@gmail.com',
          phone: '+91 98765 43210',
          department: 'MANAGEMENT',
          designation: 'General Manager & Owner',
          dateOfJoining: '2023-01-15',
          status: 'ACTIVE',
          basicSalary: 65000
        },
        {
          id: 'emp_2',
          employeeId: 'EMP-002',
          firstName: 'Suresh',
          lastName: 'Singh',
          email: 'suresh.s@talkos.in',
          phone: '+91 98765 55555',
          department: 'KITCHEN',
          designation: 'Head Chef',
          dateOfJoining: '2023-04-10',
          status: 'ACTIVE',
          basicSalary: 38000
        },
        {
          id: 'emp_3',
          employeeId: 'EMP-003',
          firstName: 'Bimol',
          lastName: 'Meitei',
          email: 'bimol.m@talkos.in',
          phone: '+91 98765 66666',
          department: 'FRONT_OF_HOUSE',
          designation: 'Senior Cashier & Server',
          dateOfJoining: '2023-06-01',
          status: 'ACTIVE',
          basicSalary: 22000
        }
      ];
    }
    try {
      const q = query(collection(db, 'hr_employees'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [
          {
            id: 'emp_1',
            employeeId: 'EMP-001',
            firstName: 'Russi',
            lastName: 'Khuraijam',
            email: 'russi.khuraijam@gmail.com',
            phone: '+91 98765 43210',
            department: 'MANAGEMENT',
            designation: 'General Manager & Owner',
            dateOfJoining: '2023-01-15',
            status: 'ACTIVE',
            basicSalary: 65000
          },
          {
            id: 'emp_2',
            employeeId: 'EMP-002',
            firstName: 'Suresh',
            lastName: 'Singh',
            email: 'suresh.s@talkos.in',
            phone: '+91 98765 55555',
            department: 'KITCHEN',
            designation: 'Head Chef',
            dateOfJoining: '2023-04-10',
            status: 'ACTIVE',
            basicSalary: 38000
          }
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
    } catch {
      return [];
    }
  }

  async getAttendance(): Promise<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'att_1', employeeId: 'emp_1', employeeName: 'Russi Khuraijam', date: today, clockIn: `${today}T08:30:00Z`, status: 'PRESENT', overtimeHours: 0 },
      { id: 'att_2', employeeId: 'emp_2', employeeName: 'Suresh Singh', date: today, clockIn: `${today}T08:55:00Z`, status: 'PRESENT', overtimeHours: 1.5 },
      { id: 'att_3', employeeId: 'emp_3', employeeName: 'Bimol Meitei', date: today, clockIn: `${today}T09:15:00Z`, status: 'PRESENT', overtimeHours: 0 }
    ];
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return [
      { id: 'l_1', employeeId: 'emp_3', employeeName: 'Bimol Meitei', type: 'CASUAL', startDate: '2026-10-02', endDate: '2026-10-03', reason: 'Family occasion', status: 'PENDING', appliedOn: new Date().toISOString() }
    ];
  }

  async getPayroll(): Promise<Payroll[]> {
    return [
      {
        id: 'pay_1',
        employeeId: 'emp_1',
        employeeName: 'Russi Khuraijam',
        month: 9,
        year: 2026,
        basicPay: 45000,
        hra: 15000,
        allowances: 5000,
        incentives: 5000,
        overtimePay: 0,
        grossEarnings: 70000,
        epfDeduction: 1800,
        esiDeduction: 0,
        professionalTax: 200,
        tds: 2500,
        totalDeductions: 4500,
        netPay: 65500,
        status: 'PAID',
        processedOn: '2026-09-01'
      },
      {
        id: 'pay_2',
        employeeId: 'emp_2',
        employeeName: 'Suresh Singh',
        month: 9,
        year: 2026,
        basicPay: 26000,
        hra: 8000,
        allowances: 4000,
        incentives: 2000,
        overtimePay: 2500,
        grossEarnings: 42500,
        epfDeduction: 1800,
        esiDeduction: 318,
        professionalTax: 200,
        tds: 0,
        totalDeductions: 2318,
        netPay: 40182,
        status: 'PAID',
        processedOn: '2026-09-01'
      }
    ];
  }
}

export const hrService = new HrService();
