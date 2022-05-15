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
