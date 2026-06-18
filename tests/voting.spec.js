import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { CarPage }   from '../pages/CarPage.js';

const VALID_USER = process.env.BUGGY_USER || 'guapea';
const VALID_PASS = process.env.BUGGY_PASS || 'Pass123$';
const AVENTADOR  = 'https://buggy.justtestit.org/model/ckl2phsabijs71623vk0%7Cckl2phsabijs71623vlg';

async function goToCar(page) {
  await page.goto(AVENTADOR);
  await page.waitForSelector('my-model', { timeout: 10000 });
  await page.waitForTimeout(2000);
}

async function doLogin(page) {
  const lp = new LoginPage(page);
  await lp.goto();
  await lp.login(VALID_USER, VALID_PASS);
  await expect(lp.loggedInUser).toBeVisible({ timeout: 8000 });
}

// ─────────────────────────────────────────────────────────────────────────────
test.describe('HU - Votar y comentar un auto', () => {

  // CA1 OK
  test('CA1 - Solo puede votar con sesion activa', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const carPage   = new CarPage(page);

    // Sin sesion: boton Vote! no visible
    await goToCar(page);
    await expect(carPage.voteButton).not.toBeVisible();

    // Con sesion: navbar muestra "Hi, usuario" — sesion activa confirmada
    await doLogin(page);
    await goToCar(page);
    await expect(loginPage.loggedInUser).toBeVisible();
  });

  // CA2 OK
  test('CA2 - Sin sesion: boton Vote! y campo comentario no visibles', async ({ page }) => {
    await goToCar(page);
    const carPage = new CarPage(page);

    await expect(carPage.voteButton).not.toBeVisible();
    await expect(carPage.commentInput).not.toBeVisible();
  });

  // CA3 FAIL esperado — BUG DEL SITIO
  // El usuario vota con comentario. Tras votar, el formulario desaparece
  // y no puede agregar otro comentario opcional. El sitio solo permite
  // comentar una vez al momento de votar.
  test('CA3 - Usuario autenticado puede dejar comentario opcional', async ({ page }) => {
    await doLogin(page);
    await goToCar(page);

    const carPage = new CarPage(page);

    // Verificar que el formulario está disponible antes de votar
    await expect(carPage.commentInput).toBeVisible();
    await expect(carPage.voteButton).toBeVisible();

    // Votar con un comentario
    await carPage.commentInput.fill(`Playwright test ${Date.now()}`);
    await carPage.voteButton.click();
    await page.waitForTimeout(2000);

    // BUG: tras votar el formulario desaparece completamente.
    // El usuario no puede dejar un comentario adicional de forma opcional.
    // Esta línea FALLA porque el input ya no está en el DOM.
    await expect(carPage.commentInput).toBeVisible();
  });

  // CA4 FAIL esperado BUG DEL SITIO
  test('CA4 - Tabla muestra columnas Date, Author y Comment con datos', async ({ page }) => {
    await goToCar(page);
    const carPage = new CarPage(page);

    await expect(carPage.commentsTable).toBeVisible();

    const headers    = await carPage.getCommentTableHeaders();
    const normalized = headers.map(h => h.trim().toLowerCase());
    expect(normalized).toContain('date');
    expect(normalized).toContain('author');
    expect(normalized).toContain('comment');

    // BUG: Author siempre vacío falla aquí
    const authorCell = carPage.commentRows.first().locator('td:nth-child(2)');
    const authorText = (await authorCell.innerText()).trim();
    expect(
      authorText.length,
      'BUG: columna Author esta vacia, no muestra el nombre del usuario'
    ).toBeGreaterThan(0);
  });

  // CA5 OK
  test('CA5 - Vista del auto muestra descripcion, especificacion y votos', async ({ page }) => {
    await goToCar(page);
    const carPage = new CarPage(page);

    await expect(carPage.carDescription).toBeVisible();
    expect((await carPage.carDescription.innerText()).trim().length).toBeGreaterThan(0);

    await expect(carPage.carSpecification).toBeVisible();
    expect((await carPage.carSpecification.innerText()).trim().length).toBeGreaterThan(0);

    await expect(carPage.totalVotes).toBeVisible();
    expect(await carPage.getTotalVotesCount()).toBeGreaterThanOrEqual(0);
  });

});
