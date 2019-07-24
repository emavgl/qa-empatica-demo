import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { LogoutComponent } from "../logout/logout.component";
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatSnackBarModule,
} from "@angular/material";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from '../auth.service';
import {Location} from "@angular/common";


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let httpTestingController: HttpTestingController;

  const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "home", component: HomeComponent },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        LoginComponent,
        LogoutComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthService,
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false on empty email', () => {    
    (component as any).email = "";
    (component as any).password = "password";
    expect(component.check()).toBe(false);
  });

  it('should return false on null email', () => {    
    (component as any).email = null;
    (component as any).password = "password";
    expect(component.check()).toBe(false);
  });

  it('should return false on undefined email', () => {    
    (component as any).email = undefined;
    (component as any).password = "password";
    expect(component.check()).toBe(false);
  });

  // this is going to fail
  // use: https://angular.io/api/forms/EmailValidator
  it('should return false on invalid email', () => {    
    (component as any).email = "not_an_email";
    (component as any).password = "password";
    expect(component.check()).toBe(false);
  });

  it('should return false on empty password', () => {    
    (component as any).email = "email@gmail.com";
    (component as any).password = "";
    expect(component.check()).toBe(false);
  });

  it('should return false on null password', () => {    
    (component as any).email = "email@gmail.com";
    (component as any).password = null;
    expect(component.check()).toBe(false);
  });

  it('should return false on undefined password', () => {    
    (component as any).email = "email@gmail.com";
    (component as any).password = undefined;
    expect(component.check()).toBe(false);
  });

  it('should return true on valid email and password', () => {    
    (component as any).email = "email@gmail.com";
    (component as any).password = "password";
    expect(component.check()).toBe(true);
  });

  it('should set authToken', inject([AuthService], (authService: AuthService) => {    
    component.setToken("token");
    expect(authService.getToken()).toBe("token");
    authService.deleteToken();
  }));

  it('should redirect to home', () => {
    component.redirect();
    expect(location.path()).toBe('/home');
  });

  it('should make a login call and redirect to home on valid credentials', inject([AuthService], (authService: AuthService) => {      
    (component as any).email = "email@gmail.com";
    (component as any).password = "password";
    let baseUrl = "http://backend:9000";
    component.do();

    const mockApiResponse = {
      token: 'mockToken',
    };

    const req = httpTestingController.expectOne(baseUrl + "/login");
    expect(req.request.method).toEqual('POST');
    req.flush(mockApiResponse);

    expect(authService.getToken()).toBe("mockToken");
    expect(location.path()).toBe('/home');
    authService.deleteToken();
  }));

  it('should show error message on empty credentials (check client-side)', inject([AuthService], (authService: AuthService) => {
    (component as any).email = "email@gmail.com";
    (component as any).password = "";

    spyOn((component as any).snackBar, 'open');
    component.do();

    let baseUrl = "http://backend:9000";
    const req = httpTestingController.expectNone(baseUrl + "/login");
    expect(authService.getToken()).toBe(null);
    expect((component as any).snackBar.open).toHaveBeenCalledWith('Please fill the missing fields');
  }));

  it('should return error message on invalid credentials (check server side)', inject([AuthService], (authService: AuthService) => {
    (component as any).email = "email@gmail.com";
    (component as any).password = "password";

    spyOn((component as any).snackBar, 'open');
    component.do();

    let baseUrl = "http://backend:9000";
    const req = httpTestingController.expectOne(baseUrl + "/login");
    req.flush('', { status: 403, statusText: 'Invalid Credentials' });
    expect((component as any).snackBar.open).toHaveBeenCalledWith('Invalid login');
  }));

});
