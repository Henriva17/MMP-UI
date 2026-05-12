# Building MMP Using Agile Scrum Methodology

---

## 1. Project Introduction

The **MMP (Match Making Platform)** was developed as part of a 16-week internship using an Agile Scrum methodology.

The goal of the platform is twofold:
- **Students** can search and apply for internship opportunities.
- **Companies** can publish job postings and manage candidates.

The platform is a full-stack web application with role-based functionality, JWT authentication, dashboards, and an application management workflow.

The development followed iterative Agile principles, allowing continuous improvements through feedback cycles between backend and frontend implementation.

---

## 2. Agile Scrum Organization

### Sprint Duration

Each sprint lasted approximately **1.5 weeks**, which allowed:
- Backend implementation
- Frontend integration
- Testing
- Adjustments after mentor feedback

The Agile approach made it possible to progressively deliver working features instead of waiting until the end of the internship.

---

## 3. Project Scope

### In Scope (Implemented Features)

#### Authentication & User Management
- User registration
- Login system
- JWT authentication
- Email and password validation
- Role selection system

#### Student Features
- Student profile completion
- Student dashboard
- View job postings
- Apply to internship opportunities
- View personal applications

#### Company Features
- Company profile completion
- Company dashboard
- Company details management
- Publish job postings
- Manage received applications
- Accept or reject applications

#### Job Management
- Job posting creation
- Job details page
- Application workflow

---

### Out of Scope / Future Features

The following features were identified for future development and intentionally postponed to prioritize the MVP:

| Feature | Reason postponed |
|---|---|
| CV upload system | Requires file storage infrastructure |
| Forgot password / email recovery | Email service integration needed |
| Notifications system | Real-time infrastructure needed |
| Admin dashboard | Out of internship scope |
| Search and filtering | Post-MVP enhancement |
| Real-time messaging | WebSocket complexity |
| AI-based internship matching | Requires ML pipeline |

---

## 4. Sprint Planning & Evolution

### Sprint 1 — Project Foundation & Authentication

**Goal:** Create the technical foundation of the platform.

#### Backend — Spring Boot Setup
```java
// User entity — base account for all roles
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // USER, STUDENT, COMPANY

    private LocalDateTime createdAt;
}
```

#### JWT Authentication
```java
// JWT token generated on login and validated on every request
@Service
public class JwtService {

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
```

#### Angular — Auth Service
```typescript
// Stores token and user info in localStorage after login
login(request: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
    tap((response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId.toString());
      if (response.studentId != null) {
        localStorage.setItem('studentId', response.studentId.toString());
      }
      if (response.companyId != null) {
        localStorage.setItem('companyId', response.companyId.toString());
      }
      localStorage.setItem('fullName', response.fullName);
    })
  );
}
```

#### Challenges
- JWT token management and validation filter setup
- CORS configuration between Spring Boot and Angular
- Angular HTTP interceptor for attaching Bearer token

---

### Sprint 2 — Role Management & Profile Completion

**Goal:** Allow users to choose and complete their role after registration.

#### Key Architecture Decision

> A `User` is the base authentication entity. `Student` and `Company` are separate role-specific profiles linked to `User` via `@OneToOne` with `@MapsId`.

```java
// Student profile — shares primary key with User via @MapsId
@Entity
@Table(name = "student_profiles")
public class Student {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String fieldOfStudy;
    private String university;
    private String bio;

    @ElementCollection
    private Set<String> skills = new HashSet<>();
}
```

```java
// Company profile — same @MapsId pattern
@Entity
@Table(name = "company_profiles")
public class Company {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String domainOfActivity;
    private String description;
    private String websiteLink;
    private int companySize;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
}
```

> **Important note for future developers:** Because `@MapsId` is used, `company.getId()` and `student.getId()` are equal to `user.getId()`. This means `companyRepository.findById(userId)` works directly — there is no separate auto-generated ID.

#### Angular — Role Guard
```typescript
// Protects routes based on role — one guard for all roles
export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    const role = authService.getRole();
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/jobs']);
  };
};

// Usage in routes
{ path: 'jobs/:id/apply', component: ApplyJob, canActivate: [roleGuard([Role.STUDENT])] }
```

#### Challenges
- Understanding `@MapsId` and how it affects ID lookups
- Separating authentication (User) from profile (Student/Company)
- Role conversion logic after profile completion

---

### Sprint 3 — Job Posting System

**Goal:** Enable companies to publish opportunities and students to browse them.

