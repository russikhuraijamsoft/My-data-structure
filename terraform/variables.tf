# ==============================================================================
# TalkOS Terraform Variables
# ==============================================================================

variable "project_id" {
  description = "The Google Cloud Platform Project ID"
  type        = string
  default     = "cricket-closet-imphal"
}

variable "region" {
  description = "The Google Cloud region for compute and repository"
  type        = string
  default     = "asia-southeast1"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "talkos-enterprise-erp"
}

variable "artifact_repository_id" {
  description = "Artifact Registry Docker repository ID"
  type        = string
  default     = "talkos"
}

variable "min_instances" {
  description = "Minimum number of Cloud Run instances (0 enables scale-to-zero)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "firestore_database_id" {
  description = "Firestore Enterprise Database ID"
  type        = string
  default     = "ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574"
}
