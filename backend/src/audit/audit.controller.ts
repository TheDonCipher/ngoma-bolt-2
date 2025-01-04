import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SearchAuditLogsDto } from './dto/search-audit-logs.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Search audit logs' })
  async searchLogs(@Query(ValidationPipe) query: SearchAuditLogsDto) {
    return this.auditService.searchLogs(query);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export audit logs' })
  async exportLogs(
    @Query('format') format: 'CSV' | 'JSON',
    @Query(ValidationPipe) filters: SearchAuditLogsDto,
    @Res() res: Response,
  ) {
    const data = await this.auditService.exportLogs(format, filters);
    
    const filename = `audit-logs-${new Date().toISOString()}.${format.toLowerCase()}`;
    
    res.setHeader('Content-Type', format === 'CSV' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(data);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up old audit logs' })
  async cleanupLogs(@Query('retentionDays') retentionDays: number) {
    await this.auditService.cleanupOldLogs(retentionDays);
    return { message: 'Cleanup completed successfully' };
  }
}
