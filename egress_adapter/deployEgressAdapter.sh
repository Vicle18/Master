#!/bin/sh

# Stop script on first error
set -e

IMAGE_NAME="clemme/egress"
IMAGE_TAG=$(git rev-parse --short HEAD) # first 7 characters of the current commit hash
DOCKER_PASSWORD="$2"
DOCKER_USERNAME="$1"

echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}, and tagging as latest"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" EgressAdapter/EgressAdapter/.
docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

echo "Authenticating and pushing image to Docker Hub"
docker login --username=$DOCKER_USER --password=$DOCKER_PASS

echo "Pushing the image"
docker push -a "${IMAGE_NAME}"

echo "Clean old pod"
kubectl delete pod egress-pod

echo "Deploy pod based on uploaded image"
kubectl apply -f egressAdapter.yaml -n sso --force

echo "Successfully deployed, hooray!"