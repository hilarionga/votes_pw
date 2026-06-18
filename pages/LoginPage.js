export class LoginPage {
  constructor(page) {
    this.page = page;

    // El form de login está en el navbar
    this.usernameInput = page.locator('input[name="login"]');
    this.passwordInput = page.locator('input[name="password"]');
    // El botón Login — puede ser btn-primary sin type=submit en algunos builds
    this.loginButton   = page.locator('button.btn-primary').or(
                         page.locator('button:has-text("Login")'));

    // "Hi, username" aparece como span.nav-link.disabled cuando hay sesión
    this.loggedInUser  = page.locator('span.nav-link.disabled');
  }

  async goto() {
    await this.page.goto('https://buggy.justtestit.org/');
    await this.page.waitForSelector('input[name="login"]', { timeout: 10000 });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoggedIn() {
    return await this.loggedInUser.isVisible();
  }
}
