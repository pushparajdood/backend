import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async dashboard(){
    return await this.dashboardService.getDashboard();
  }
}
