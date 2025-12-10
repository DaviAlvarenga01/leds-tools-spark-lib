import path from "path";
import fs from "fs";

function copyGitLabCIyml(target_folder: string) {
 fs.copyFileSync(
    "src/backend/python-generator/django/back/CI/.gitlab-ci.yml",
    path.join(target_folder, ".gitlab-ci.yml")
  )
}

function copyDotFlake8(target_folder: string) {
 fs.copyFileSync(
    "src/backend/python-generator/django/back/CI/.flake8",
    path.join(target_folder, ".flake8")
  )
}

function copyCIGitHubyml(target_folder: string) {
 fs.copyFileSync(
    "src/backend/python-generator/django/back/CI/CI-github.yml",
    path.join(target_folder, "ci-github.yml")
  )
}

function generateGitHubWorkflowFolder(target_folder: string) {
    const github_workflow_folder = path.join(target_folder, ".github/workflows");
    fs.mkdirSync(github_workflow_folder, { recursive: true }); 
}

export function generateCI(target_folder: string) {
    generateGitHubWorkflowFolder(target_folder);
    copyCIGitHubyml(path.join(target_folder, ".github/workflows"));
    copyDotFlake8(target_folder);
    copyGitLabCIyml(target_folder);
}