FROM golang:1.12.7-alpine
LABEL MAINTAINER = 'emavgl'

# Copy the backend folder content
# and go.mod files
WORKDIR /go/src/app
COPY . /go/src/app/backend
COPY ../go.mod .

# Install dependencies
RUN go get backend/... 

# Compile
WORKDIR /go/src/app/backend
RUN go build -o api

# Default command is run api
CMD ["api"]