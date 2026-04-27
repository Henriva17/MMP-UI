import { Role } from "./enums/role";
import { Status } from "./enums/status";


  export interface User {
    id: number;
    fullName: string;
    email: string;
    // password is @JsonIgnore in Java → never sent to frontend
    role: Role;
    status: Status;
    profilePicture: string | null;
    linkedinLink: string | null;
    location: string | null;
    createdAt: string; // Java LocalDateTime → string in JSON (ISO 8601)
  }
  
