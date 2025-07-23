import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
import {  DashboardResponse } from '../dto/create-dashboard.dto';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  async dashboard(){
    return await this.dashboardService.getDashboard();
  }
}
