import { Role } from "../enums/role"

export interface AuthResponse{
    token: string
    role: Role
    userId:number
    studentId:number;
    companyId: number; 
    fullName: string
}