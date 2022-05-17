# Build
```docker build -t shalithax/abc-auth-app .```

# Locally run
```docker run -p 4500:4500 -d shalithax/abc-auth-app```



## Run the kubernetes dashboard

1. run the dashboard

    ```kubectl proxy```

    [Running Kubernetes and the dashboard with Docker Desktop](https://andrewlock.net/running-kubernetes-and-the-dashboard-with-docker-desktop/)

2. for grant access

    ```kubectl create clusterrolebinding serviceaccounts-cluster-admin  --clusterrole=cluster-admin  --group=system:serviceaccounts```

3. for login token

```kubectl -n kube-system describe secret default```

## GKE

1. create container

```gcloud container clusters create abc-auth-cluster --disk-size 10 --num-nodes 1 --enable-autoscaling --min-nodes 1 --max-nodes 5 --zone europe-north1-a```

[GKE Deploy](https://levelup.gitconnected.com/dockerizing-deploying-and-scaling-node-js-on-google-kubernetes-engine-with-continuous-integration-f895a98bf6e3)

2. Build image

```gcloud builds submit --tag gcr.io/<project-id>/gke-tutorial-image .```

* for auth

   ```gcloud builds submit --tag gcr.io/phrasal-waters-350317/gke-abc-auth .```

3. ENV 

```gcloud kms encrypt --location global --keyring ctse-app-keyring --key default --plaintext-file .env --ciphertext-file .env.enc```
