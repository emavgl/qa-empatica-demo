import { browser, by, element } from 'protractor';

export class HomePage {

  navigateTo() {
    return browser.get('/home');
  }

  getWelcomeText() {
    return element(by.css('app-home p')).getText();
  }

  getLogoutButton() {
    return element(by.css('app-home a'));
  }

  logout() {
    return this.getLogoutButton().click();
  }
}
