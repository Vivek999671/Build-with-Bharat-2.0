# DoSJE Real-Time Monitoring & Digital Inspection Management System
> **Department of Social Justice and Empowerment (Govt. of India)**  
> *e-NirikShan — Digital Governance, Real-Time Field Monitoring & Automated Anomaly Detection Platform*

---

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph MobileClient ["Mobile Application (React Native + Expo SDK 57)"]
        UI["16 Specialized Mobile Screens<br/>• Splash • Login • Home Dashboard<br/>• Projects • Inspections • Conduct Inspection<br/>• Random Assignment • Live GIS • CCTV<br/>• Alerts • Risk Analytics • Reports • Profile"]
        Nav["React Navigation<br/>(Native Stack + 5-Tab Bottom Bar)"]
        Hardware["Device Hardware Integrations<br/>• GPS Geo-Lock (expo-location)<br/>• Camera & Evidence (expo-camera)<br/>• Push Notifications (expo-notifications)"]
        Offline["Offline-First Engine<br/>• SecureStore (JWT Token & Session)<br/>• offlineStorage.js (Local Queue & Sync)"]
        RESTClient["ApiService.js (REST Connector)<br/>• Platform-aware base URL<br/>• Bearer Token Injection<br/>• Automatic Offline Fallback"]
    end

    subgraph BackendAPI ["Enterprise Backend (Java 21 / Spring Boot 3.3)"]
        Security["Spring Security & JWT Filter<br/>• Role-Based Access Control (RBAC)<br/>• Official / Inspector / NGO Staff"]
        Controllers["REST API Controllers<br/>• AuthController (/api/auth)<br/>• ProjectController (/api/projects)<br/>• InspectionController (/api/inspections)<br/>• AnalyticsController (/api/analytics)<br/>• AlertController (/api/alerts)<br/>• CCTVController (/api/cctv)<br/>• ReportController (/api/reports)"]
        BusinessEngines["Core Business Logic & Engines<br/>• Rule-Based Randomized Assignment<br/>• Automated Anomaly Detection Engine<br/>• Geo-Verification & Distance Calculator<br/>• Digital Audit Trail & Dossier Generator"]
        DataLayer["Spring Data JPA / Hibernate"]
    end

    subgraph Persistence ["Data & Storage Layer"]
        MySQL[("MySQL Database (Production)<br/>• 8 Relational Relational Entities")]
        H2[("H2 In-Memory DB (Dev / Demo)<br/>• Zero-Setup Self-Seeding")]
    end

    UI --> Nav
    UI --> Hardware
    UI --> Offline
    UI --> RESTClient
    RESTClient <-->|HTTPS / JSON REST API| Security
    Security --> Controllers
    Controllers --> BusinessEngines
    BusinessEngines --> DataLayer
    DataLayer <--> MySQL
    DataLayer <--> H2
```

---

## 2. Layer-by-Layer Architectural Breakdown

### **Layer 1: Presentation & Mobile UX Layer**
- **Framework**: React Native with Expo SDK 57 (React 19, React Native 0.86).
- **Navigation Structure**:
  - `BottomTabNavigator`: 5 main tabs (*Home, Inspections, Projects, Alerts, Profile*).
  - `NativeStackNavigator`: Full-screen transitions for *Project Details, Inspection Details, Conduct Field Inspection, Random Assignment, Live GIS, CCTV, and Reports*.
- **UI Guidelines**: Government-standard dark green theme (`#1b5e20`), touch targets $\ge 44 \times 44\text{ px}$, `SafeAreaView` and `KeyboardAvoidingView` support.

### **Layer 2: Device Hardware & Sensors**
- **GPS Verification**: Uses `expo-location` to lock latitude, longitude, and accuracy tokens during on-site inspections.
- **Geo-Tagged Digital Evidence**: Uses `expo-camera` and `expo-image-picker` to capture time-stamped, coordinate-stamped photos.
- **Push & Local Notifications**: Uses `expo-notifications` for real-time inspection assignment dispatch and critical anomaly warnings.

### **Layer 3: Offline-First Persistence Engine**
- **Token Security**: Uses `expo-secure-store` for 256-bit encrypted storage of JWT tokens and session data.
- **Local Sync Queue**: Implemented in `offlineStorage.js` to store field inspection reports locally when field inspectors have no internet connectivity, automatically syncing to the cloud backend once reconnected.

