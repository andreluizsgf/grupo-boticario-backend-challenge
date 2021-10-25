import { LoginRequest } from "../dtos/AuthDto";

export interface IAuthService {
    login(loginRequest: LoginRequest): Promise<string>
}