FROM golang:1.12.7-alpine
LABEL MAINTAINER = 'emavgl'

# Install git, gcc
RUN apk --update add build-base git && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

# Create folders
RUN mkdir -p /app/backend

# Copy the backend folder content
# and go.mod files
WORKDIR /app
COPY . /app/backend
COPY ./go.mod.copy ./go.mod
COPY ./go.sum.copy ./go.sum

# Install dependencies
RUN go get ./backend/... 

# Compile
WORKDIR /app/backend
RUN go build -o api
RUN go test -c
RUN chmod +x api
RUN chmod +x backend.test

# Expose PORT
EXPOSE 9000

# Default command is run api
CMD ["/app/backend/api"]