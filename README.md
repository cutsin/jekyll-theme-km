# README.md

## Site

[127.0.0.1:9220](http://127.0.0.1:9220)


## Development

```sh
# docker-compose build --no-cache km-development
docker-compose up -d --build km-development
docker exec -it km sh
```

### Run

```sh
bundle install
jekyll serve --force_polling
```
