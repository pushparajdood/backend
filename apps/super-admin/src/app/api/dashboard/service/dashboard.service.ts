import { Injectable } from '@nestjs/common';
import {  DashboardResponse } from '../dto/create-dashboard.dto';
import { TenantRepository, toNumber, UsersRepository } from '@lms-backend/libs';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly userRepo: UsersRepository,
  ) { }

  async getDashboard() {
    const tenantActive = await this.tenantRepo.finds({ isActive: true });
    const tenantInActive = await this.tenantRepo.finds({ isActive: true });

    const totalActivetenant : number = tenantActive.length  ?? 0;
    const totalInActivetenant : number = tenantInActive.length  ?? 0;
    const totalOveralltenant : number = totalActivetenant + totalInActivetenant;
    
    const schoolPercentage = (totalActivetenant / totalOveralltenant) * 100;

    const totalSchool = {
      active: toNumber(totalActivetenant),
      inActive: toNumber(totalInActivetenant),
      total: toNumber(tenantActive.length + tenantInActive.length)
        .toLocaleString(),
      schoolPercentage: toNumber(schoolPercentage)
    };

    const userActive = await this.userRepo.finds({ isActive: true });
    const userInActive = await this.userRepo.finds({ isActive: true });
    
    const totalActiveuser : number = userActive.length ?? 0;
    const totalInActiveuser : number = userInActive.length ?? 0;
    const totalOveralluser : number = totalActiveuser + totalInActiveuser;
    
    const userPercentage = (totalActiveuser / totalOveralluser) * 100;

    const totalUser = {
      active: toNumber(totalActiveuser),
      inActive: toNumber(totalInActiveuser),
      total: toNumber(totalOveralluser),
      userPercentage:toNumber(userPercentage),
    };



    const activeClasses = {
      active: '1,161',
      inActive: '1',
      total: '1,162',
    };

    const alert = {
      active: '18',
      inActive: '5',
      total: '23',
    };

    // const userManagement = await this.userRepo.findMany({ take: 3,select:{
    //   firstName:true,
    //   lastName:true,
      
    // } });

    const userManagement = [
      { name: 'Choetho David', role: 'Teacher', status: 'active' },
      { name: 'Sarah Johnson', role: 'Principal', status: 'active' },
      { name: 'Michael Chen', role: 'Teacher', status: 'in active' },
    ];

    const tenantManagement = await this.tenantRepo.findMany({ take: 3,select:{
      name:true,
      state:true,
      status:true,
      created_at:true
    } });

    // const tenantManagement = [
    //   { name: 'Green Valley International School', state: 'Bengaluru, KA', status: 'active', date: '2025-07-13T00:00:00.000Z' },
    //   { name: 'Sunrise Academy', state: 'Mumbai, MH', status: 'active', date: '2025-07-15T00:00:00.000Z' },
    //   { name: 'Cambridge Public School', state: 'Delhi, DL', status: 'active', date: '2025-07-18T00:00:00.000Z' },
    // ];

    const quickNotification = [
      { title: 'Scheduled Maintenance', description: 'System maintenance scheduled for tonight 11 PM - 2 AM', timingStatus: '2025-07-21T03:47:00.000Z' },
      { title: 'Upcoming Exam Audit', description: 'Annual examination audit for Green Valley School on July 20', timingStatus: '2025-07-21T01:47:00.000Z' },
      { title: 'System Warning', description: 'High server load detected in Mumbai region', timingStatus: '2025-07-20T23:47:00.000Z' },
    ];

    const aiSummaryAssistant = [
      { title: 'Weekly Performance Summary', priority: 'high', detail: '3 schools had 40% drop in attendance this week', action: 'Investigate attendance patterns' },
      { title: 'Resource Utilization', priority: 'medium', detail: 'Server capacity at 85% - consider scaling', action: 'Schedule infrastructure review' },
      { title: 'User Engagement', priority: 'low', detail: 'Mobile app usage increased by 25%', action: 'Optimize mobile experience' },
    ];

    const distribution = [
      { role: 'Teachers', percentage: 45 },
      { role: 'Students', percentage: 35 },
      { role: 'Parents', percentage: 20 },
    ];

    const ticketTracker = [
      { issue: 'Login Issues', status: 'Open', school: 'Green Valley International', reported: '2025-07-21T03:48:00.000Z', priority: 'high' },
      { issue: 'Feature Request: Bulk Upload', status: 'In Progress', school: "St. Mary's School", reported: '2025-07-20T05:48:00.000Z', priority: 'medium' },
      { issue: 'Performance Optimization', status: 'Resolved', school: 'Delhi Public School', reported: '2025-07-18T05:48:00.000Z', priority: 'low' },
      { issue: 'Mobile App Crash', status: 'Open', school: 'Cambridge School', reported: '2025-07-21T00:48:00.000Z', priority: 'high' },
    ];

    return {
      totalSchool,
      totalUser,
      activeClasses,
      alert,
      userManagement,
      tenantManagement,
      quickNotification,
      aiSummaryAssistant,
      totalUsers: totalUser.total,
      distribution,
      ticketTracker,
    };
  }
}
