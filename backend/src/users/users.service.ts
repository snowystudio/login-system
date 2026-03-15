import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * 用户服务层
 * 处理用户数据的 CRUD 操作
 */
@Injectable()
export class UsersService {
  private prisma: PrismaClient;
  private readonly BCRYPT_COST = 12;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    const passwordHash = await bcrypt.hash(password, this.BCRYPT_COST);

    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });

    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({ where: { githubId } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user; // 返回完整用户对象（包含 passwordHash）
  }

  async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * 更新密码
   */
  async updatePassword(userId: string, newPasswordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  /**
   * 强制修改密码
   */
  async forcePasswordChange(userId: string, forceChange: boolean, reason?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        forcePasswordChange: forceChange,
        forceChangeReason: reason || null,
      },
    });
  }

  /**
   * 查找重置 Token
   */
  async findResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * 创建重置 Token
   */
  async createResetToken(userId: string, token: string, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });
  }

  /**
   * 标记 Token 为已使用
   */
  async markResetTokenUsed(token: string) {
    return this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }

  /**
   * 删除未过期的旧 Token
   */
  async deleteUnusedResetTokens(userId: string) {
    return this.prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
