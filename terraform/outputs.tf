# ==============================================================================
# TalkOS Terraform Outputs
# ==============================================================================

output "cloud_run_service_url" {
  description = "The HTTPS live production URL of the deployed TalkOS Cloud Run service"
  value       = google_cloud_run_v2_service.talkos_app.uri
}

output "artifact_registry_repo" {
  description = "Google Artifact Registry Docker Repository URI"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repository_id}"
}

output "service_account_email" {
  description = "Service Account email used by Cloud Run"
  value       = google_service_account.cloud_run_sa.email
}
