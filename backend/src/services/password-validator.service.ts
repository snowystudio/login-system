import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * 密码验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  missingRequirements: string[];
}

/**
 * 密码强度结果
 */
export interface StrengthResult {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  missingRequirements: string[];
}

/**
 * 密码验证服务
 * 提供密码复杂度验证、强度计算、历史密码检查等功能
 */
@Injectable()
export class PasswordValidatorService {
  constructor(private prisma: PrismaService) {}

  /**
   * 验证密码复杂度
   * 要求：8-20 位，包含大写字母、小写字母、数字、特殊字符中的至少 3 种
   */
  validateComplexity(password: string): ValidationResult {
    const errors: string[] = [];
    const missingRequirements: string[] = [];
    let metCount = 0;

    // 长度检查
    if (password.length < 8) {
      errors.push('密码至少 8 位');
      missingRequirements.push('需至少 8 位');
    } else if (password.length > 20) {
      errors.push('密码最多 20 位');
      missingRequirements.push('需最多 20 位');
    } else {
      metCount++;
    }

    // 大写字母检查
    if (/[A-Z]/.test(password)) {
      metCount++;
    } else {
      missingRequirements.push('需包含大写字母');
    }

    // 小写字母检查
    if (/[a-z]/.test(password)) {
      metCount++;
    } else {
      missingRequirements.push('需包含小写字母');
    }

    // 数字检查
    if (/[0-9]/.test(password)) {
      metCount++;
    } else {
      missingRequirements.push('需包含数字');
    }

    // 特殊字符检查
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      metCount++;
    } else {
      missingRequirements.push('需包含特殊字符');
    }

    // 至少满足 3 种字符类型
    if (metCount < 4) { // 长度 + 3 种字符类型
      errors.push('密码需包含大写字母、小写字母、数字、特殊字符中的至少 3 种');
    }

    return {
      valid: errors.length === 0,
      errors,
      missingRequirements,
    };
  }

  /**
   * 计算密码强度
   * 返回强度等级（weak/medium/strong）和分数（0-100）
   */
  calculateStrength(password: string): StrengthResult {
    const requirements = {
      length: password.length >= 8 && password.length <= 20,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const missingRequirements: string[] = [];
    if (!requirements.length) missingRequirements.push('需 8-20 位');
    if (!requirements.uppercase) missingRequirements.push('需包含大写字母');
    if (!requirements.lowercase) missingRequirements.push('需包含小写字母');
    if (!requirements.number) missingRequirements.push('需包含数字');
    if (!requirements.special) missingRequirements.push('需包含特殊字符');

    // 计算分数（0-100）
    let score = 0;
    
    // 长度分数（最多 20 分）
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 5;
    if (password.length >= 16) score += 5;

    // 字符类型分数（每种 15 分，共 60 分）
    if (requirements.uppercase) score += 15;
    if (requirements.lowercase) score += 15;
    if (requirements.number) score += 15;
    if (requirements.special) score += 15;

    // 额外加分（最多 20 分）
    if (password.length >= 12 && Object.values(requirements).filter(Boolean).length >= 4) {
      score += 10;
    }
    if (password.length >= 16 && Object.values(requirements).filter(Boolean).length >= 4) {
      score += 10;
    }

    // 确定强度等级
    let strength: 'weak' | 'medium' | 'strong';
    if (score < 30) {
      strength = 'weak';
    } else if (score < 80) {
      strength = 'medium';
    } else {
      strength = 'strong';
    }

    return {
      strength,
      score: Math.min(score, 100),
      requirements,
      missingRequirements,
    };
  }

  /**
   * 检查密码历史
   * 验证新密码是否与最近 5 次密码重复
   */
  async checkPasswordHistory(userId: string, newPassword: string): Promise<{ valid: boolean; error?: string }> {
    const recentPasswords = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    for (const history of recentPasswords) {
      const isMatch = await bcrypt.compare(newPassword, history.passwordHash);
      if (isMatch) {
        return {
          valid: false,
          error: '不得使用最近 5 次使用过的密码',
        };
      }
    }

    return { valid: true };
  }

  /**
   * 保存密码历史
   * 自动清理超过 5 条的旧记录
   */
  async savePasswordHistory(userId: string, passwordHash: string): Promise<void> {
    // 保存新记录
    await this.prisma.passwordHistory.create({
      data: { userId, passwordHash },
    });

    // 获取所有历史记录
    const allHistory = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // 删除超过 5 条的旧记录
    if (allHistory.length > 5) {
      const toDelete = allHistory.slice(5);
      await this.prisma.passwordHistory.deleteMany({
        where: {
          id: { in: toDelete.map(h => h.id) },
        },
      });
    }
  }

  /**
   * 记录密码修改日志
   */
  async logPasswordChange(
    userId: string,
    changeType: 'manual' | 'reset',
    ipAddress: string,
    userAgent: string,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    await this.prisma.passwordChangeLog.create({
      data: {
        userId,
        changeType,
        ipAddress: this.maskIpAddress(ipAddress),
        userAgent,
        success,
        errorMessage,
      },
    });
  }

  /**
   * 获取密码修改历史
   */
  async getPasswordHistory(userId: string): Promise<any[]> {
    const logs = await this.prisma.passwordChangeLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return logs.map(log => ({
      id: log.id,
      changedAt: log.createdAt,
      ipAddress: log.ipAddress,
      userAgent: this.parseUserAgent(log.userAgent),
      changeType: log.changeType,
      success: log.success,
    }));
  }

  /**
   * 删除密码历史（GDPR 合规）
   */
  async deletePasswordHistory(userId: string): Promise<void> {
    await this.prisma.passwordHistory.deleteMany({ where: { userId } });
    await this.prisma.passwordChangeLog.deleteMany({ where: { userId } });
  }

  /**
   * IP 地址脱敏
   */
  private maskIpAddress(ip: string): string {
    if (!ip || ip === 'unknown') return '***';
    
    // IPv4: 隐藏最后一段
    const ipv4Match = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}$/);
    if (ipv4Match) {
      return ipv4Match[1] + '***';
    }
    
    // IPv6: 简化处理
    if (ip.includes(':')) {
      return ip.substring(0, 4) + ':***';
    }
    
    return '***';
  }

  /**
   * 解析 User-Agent
   */
  private parseUserAgent(userAgent: string): string {
    if (!userAgent || userAgent === 'unknown') return '未知设备';
    
    // 简化解析
    if (userAgent.includes('Chrome')) return 'Chrome 浏览器';
    if (userAgent.includes('Firefox')) return 'Firefox 浏览器';
    if (userAgent.includes('Safari')) return 'Safari 浏览器';
    if (userAgent.includes('Mobile')) return '移动设备';
    
    return '其他设备';
  }
}
