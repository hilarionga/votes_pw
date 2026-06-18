export class HomePage {
  constructor(page) {
    this.page = page;

    // Grilla de autos:cada tarjeta es un <a> dentro de la lista principal
    this.carLinks = page.locator('app-car-list .car-item a, main a.col');
  }

  async goto() {
    await this.page.goto('https://buggy.justtestit.org/');
  }

  /**
   * Hace click en el primer auto de la lista (o en el Indice indicado).
   * @param {number} index - 0-based
   */
  async selectCar(index = 0) {
    await this.carLinks.nth(index).click();
  }

  /**
   * Navega al auto por nombre exacto (texto visible en la tarjeta).
   * @param {string} name
   */
  async selectCarByName(name) {
    await this.page.getByRole('link', { name }).click();
  }
}
