import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private jwtService: JwtService,
        private databaseService: DatabaseService,
        private configService: ConfigService,
    ) { }
    private readonly logger = new CustomLoggerService(AuthService.name);

    /**
     * Converts JWT expiresIn format (e.g., '24h', '7d', '60s') to milliseconds
     * @param expiresIn - The expiresIn string from JWT config
     * @returns Number of milliseconds
     */
    private parseExpiresIn(expiresIn: string): number {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            // Default to 24 hours if format is invalid
            return 24 * 60 * 60 * 1000;
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        const units: Record<string, number> = {
            's': 1000,           // seconds
            'm': 60 * 1000,      // minutes
            'h': 60 * 60 * 1000, // hours
            'd': 24 * 60 * 60 * 1000, // days
        };

        return value * units[unit];
    }

    /**
     * Gets the token expiration date based on JWT configuration
     * @returns Date object representing when the token expires
     */
    private getTokenExpirationDate(): Date {
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
        const expiresInMs = this.parseExpiresIn(expiresIn);
        return new Date(Date.now() + expiresInMs);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signIn(email: string, password: string): Promise<{ token: string }> {
        const user = await this.usersService.findByEmail(email)
        
        if (!user) {
            this.logger.log('USER NOT FOUND')
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            this.logger.log('password did not match!')
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...payload } = user;
        const token = await this.jwtService.signAsync(payload)

        // Save the token to the database with expiration matching JWT config
        const expiresAt = this.getTokenExpirationDate();
        await this.saveToken(user.id, token, expiresAt);

        return { ...payload, token }
    }

    async signUp(user:Prisma.UserCreateInput): Promise<{}> {
        return this.usersService.create(user)
    }

    /**
     * Saves a token to the database for a specific user
     * @param userId - The ID of the user
     * @param tokenValue - The token string to save
     * @param expiresAt - Optional expiration date for the token
     * @returns The created token record
     */
    async saveToken(userId: number, tokenValue: string, expiresAt?: Date) {
        try {
            const token = await this.databaseService.token.create({
                data: {
                    userId,
                    tokenValue,
                    expiresAt: expiresAt || null,
                }
            });
            this.logger.log(`Token saved for user ${userId}`);
            return token;
        } catch (error) {
            this.logger.error(`Failed to save token for user ${userId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves all tokens for a specific user
     * @param userId - The ID of the user
     * @returns Array of tokens for the user
     */
    async getUserTokens(userId: number) {
        return this.databaseService.token.findMany({
            where: { userId }
        });
    }

    /**
     * Deletes a specific token
     * @param userId - The ID of the user
     * @param tokenValue - The token string to delete
     */
    async deleteToken(userId: number, tokenValue: string) {
        try {
            await this.databaseService.token.delete({
                where: {
                    userId_tokenValue: {
                        userId,
                        tokenValue
                    }
                }
            });
            this.logger.log(`Token deleted for user ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to delete token: ${error.message}`);
            throw error;
        }
    }

    /**
     * Deletes all tokens for a specific user (useful for logout from all devices)
     * @param userId - The ID of the user
     */
    async deleteAllUserTokens(userId: number) {
        try {
            await this.databaseService.token.deleteMany({
                where: { userId }
            });
            this.logger.log(`All tokens deleted for user ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to delete user tokens: ${error.message}`);
            throw error;
        }
    }
}
