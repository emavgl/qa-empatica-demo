import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    let authService: AuthService = TestBed.get(AuthService);
    authService.deleteToken();
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should be return null if no token is inserted', inject([AuthService], (service: AuthService) => {
    expect(service.getToken()).toBeNull();
  }));

  it('should return a newly set token', inject([AuthService], (service: AuthService) => {
    service.setToken("token");
    expect(service.getToken()).toBe("token");
  }));

  it('should delete a token', inject([AuthService], (service: AuthService) => {
    service.setToken("token");
    expect(service.getToken()).toBe("token");
    service.deleteToken();
    expect(service.getToken()).toBeNull();
  }));

  it('should delete a token', inject([AuthService], (service: AuthService) => {
      service.deleteToken();
  }));
  
});
