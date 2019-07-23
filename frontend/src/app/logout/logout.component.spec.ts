import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from "./logout.component";
import { APP_BASE_HREF } from '@angular/common';
import { AuthService } from '../auth.service';
import {Location} from "@angular/common";

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let location: Location;
  let fixture: ComponentFixture<LogoutComponent>;

  const routes: Routes = [
    { path: "logout", component: LogoutComponent },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoutComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/logout' },
        AuthService
      ]
    }).compileComponents();

    location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout the user deleting the stored token', inject([AuthService], (service: AuthService) => {
    service.setToken("authenticated");
    component.do();
    expect(service.getToken()).toBe(null);
  }));

  it('should redirect to the login page', () => {
    component.redirect();
    expect(location.path()).toBe('');
  });

});
