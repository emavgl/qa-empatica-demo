import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display login page title', async () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Demo App Login');
  });
  
});
