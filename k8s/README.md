##### First time starting & config

1. Install kubectl
2. Install minikube
3. `minikube start`
4. `minikube addons enable ingress` and `minikube addons enable metrics-server`
5. Restart minikube after enabling ingress addon.
6. Copy .env.k8s.example as .env.k8s and fill in the secrets
7. `kubectl apply -f k8s/namespace.yaml`
8. `kubectl config set-context --current --namespace=codecapable`
9. To push the secrets to the cluster, do `kubectl create secret generic cc-secrets --from-env-file=k8s/.env.k8s`.
10. `kubectl create secret generic jwt-public --from-literal=JWT_PUBLIC_KEY="keyhere"` (make sure to place key inside quotes)
11. `kubectl create secret generic jwt-private --from-literal=JWT_PRIVATE_KEY="keyhere"` (make sure to place key inside quotes)
12. In a terminal in the root of the project, do `kubectl apply -f k8s/`

##### Start the cluster locally:

Make sure Minikube is running in Docker and not Hyper-V or anything else

1. `minikube start`
2. `minikube tunnel` in a new terminal
3. Go to 127.0.0.1 and wait ~30 seconds (before that axios requests from the frontend to the ingress will fail with 502)


##### Namespace convenience

To configure kubectl to use the codecapable namespace, use `kubectl config set-context --current --namespace=codecapable`. This has to be done every time minikube is started.


##### Access any service

1. `kubectl get service` to show you the running services
2. In a new terminal `minikube service service-name` will expose an IP so you can access the service

##### Rollout (restart deployments)

1. `kubectl rollout restart -n codecapable deployment problem-ms-deployment`
2. `kubectl rollout restart -n codecapable deployment user-ms-deployment`
3. `kubectl rollout restart -n codecapable deployment runner-ms-deployment`