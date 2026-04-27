import { Role } from "../enums/role";
import { Status } from "../enums/status";


export interface UserResponse {

        id:number;
        fullName: string;
        email: string;
        role: Role;
        status: Status;
        profilePicture: string;
        createdAt: any;
        /**String profilePicture,
        String linkedinLink,
        String location,
        LocalDateTime createdAt */
}
