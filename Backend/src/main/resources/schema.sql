-- DoSJE Real-Time Monitoring & Digital Inspection Relational Schema
-- Database: PostgreSQL (Supabase)

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    official_id VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    state VARCHAR(100),
    district VARCHAR(100),
    active_tasks_count INT DEFAULT 0,
    completed_today INT DEFAULT 0,
    pending_today INT DEFAULT 0,
    current_location_name VARCHAR(150),
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    scheme VARCHAR(150),
    location VARCHAR(200),
    state VARCHAR(100),
    district VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'Active',
    risk_score INT DEFAULT 20,
    risk_level VARCHAR(30) DEFAULT 'Low',
    compliance_score INT DEFAULT 85,
    attendance_rate INT DEFAULT 90,
    total_staff INT DEFAULT 50,
    present_staff INT DEFAULT 45,
    beneficiaries INT DEFAULT 150,
    last_inspection VARCHAR(50),
    next_inspection VARCHAR(50),
    cctv_status VARCHAR(20) DEFAULT 'ONLINE',
    cctv_camera_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    project_name VARCHAR(200),
    organization VARCHAR(200),
    inspector_id VARCHAR(50),
    inspector_name VARCHAR(150),
    inspector_role VARCHAR(100),
    scheduled_date VARCHAR(50),
    scheduled_time VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Assigned',
    location VARCHAR(200),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance VARCHAR(30),
    risk_level VARCHAR(30),
    attendance INT DEFAULT 0,
    compliance INT DEFAULT 0,
    priority VARCHAR(30) DEFAULT 'Normal',
    allocation_method VARCHAR(100),
    allocation_reason TEXT,
    gps_verified BOOLEAN DEFAULT FALSE,
    captured_latitude DOUBLE PRECISION,
    captured_longitude DOUBLE PRECISION,
    gps_accuracy_meters DOUBLE PRECISION,
    gps_timestamp VARCHAR(50),
    infrastructure_check VARCHAR(30) DEFAULT 'PASS',
    staff_check VARCHAR(30) DEFAULT 'PASS',
    beneficiary_check VARCHAR(30) DEFAULT 'PASS',
    records_check VARCHAR(30) DEFAULT 'PASS',
    service_check VARCHAR(30) DEFAULT 'PASS',
    safety_check VARCHAR(30) DEFAULT 'PASS',
    scheme_check VARCHAR(30) DEFAULT 'PASS',
    observations TEXT,
    final_remarks TEXT,
    overall_status VARCHAR(50),
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendances (
    id BIGSERIAL PRIMARY KEY,
    inspection_id VARCHAR(50) NOT NULL,
    project_id VARCHAR(50) NOT NULL,
    total_staff INT,
    present_staff INT,
    absent_staff INT,
    beneficiaries_present INT,
    attendance_rate INT,
    is_verified BOOLEAN DEFAULT TRUE,
    anomaly_detected BOOLEAN DEFAULT FALSE,
    anomaly_reason TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidences (
    id BIGSERIAL PRIMARY KEY,
    inspection_id VARCHAR(50) NOT NULL,
    project_id VARCHAR(50),
    file_url TEXT NOT NULL,
    file_name VARCHAR(200),
    media_type VARCHAR(30) DEFAULT 'IMAGE',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    accuracy_meters DOUBLE PRECISION,
    captured_timestamp VARCHAR(50),
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    project_name VARCHAR(200),
    project_id VARCHAR(50),
    risk_score INT,
    description TEXT,
    timestamp VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cctv_cameras (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    project_id VARCHAR(50),
    project_name VARCHAR(200),
    location VARCHAR(200),
    status VARCHAR(30) DEFAULT 'ONLINE',
    stream_url TEXT,
    demo_stream_type VARCHAR(100) DEFAULT 'Demo Stream (RTSP/HLS Ready)',
    last_connected VARCHAR(50),
    ip_address VARCHAR(50),
    resolution_fps INT DEFAULT 30,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(50),
    scheme VARCHAR(150),
    state VARCHAR(100),
    district VARCHAR(100),
    project_id VARCHAR(50),
    project_name VARCHAR(200),
    total_inspections INT DEFAULT 0,
    completed_inspections INT DEFAULT 0,
    pending_inspections INT DEFAULT 0,
    flagged_inspections INT DEFAULT 0,
    average_compliance_rate DOUBLE PRECISION DEFAULT 0.0,
    generated_by VARCHAR(150),
    file_format VARCHAR(20) DEFAULT 'PDF',
    download_url TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