#### Job Posting Entity
```java
@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    private String jobTitle;
    private String description;
    private String location;

    @Enumerated(EnumType.STRING)
    private JobType jobType; // INTERNSHIP, PART_TIME, FULL_TIME, CONTRACT

    @Enumerated(EnumType.STRING)
    private WorkMode workMode; // REMOTE, ONSITE, HYBRID

    @Enumerated(EnumType.STRING)
    private EducationLevel requiredEducationLevel;

    @ElementCollection
    @CollectionTable(name = "job_required_skills")
    private Set<String> requiredSkills = new HashSet<>();

    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    private JobPostingStatus status; // DRAFT, OPEN, CLOSED, ARCHIVED
}
```

#### Angular — Create Job Posting Form
```typescript
// Skills are managed as a dynamic list, not a form control
skills: string[] = [];
newSkill = '';

addSkill(): void {
  const trimmed = this.newSkill.trim();
  if (trimmed && !this.skills.includes(trimmed)) {
    this.skills = [...this.skills, trimmed];
    this.newSkill = '';
  }
}

removeSkill(skill: string): void {
  this.skills = this.skills.filter(s => s !== skill);
}

submit(): void {
  const request: CreateJobPostingRequest = {
    jobTitle: this.form.value.jobTitle!,
    jobType: this.form.value.jobType as JobType,
    workMode: this.form.value.workMode as WorkMode,
    requiredSkills: this.skills,       // plain array, not Set
    requiredEducationLevel: this.form.value.requiredEducationLevel as EducationLevel,
    applicationDeadline: this.form.value.applicationDeadline!
  };
  this.jobPostingService.createPosting(this.companyId, request).subscribe(...);
}
```

> **Note for future developers:** Angular enums must have explicit string values to be compatible with Spring Boot JSON serialization. Numeric enums cause type mismatch errors.
> ```typescript
> // Wrong — numeric enum
> export enum JobType { INTERNSHIP, PART_TIME }
>
> // Correct — string enum
> export enum JobType {
>   INTERNSHIP = 'INTERNSHIP',
>   PART_TIME = 'PART_TIME'
> }
> ```

#### Challenges
- REST API structure and endpoint naming conventions
- Backend/frontend DTO synchronization
- Enum serialization between Java and TypeScript

---

### Sprint 4 — Application Workflow

**Goal:** Allow students to apply for opportunities and companies to manage applications.

#### Job Application Entity
```java
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @Enumerated(EnumType.STRING)
    private JobApplicationStatus status; // PENDING, REVIEWED, ACCEPTED, REJECTED, WITHDRAWN

    @Column(columnDefinition = "TEXT")
    private String motivationLetter;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
```

#### Application State Machine
```
PENDING → REVIEWED → ACCEPTED
                   → REJECTED
PENDING → WITHDRAWN (by student)
```

#### Apply to Job — Service Logic
```java
public JobApplicationResponse apply(Long studentId, ApplyToJobRequest request) {

    // Prevent duplicate applications
    if (jobApplicationRepository.existsByStudent_IdAndJobPosting_Id(
            studentId, request.jobPostingId())) {
        throw new IllegalStateException("Student has already applied to this posting.");
    }

    JobApplication application = new JobApplication(student, posting, request.motivationLetter());
    return JobApplicationMapper.toResponse(jobApplicationRepository.save(application));
}
```

#### Query Optimization — N+1 Problem Solved

**Problem:** The company dashboard needed all applications across all their job postings.
The naive approach would call `getByJobPosting()` once per posting — the classic N+1 problem.

**Solution:** Spring Data JPA relationship traversal with a single derived query:

```java
// JobApplicationRepository
// Traverses: JobApplication → JobPosting → Company
List<JobApplication> findByJobPosting_Company(Company company);
```

```java
// One service method, one database join, all applications returned
public List<JobApplicationResponse> getByCompany(Long companyId) {
    Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new IllegalArgumentException("Company not found: " + companyId));

    return jobApplicationRepository.findByJobPosting_Company(company)
            .stream()
            .map(JobApplicationMapper::toResponse)
            .toList();
}
```

```
// One HTTP call replaces N calls
GET /api/job-applications/companies/{companyId}
```

#### Challenges
- Relationship mapping between Student, JobPosting, and JobApplication
- Duplicate application prevention
- Dashboard query optimization (N+1 problem)

---

### Sprint 5 — Dashboards & UX Improvements

**Goal:** Create role-based user experiences with clean navigation.

#### Student Dashboard — Tab-based Navigation
```typescript
// Lazy loads applications only when tab is first opened
onTabChange(tab: 'profile' | 'jobs' | 'applications'): void {
  this.activeTab = tab;
  if (tab === 'applications' && this.applications.length === 0) {
    this.loadApplications();
  }
}
```

