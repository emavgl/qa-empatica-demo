# Empatica Web Demo

This code represents a demo environment for a web application. It consists in a backend written in Go and a frontend built on top of Angular.

## Backend

Please note: Golang 1.9 or above required (https://golang.org/doc/install).

### Build

```
cd ./backend
go build -o api
```

### Run

```
./api
```

APIs will then be served on

```
localhost:9000
```

## Frontend


**IMPORTANT**:  
Frontend communicates with API at the address

http://backend:9000

`backend` must be added to /etc/hosts.

Open the file `etc/hosts`
```
sudo nano etc/hosts
```

add the line

```
localhost backend
```

Please note: Node 8.9 or above required (https://nodejs.org/en/download/).

(Want to run multiple node versions? Please take a look at https://github.com/tj/n)

### Build

```
cd ./frontend
npm install
```

### Live development

```
./node_modules/.bin/ng serve --open
```

Frontend will then be served on 
```
localhost:4200
```

# How to use docker-compose

The command

```bash
sudo docker-compose up --build
```

will run the API at `backend:9000` and the frontend tests (both e2e and unit-tests).

You can also override the command using the `--entrypoint` options:

```bash
sudo docker-compose run --entrypoint="npm run e2e" frontend 
```