### **Layer 4: Enterprise Backend (Spring Boot 3.3)**
- **Architecture**: Strict Layered MVC (`controller`, `service`, `repository`, `entity`, `dto`, `security`, `config`).
- **Security & RBAC**: Stateless JWT authentication filter with roles:
  - `ROLE_DOSJE_OFFICIAL`: Central/State dashboard, project oversight, random inspection assignment, reports.
  - `ROLE_PMU_INSPECTOR`: Field inspection target queue, GPS lock, attendance logging, evidence capture.
  - `ROLE_PROJECT_STAFF`: Project details, compliance status, and CCTV streams.
- **Core Algorithms**:
  - **Rule-Based Randomized Assignment**: Selects inspectors based on proximity, workload balance, and rotational entropy to eliminate conflict of interest.
  - **Rule-Based Anomaly Detection**: Evaluates biometric attendance drops $> 20\%$, inspection overdue intervals $> 3\text{ days}$, and CCTV dropouts.

### **Layer 5: Database & Persistence Layer**
- **Relational Model (8 Entities)**: `User`, `Project`, `Inspection`, `Evidence`, `Attendance`, `Alert`, `CCTV`, `Report`.
- **Dual Database Support**:
  - Production: MySQL with Spring Data JPA and connection pooling.
  - Dev/Demo: In-memory H2 database with automatic seed data initialized on boot via `DataInitializer.java`.

---

## 3. Inspection Lifecycle Data Flow

```
[DoSJE Official / Central Cell]
               │
      (1) Assign Inspection (Manual or Rule-Based Randomized)
               │
               ▼
[PMU Field Inspector Mobile App]
               │
      (2) Inspector Receives Push Notification & Navigates to Site
      (3) Step 1: GPS Lock & Geo-Verification (expo-location)
      (4) Step 2: Biometric Attendance Logging (Calculates % & Flag)
      (5) Step 3: 7-Point Compliance Checklist (Infrastructure, Records, Safety, etc.)
      (6) Step 4: Capture Geo-Tagged Photographic Evidence
      (7) Step 5 & 6: Observations & Risk Rating
      (8) Step 7: Final Submit & Digitally Signed Dossier
               │
               ▼
[Spring Boot Backend & Anomaly Detection Engine]
               │
      (9) Validates Evidence, Evaluates Risk Score & Logs Audit Trail
      (10) Dispatches Automated Critical Alerts if Attendance < 80%
               │
               ▼
[Central Dashboard & Official Reports]
```

---

## 4. REST API Endpoint Map

| Category | Route | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | `POST` | Authenticates user and returns JWT token + profile |
| **Projects** | `/api/projects` | `GET` | Lists all projects with filter parameters |
| **Projects** | `/api/projects/{id}` | `GET` | Returns project details and coordinates |
| **Inspections**| `/api/inspections` | `GET` | Retrieves inspection queue filtered by status |
| **Assignment** | `/api/inspections/random-assign` | `POST` | Executes rule-based randomized allocation |
| **Assignment** | `/api/inspections/assign` | `POST` | Manually assigns inspector to project |
| **GPS** | `/api/inspections/{id}/gps` | `POST` | Verifies and stores geo-coordinates |
| **Attendance** | `/api/inspections/{id}/attendance` | `POST` | Logs staff/beneficiary counts & anomaly status |
| **Evidence** | `/api/inspections/{id}/evidence` | `POST` | Registers geo-tagged media evidence |
| **Submission** | `/api/inspections/{id}/submit` | `POST` | Submits finalized inspection audit |
| **Analytics** | `/api/analytics/dashboard` | `GET` | Returns high-level dashboard KPIs and trends |
| **Analytics** | `/api/analytics/risk` | `GET` | Returns risk distribution and anomaly scorecards |
| **Alerts** | `/api/alerts` | `GET` | Fetches real-time alert feed |
| **Alerts** | `/api/alerts/{id}/read` | `PUT` | Marks an alert notification as read |
| **CCTV** | `/api/cctv` | `GET` | Lists CCTV camera status and live feed links |
| **Reports** | `/api/reports/generate` | `POST` | Generates official PDF/CSV audit dossiers |

---

## 5. Execution Guide

### Backend:
```bash
cd Backend
# Run with zero-setup in-memory database:
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Mobile Frontend:
```bash
cd CLIENT
# Start Expo development server:
npx expo start
```
- Press `w` to open web preview.
- Or scan QR code using **Expo Go** on Android/iOS.
