import { LoginPage } from './login.po';
import { HomePage } from './home.po';
import { browser, ElementFinder } from "protractor";
import { ISize } from 'selenium-webdriver';

async function getElementWidthPercentage(element: ElementFinder, padding: number) : Promise<number> {
  let size: ISize = await browser.driver.manage().window().getSize();
  let windowWidth: number = size.width;
  let elementWidth: string = await element.getCssValue('width');
  let elementWidthFloat: number = parseFloat(elementWidth.replace("px", "")) + padding;
  return (elementWidthFloat / windowWidth);
}

describe('testing LoginPage', () => {
  let page: LoginPage;
  let homePage: HomePage; 

  beforeEach(() => {
    page = new LoginPage();
    homePage = new HomePage();
  });

  it('should display login page title', async () => {
    await page.navigateTo();
    expect(await page.getParagraphText()).toEqual('Demo App Login');
  });
  
  it('should display snack-bar with missing fields text', async () => {
    await page.navigateTo();
    await page.getEmailTextInput().sendKeys("invalid-email");
    await page.getSubmitButton().click();
    expect(await page.getSnackBar().isDisplayed()).toBe(true);
    expect(await page.getSnackBar().getText()).toBe("Please fill the missing fields");
  });

  it('should display snack-bar with text invalid login if credentials are incorrect', async () => {
    await page.navigateTo();
    await page.getEmailTextInput().sendKeys("invalid-email");
    await page.getPasswordTextInput().sendKeys("password");
    await page.getSubmitButton().click();
    expect(await page.getSnackBar().isDisplayed()).toBe(true);
    expect(await page.getSnackBar().getText()).toBe("Invalid login");
  });

  /*
    My attempt to test responsiveness of the textbox "password"
    I check that, resizing the screen, the css property 'width' changes from 50% to 100%
    stating that the two inputs boxes moved from being horizontally aligned to being vertically aligned 
  */
  it('should display the inputs with width of 100% on small screen', async () => {
    await page.navigateTo();
    let currentElementWidth: number = await getElementWidthPercentage(page.getPasswordContainer(), 10);
    expect(currentElementWidth).toBeCloseTo(0.5, 1);
    await browser.driver.manage().window().setSize(600, 600);
    await browser.sleep(500);
    currentElementWidth = await getElementWidthPercentage(page.getPasswordContainer(), 20);
    expect(currentElementWidth).toBeCloseTo(1, 1);
    currentElementWidth = await getElementWidthPercentage(page.getEmailContainer(), 20);
    expect(currentElementWidth).toBeCloseTo(1, 1);
  });

  it('should navigate to home if the credentials are correct', async () => {
    await page.navigateTo();
    await page.login();
    expect(await browser.getCurrentUrl()).toContain("/home");
    expect(await homePage.getLogoutButton().getText()).toBe("Logout");
  });

});
