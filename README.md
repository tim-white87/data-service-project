# Data Service Project

React front end with a dotnet core AWS Lambda handlers for the backend microservice layer. You can view the site live [here](todo).

Code [repo](https://github.com/cecotw/data-service-project):

To begin:

```
make install
```

```
make start
```

If you would like to deploy this, ensure you have your AWS creds setup, then

```
cd ./infrastructure
terraform init
terraform apply
```

This will set up the S3 bucket and output the domain.

To deploy, run:

```
make deploy
```

## License

[ISC](https://github.com/cecotw/data-service-project/LICENSE)
