import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    async validate(payload: any) {
        // You can customize this based on your payload structure
        // For example, return user info or just the payload
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
    constructor() {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.cookies) return null;
                return req.cookies['Authentication'];
            },
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }
}