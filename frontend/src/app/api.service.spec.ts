import { TestBed, inject } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('ApiService', () => {
  let baseUrl = "http://localhost:9000";
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [
        HttpClientTestingModule,
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should make a login API call returning a AuthToken', inject([ApiService], (service: ApiService) => {
    const mockApiResponse = {
      token: 'mockToken',
    };

    service.login("username", "password")
      .subscribe(loginReponseData => {
        expect(loginReponseData.token).toEqual(mockApiResponse.token);
    });

    const req = httpTestingController.expectOne(baseUrl + "/login");
    expect(req.request.method).toEqual('POST');
    req.flush(mockApiResponse);
  }));


  it('should return an authenticated http header', inject([ApiService, AuthService], (service: ApiService, authService: AuthService) => {
    let mockToken: string = "mockToken";
    
    // Add token
    authService.deleteToken();
    authService.setToken(mockToken);

    // Check header
    let header = service.getHeader();
    expect(header).toBeDefined();
    expect(header.headers).toBeDefined();
    expect(header.headers.get("Content-Type")).toBe("application/json");
    expect(header.headers.get("Authorization")).toBe(mockToken);

    // After test
    authService.deleteToken();
  }));

  it('should make an API call returning the logged user',  inject([ApiService, AuthService], (service: ApiService, authService: AuthService) => {
    let mockToken: string = "mockToken";
    let mockUserId: number = 1;
    
    // Add auth token
    authService.deleteToken();
    authService.setToken(mockToken);

    // Mock of the expected response
    const mockApiResponse = {
      firstName: "firstName",
      lastName: "lastName"
    };

    // Asserts
    service.getUser(mockUserId)
      .subscribe(userResponseData => {
        expect(userResponseData.firstName).toEqual(mockApiResponse.firstName);
        expect(userResponseData.lastName).toEqual(mockApiResponse.lastName);
    });

    // Expects GET requests and flush data
    const req = httpTestingController.expectOne(baseUrl + "/users/" + mockUserId);
    expect(req.request.method).toEqual('GET');
    req.flush(mockApiResponse);

    // After tests
    authService.deleteToken();
  }));



});
