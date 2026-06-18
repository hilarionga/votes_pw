export class CarPage {
  constructor(page) {
    this.page = page;

    const model = page.locator('my-model');

    // CA5
    this.carDescription   = model.locator('div.row h3 + div p').first();
    this.carSpecification = model.locator('.card ul').first();
    this.totalVotes       = model.locator('h4 strong').first();

    // CA1/CA3 — textarea e id exactos del DOM real
    this.commentInput = model.locator('textarea#comment');
    this.voteButton   = model.locator('button.btn-success');

    // CA4
    this.commentsTable = model.locator('table.table');
    this.commentRows   = model.locator('table.table tbody tr');
    this.columnHeaders = model.locator('table.table thead th');
  }

  async getTotalVotesCount() {
    const text = await this.totalVotes.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async getCommentTableHeaders() {
    return await this.columnHeaders.allInnerTexts();
  }
}
