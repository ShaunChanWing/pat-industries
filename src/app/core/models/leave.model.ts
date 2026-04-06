export interface LeaveRequest {
  id?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason?: string;
  userId: string;
}