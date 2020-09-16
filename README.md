## Build

```
docker-compose up --build
```

## Run realt.by parser

```
docker container exec -it php /bin/sh
sh console/run.sh
```

## Run web app

```
open "http://$(docker-machine ip):8889"
```