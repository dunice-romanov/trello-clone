import { TrelloAngularPage } from './app.po';

describe('trello-angular App', () => {
  let page: TrelloAngularPage;

  beforeEach(() => {
    page = new TrelloAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
