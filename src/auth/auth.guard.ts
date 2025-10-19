import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { Request } from "express"
import { DatabaseService } from "@/database/database.service";
import { CustomLoggerService } from "@/custom-logger/custom-logger.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
    ) { }

    private readonly logger = new CustomLoggerService(AuthGuard.name);


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            // verify the token is valid
            const payload = await this.jwtService.verifyAsync(
                token,
                { secret: this.configService.get<string>('JWT_SECRET') }
            );

            // verify the token exists and it is associated to a user
            const user = await this.databaseService.user.findMany({
                where: {
                    tokens: {
                        some: {
                            tokenValue: token
                        }
                    }
                }
            });

            // checks we found the token, and such token matched the payload id and the user's id
            if(!user || !user.length || user[0].id !== payload.id) {
                this.logger.log('INVALID SESSION!!!!')
                throw new UnauthorizedException('Invalid session');
            }

            request['user'] = { ...payload, token };
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined
    }
}
