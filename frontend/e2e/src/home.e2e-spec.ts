import { HomePage } from './home.po';
import { LoginPage } from './login.po';

describe('testing HomePage', () => {
  let page: HomePage; 

  beforeAll(async () => {
    await new LoginPage().login();
    page = new HomePage();
  });

  it('should display a link with Logout text', async () => {
    await page.navigateTo();
    expect(await page.getLogoutButton().getText()).toEqual('Logout');
    expect(await page.getLogoutButton().getAttribute('href')).toContain('/logout');
  });

  it('should display the Welcome Message', async () => {
    await page.navigateTo();
    expect(await page.getWelcomeText()).toContain('Ciao John');
  });

  afterAll(async () => {
    await page.logout();
  });

});
