FROM golang:1.12.7-alpine
LABEL MAINTAINER = 'emavgl'

# Install git, gcc
RUN apk --update add build-base && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

# Create folders
RUN mkdir -p /go/src/app/backend

# Copy the backend folder content
# and go.mod files
WORKDIR /go/src/app
COPY . /go/src/app/backend
COPY ./go.mod.copy ./backend/go.mod
COPY ./go.sum.copy ./backend/go.sum

# Install dependencies
RUN go get ./backend/... 

# Compile
WORKDIR /go/src/app/backend
RUN go build -o api
RUN chmod +x api

# Expose PORT
EXPOSE 9000

# Default command is run api
CMD ["/go/src/app/backend/api"]