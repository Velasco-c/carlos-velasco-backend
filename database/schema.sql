CREATE DATABASE IF NOT EXISTS recruitment
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE recruitment;

CREATE TABLE candidates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    years_experience DECIMAL(4,1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uq_candidates_email (email),
    CONSTRAINT chk_candidates_experience CHECK (years_experience >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_candidates_full_name ON candidates(full_name);

CREATE TABLE jobs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    min_years_experience DECIMAL(4,1) NOT NULL DEFAULT 0,
    status ENUM('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT chk_jobs_min_experience CHECK (min_years_experience >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_status_title ON jobs(status, title);

CREATE TABLE applications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    candidate_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    cover_letter TEXT NULL,
    source ENUM('REFERRAL','INTERNAL','JOB_BOARD','OTHER') NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    priority ENUM('LOW','MEDIUM','HIGH') NOT NULL,
    status ENUM('RECEIVED','IN_REVIEW','REJECTED','HIRED') NOT NULL DEFAULT 'RECEIVED',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    status_updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    rejected_at DATETIME(3) NULL,
    active_candidate_job_key VARCHAR(100) GENERATED ALWAYS AS (CASE WHEN status IN ('RECEIVED','IN_REVIEW','HIRED') THEN CONCAT(candidate_id, ':', job_id) ELSE NULL END) STORED,
    PRIMARY KEY (id),
    CONSTRAINT fk_applications_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE RESTRICT,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    CONSTRAINT chk_applications_score CHECK (score >= 0 AND score <= 100),
    UNIQUE KEY uq_active_candidate_job (active_candidate_job_key),
    CONSTRAINT chk_rejected_at CHECK (
        (status = 'REJECTED' AND rejected_at IS NOT NULL)
        OR
        (status <> 'REJECTED' AND rejected_at IS NULL)
    )
) ENGINE=InnoDB;

CREATE INDEX idx_applications_job_status_priority_score
    ON applications(job_id, status, priority, score DESC);

CREATE INDEX idx_applications_candidate_job_status
    ON applications(candidate_id, job_id, status);

CREATE INDEX idx_applications_rejected_lookup
    ON applications(candidate_id, job_id, status, rejected_at);
