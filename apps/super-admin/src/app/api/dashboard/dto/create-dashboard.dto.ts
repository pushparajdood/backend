

export interface DashboardResponse {
  totalSchool: { active: string; inActive: string; total: string };
  totalUser: { active: string; inActive: string; total: string };
  activeClasses: { active: string; inActive: string; total: string };
  alert: { active: string; inActive: string; total: string };
  userManagement: Array<{ name: string; role: string; status: string }>;
  tenantManagement: Array<{ name: string; state: string; status: string; date: Date }>;
  quickNotification: Array<{ title: string; description: string; timingStatus: string }>;
  aiSummaryAssistant: Array<{ title: string; priority: string; detail: string; action: string }>;
  totalUsers: string;
  distribution: Array<{ role: string; percentage: number }>;
  ticketTracker: Array<{ issue: string; status: string; school: string; reported: string; priority: string }>;
}