#### Navigate with Tab State
```typescript
// After applying to a job, navigate to dashboard with tab pre-selected
viewMyApplication(): void {
  this.router.navigate(['/student/dashboard'], { queryParams: { tab: 'applications' } });
}

// In StudentDashboard ngOnInit — read the tab param
ngOnInit(): void {
  const tab = this.route.snapshot.queryParamMap.get('tab') as 'profile' | 'jobs' | 'applications';
  if (tab) {
    this.onTabChange(tab);
  }
}
```

#### Auth Response — Complete Structure
```typescript
// AuthResponse returned by backend on login
export interface AuthResponse {
  token: string;
  role: Role;
  userId: number;
  studentId: number;   // only set when role === STUDENT
  companyId: number;   // only set when role === COMPANY
  fullName: string;
}
```

> **Important note:** Because `@MapsId` is used on both `Student` and `Company`, their IDs equal the `userId`. The backend login service resolves the correct profile ID via repository lookup — not by reusing `userId` directly — to keep the logic explicit and maintainable.

#### Route Structure
```typescript
// All student routes are nested under /student parent
{
  path: 'student',
  canActivate: [authGuard, roleGuard],
  data: { role: Role.STUDENT },
  children: [
    { path: 'dashboard', component: StudentDasboard },
    { path: 'complete-profile', component: StudentProfileCompletion },
    { path: 'edit-profile', component: EditProfile }
  ]
},
// Company routes follow the same pattern
{
  path: 'company',
  canActivate: [authGuard, roleGuard],
  data: { role: Role.COMPANY },
  children: [
    { path: 'company-dashboard', component: CompanyDashboard },
    { path: 'complete-profile', component: CompanyProfileCompletion },
    { path: 'create-job-posting', component: CreateJobPosting }
  ]
},
// Public routes
{ path: 'jobs/:id/apply', component: ApplyJob, canActivate: [roleGuard([Role.STUDENT])] }
```

#### Challenges
- `@MapsId` causing `companyId` to equal `userId` — required careful auth response handling
- LocalStorage not updated after backend changes — required full logout/login cycle
- Route nesting causing navigation mismatches (`/student-dashboard` vs `/student/dashboard`)

---

## 5. Main Technologies Used

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot | Application framework |
| Spring Security | Authentication & authorization |
| JWT | Stateless token authentication |
| JPA / Hibernate | ORM and database queries |
| MySQL | Relational database |

### Frontend
| Technology | Purpose |
|---|---|
| Angular | SPA framework |
| TypeScript | Typed JavaScript |
| Bootstrap 5 | UI components and layout |
| Angular Router | Client-side navigation |
| RxJS | Reactive HTTP calls |

---

## 6. Main Challenges Encountered

| Challenge | Solution Applied |
|---|---|
| JWT token not attached to requests | HTTP interceptor adds Bearer token to every request |
| CORS errors between ports 4200 and 8080 | Spring `@CrossOrigin` + security config |
| `@MapsId` causing ID confusion | Documented that `company.id == user.id` by design |
| Enum type mismatch between Java and TypeScript | All enums use explicit string values |
| N+1 queries for company applications | Spring Data JPA `findByJobPosting_Company()` |
| `companyId` not in localStorage after backend change | Full logout/login required to refresh stored auth data |
| Route navigation mismatch | Standardized nested route paths |

---

## 7. Knowledge & Skills Acquired

Through this project the following skills were significantly strengthened:

- REST API design and versioning
- Angular routing and component architecture
- JWT authentication and interceptor pattern
- Object-oriented programming and entity design
- JPA entity relationships (`@OneToOne`, `@ManyToOne`, `@MapsId`)
- Agile Scrum workflow and sprint planning
- Backend/frontend DTO synchronization
- Full-stack application architecture
- Debugging across frontend and backend simultaneously

---

## 8. Recommendations for Future Development

If another developer continues this project, the following improvements are recommended:

### Short Term
- Add a `GlobalExceptionHandler` to return consistent error responses (already partially implemented)
- Implement refresh tokens to replace the current single JWT approach
- Add input validation error messages consistently across all forms

### Medium Term
- CV/document upload using Spring `MultipartFile` + file storage
- Email notifications on application status changes
- Advanced job search with filters (location, job type, education level)

### Long Term
- Real-time messaging between students and companies (WebSocket)
- AI-powered internship matching based on student skills and job requirements
- Administrator dashboard for platform moderation and analytics
- Mobile application

---

## 9. Final Reflection

This project demonstrated the importance of designing software progressively, validating decisions through testing and feedback, and choosing architectures that reflect real-world workflows.

The use of Agile Scrum allowed continuous delivery of working features and integration of feedback at every stage, rather than delivering everything at the end.

Beyond technical implementation, the project strengthened analytical thinking, adaptability, and professional software development practices — particularly around debugging complex full-stack issues and making architectural decisions independently.

---

*Developed during a 16-week internship · Spring Boot + Angular · Agile Scrum*