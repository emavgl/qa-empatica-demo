package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"

	"github.com/stretchr/testify/assert"
)

func checkError(err error, t *testing.T) {
	if err != nil {
		t.Errorf("An error occurred. %v", err)
	}
}

// TestPingHandler tests the Ping Handler
// Response must contain 200 status code and `pong` body content
func TestPingHandler(t *testing.T) {
	// Prepare test Request
	req, err := http.NewRequest("GET", "/ping", nil)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()
	http.HandlerFunc(PingHandler).
		ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusOK
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string(`pong`)
	assert.Equal(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestLoginHandler_ValidLogin tests the Login Handler when the credential are valid
// the expected response should contain 200 status code and the token as JSON body
func TestLoginHandler_ValidLogin(t *testing.T) {
	// Prepare test Request
	values := map[string]string{"email": "demo@empatica.com", "password": "passw0rd"}
	requestBody, _ := json.Marshal(values)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(requestBody))
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()
	http.HandlerFunc(LoginHandler).
		ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusOK
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string(`{"token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"}`)
	assert.JSONEq(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestLoginHandler_WrongCredentials tests the Login Handler when the credentials are incorrect
// the expected response should contain 403 status code and the token as JSON body
func TestLoginHandler_WrongCredentials(t *testing.T) {
	// Prepare test Request
	values := map[string]string{"email": "demo@gmail.com", "password": "passw0rd"}
	requestBody, _ := json.Marshal(values)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(requestBody))
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()
	http.HandlerFunc(LoginHandler).
		ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusForbidden
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := "invalid user"
	assert.Equal(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestLoginHandler_InvalidPayload tests the Handler Login when the request payload is invalid
// the expected response should contain 400 with a body `invalid login data`
func TestLoginHandler_InvalidPayload(t *testing.T) {
	// Prepare test Request
	values := map[string]string{"token": "hello-empatica"}
	requestBody, _ := json.Marshal(values)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(requestBody))
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()
	http.HandlerFunc(LoginHandler).
		ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusBadRequest
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := "invalid login data"
	assert.Equal(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestGetUserHandler_ValidPayload tests the GetUser Handler when the userId and AuthToken are valid
func TestGetUserHandler_ValidPayload(t *testing.T) {
	// Prepare test Request
	authToken := "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
	req, err := http.NewRequest("GET", "/users/1", nil)
	req.Header.Add("Authorization", authToken)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()

	// Need to create a router that we can pass the request through so that the vars will be added to the context
	r := mux.NewRouter()
	r.Handle("/users/{userId}", tokenValidation(http.HandlerFunc(GetUserHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusOK
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string("{\"id\":1,\"email\":\"demo@empatica.com\",\"firstName\":\"John\",\"lastName\":\"\",\"age\":13}\n")
	assert.JSONEq(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestGetUserHandler_NotAuthorized tests the GetUser Handler when authorized field in header is not set
// the expected response should contain 401 with a json body `missing token`
func TestGetUserHandler_NotAuthorized(t *testing.T) {
	// Prepare test Request
	req, err := http.NewRequest("GET", "/users/1", nil)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()

	// Need to create a router that we can pass the request through so that the vars will be added to the context
	r := mux.NewRouter()
	r.Handle("/users/{userId}", tokenValidation(http.HandlerFunc(GetUserHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusUnauthorized
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string(`"missing token"`)
	assert.JSONEq(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestGetUserHandler_NotValidAuthorizationToken tests the GetUser Handler when authtoken is wrong
// the expected response should contain 403 with a json body `invalid token`
func TestGetUserHandler_NotValidAuthorizationToken(t *testing.T) {
	// Prepare test Request
	authToken := "not-the-right-token"
	req, err := http.NewRequest("GET", "/users/1", nil)
	req.Header.Add("Authorization", authToken)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()

	// Need to create a router that we can pass the request through so that the vars will be added to the context
	r := mux.NewRouter()
	r.Handle("/users/{userId}", tokenValidation(http.HandlerFunc(GetUserHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusForbidden
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string(`"invalid token"`)
	assert.JSONEq(t, expectedBodyContent, actualBodyContent, "Response body differs")
}

// TestGetUserHandler_NotValidUserId tests the GetUser Handler when userId is not valid Id
// the expected response should contain 400 with a body `user id not valid`
func TestGetUserHandler_NotValidUserId(t *testing.T) {
	// Prepare test Request
	authToken := "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
	req, err := http.NewRequest("GET", "/users/empatica", nil)
	req.Header.Add("Authorization", authToken)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()

	// Need to create a router that we can pass the request through so that the vars will be added to the context
	r := mux.NewRouter()
	r.Handle("/users/{userId}", tokenValidation(http.HandlerFunc(GetUserHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusBadRequest
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	assert.Contains(t, actualBodyContent, `user id not valid`, "Response body differs")
}

// TestGetUserHandler_MissingUserId tests the GetUser Handler when userId is not in the db
// the expected response should contain 403 with a json body `invalid token`
func TestGetUserHandler_MissingUserId(t *testing.T) {
	// Prepare test Request
	authToken := "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
	req, err := http.NewRequest("GET", "/users/10", nil)
	req.Header.Add("Authorization", authToken)
	checkError(err, t)

	// Define Request Handler
	rr := httptest.NewRecorder()

	// Need to create a router that we can pass the request through so that the vars will be added to the context
	r := mux.NewRouter()
	r.Handle("/users/{userId}", tokenValidation(http.HandlerFunc(GetUserHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	// Assert status code
	actualStatusCode := rr.Code
	expectedStatusCode := http.StatusForbidden
	assert.Equal(t, expectedStatusCode, actualStatusCode, "Status code differs")

	// Assert body content
	actualBodyContent := rr.Body.String()
	expectedBodyContent := string(`"invalid token"`)
	assert.JSONEq(t, expectedBodyContent, actualBodyContent, "Response body differs")
}
