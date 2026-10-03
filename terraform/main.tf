# ==============================================================================
# TalkOS Restaurant Enterprise ERP - Terraform GCP Infrastructure as Code
# Deploys Cloud Run, Artifact Registry, Firestore linkage, and Secret Manager
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ------------------------------------------------------------------------------
# 1. Enable Required Google Cloud APIs
# ------------------------------------------------------------------------------
locals {
  services = [
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "firestore.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "aiplatform.googleapis.com"
  ]
}

resource "google_project_service" "enabled_apis" {
  for_each                   = toset(locals.services)
  project                    = var.project_id
  service                    = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}

# ------------------------------------------------------------------------------
# 2. Google Artifact Registry Repository for Docker Images
# ------------------------------------------------------------------------------
resource "google_artifact_registry_repository" "talkos_repo" {
  depends_on    = [google_project_service.enabled_apis]
  location      = var.region
  repository_id = var.artifact_repository_id
  description   = "TalkOS Enterprise ERP Docker container registry"
  format        = "DOCKER"
}

# ------------------------------------------------------------------------------
# 3. Secret Manager for Gemini AI and Firebase Keys
# ------------------------------------------------------------------------------
resource "google_secret_manager_secret" "gemini_api_key" {
  depends_on = [google_project_service.enabled_apis]
  secret_id  = "talkos-gemini-api-key"

  replication {
    auto {}
  }
}

# ------------------------------------------------------------------------------
# 4. Service Account for Cloud Run
# ------------------------------------------------------------------------------
resource "google_service_account" "cloud_run_sa" {
  account_id   = "talkos-cloud-run-sa"
  display_name = "TalkOS Cloud Run Execution Service Account"
}

resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "secret_accessor" {
  secret_id = google_secret_manager_secret.gemini_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# ------------------------------------------------------------------------------
# 5. Google Cloud Run Service (V2)
# ------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "talkos_app" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repository_id}/talkos-app:latest"

      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }

      ports {
        container_port = 8080
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GCP_REGION"
        value = var.region
      }
      env {
        name  = "VITE_FIREBASE_DATABASE_ID"
        value = var.firestore_database_id
      }

      startup_probe {
        http_get {
          path = "/api/health"
          port = 8080
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/api/health"
          port = 8080
        }
        period_seconds    = 15
        failure_threshold = 3
      }
    }
  }

  depends_on = [
    google_project_service.enabled_apis,
    google_artifact_registry_repository.talkos_repo
  ]
}

# ------------------------------------------------------------------------------
# 6. Public Ingress IAM Policy (Allow Unauthenticated HTTPS Traffic)
# ------------------------------------------------------------------------------
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.talkos_app.location
  project  = google_cloud_run_v2_service.talkos_app.project
  service  = google_cloud_run_v2_service.talkos_app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
