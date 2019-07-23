import { browser, by, element } from 'protractor';

export class LoginPage {

  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getEmailTextInput() {
    return element(by.id('mat-input-0'));
  }

  getEmailContainer() {
    return element(by.css('mat-form-field.input-field:nth-child(1)'));
  }

  getPasswordContainer() {
    return element(by.css('mat-form-field.input-field:nth-child(2)'));
  }

  getPasswordTextInput() {
    return element(by.id('mat-input-1'));
  }

  getSnackBar() {
    return element(by.css('.cdk-live-announcer-element'));
  }

  getSubmitButton() {
    return element(by.css('app-login form button'));
  }

  async login() {
    await this.getEmailTextInput().sendKeys("demo@empatica.com");
    await this.getPasswordTextInput().sendKeys("passw0rd");
    await this.getSubmitButton().click();
    await browser.sleep(500);
  }
}
