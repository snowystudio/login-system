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
  private readonly BCRYPT_COST = 12; // bcrypt 加密成本因子

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 创建新用户（注册）
   * @param email 用户邮箱
   * @param password 明文密码
   * @returns 创建的用户信息（不含密码）
   */
  async create(email: string, password: string) {
    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    // bcrypt 加密密码（cost=12）
    const passwordHash = await bcrypt.hash(password, this.BCRYPT_COST);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return this.sanitizeUser(user);
  }

  /**
   * 通过邮箱查找用户
   * @param email 用户邮箱
   * @returns 用户信息（含密码哈希，用于登录验证）
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * 通过 GitHub ID 查找用户
   * @param githubId GitHub 用户 ID
   * @returns 用户信息
   */
  async findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({
      where: { githubId },
    });
  }

  /**
   * 通过 ID 查找用户
   * @param id 用户 ID
   * @returns 用户信息
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.sanitizeUser(user);
  }

  /**
   * 验证密码
   * @param password 明文密码
   * @param passwordHash 加密后的密码哈希
   * @returns 验证结果
   */
  async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * 清理用户数据（移除敏感信息）
   * @param user 原始用户对象
   * @returns 清理后的用户对象
   */
  private sanitizeUser(user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * 关闭 Prisma 连接（应用关闭时调用）
   */
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
