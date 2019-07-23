import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { HomeComponent } from './home.component';

import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF, Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;
  let httpTestingController: HttpTestingController;

  const routes: Routes = [
    { path: "home", component: HomeComponent },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/home' },
        AuthService
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if not authenticated', inject([AuthService], (authService: AuthService) => {
    authService.deleteToken();
    TestBed.createComponent(HomeComponent); // trigger the constructor
    expect(location.path()).toBe('');
  }));

  it('should make an api call getting information of the user with id 1', inject([AuthService], (authService: AuthService) => {
    let baseUrl = "http://localhost:9000";

    authService.setToken("mockToken");
    TestBed.createComponent(HomeComponent); // trigger the ngInit
    
    const req = httpTestingController.expectOne(baseUrl + "/users/1");
    expect(req.request.method).toEqual('GET');
    req.flush('');
    
    expect((component as any).user).toBeDefined();
  }));
});
