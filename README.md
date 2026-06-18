# Buggy Cars Rating — Test Suite con Playwright

Automatización de pruebas para la Historia de Usuario de votación y comentarios en [Buggy Cars Rating](https://buggy.justtestit.org/).

---

## Instalación

### Requisitos previos
- Node.js 18 o superior

### Windows
```bash
npm init playwright@latest
# Seleccionar: JavaScript, carpeta tests, no GitHub Actions, instalar browsers
npx playwright install
```

### Linux
```bash
npm init playwright@latest
npx playwright install
npx playwright install-deps
```

### macOS
```bash
npm init playwright@latest
npx playwright install
```

> Si al correr aparece `SyntaxError: Cannot use import statement outside a module`, agregar `"type": "module"` en el `package.json`.

---

## Estructura del proyecto

```
├── pages/
│   ├── LoginPage.js      # Page Object: login y sesión
│   ├── HomePage.js       # Page Object: lista de autos
│   └── CarPage.js        # Page Object: vista detalle del auto
├── tests/
│   └── voting.spec.js    # Suite de tests (5 casos)
├── playwright.config.js
└── README.md
```

---

## Configuración

Crear una cuenta en https://buggy.justtestit.org/register y definir las credenciales:

```bash
# Windows
$env:BUGGY_USER="tu_usuario"; $env:BUGGY_PASS="tu_password"

# Linux / macOS
export BUGGY_USER="tu_usuario"
export BUGGY_PASS="tu_password"
```

O editar directamente las líneas 5-6 de `tests/voting.spec.js`:
```js
const VALID_USER = 'tu_usuario';
const VALID_PASS = 'tu_password';
```

> **Importante:** CA3 consume el voto del usuario. Usar un usuario nuevo si se necesita correr el test completo más de una vez.

---

## Ejecución

```bash
# Correr todos los tests
npx playwright test

# Modo visual (ver el navegador)
npx playwright test --headed

# Ver reporte HTML
npx playwright show-report
```

---

## Casos de prueba

| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| CA1 | El usuario puede votar solo con sesión activa | ✅ PASS |
| CA2 | Sin sesión: botón Vote! y campo comentario no visibles | ✅ PASS |
| CA3 | Usuario autenticado puede dejar comentario opcional | ❌ FAIL |
| CA4 | Tabla muestra columnas Date, Author y Comment con datos | ❌ FAIL |
| CA5 | Vista del auto muestra descripción, especificación y votos | ✅ PASS |

---

## Defectos encontrados

### BUG-01 — Comentario de uso único (CA3)
**Severidad:** Media  
**Descripción:** Tras realizar un voto, el formulario de comentario desaparece del DOM. El usuario no puede agregar un comentario de forma opcional en otro momento.  
**Comportamiento esperado:** El campo de comentario debe estar disponible de forma opcional en cualquier momento para usuarios autenticados.  
**Comportamiento actual:** El formulario solo está disponible antes del primer voto. Una vez votado, desaparece permanentemente.

### BUG-02 — Columna Author vacía (CA4)
**Severidad:** Media  
**Descripción:** La tabla de comentarios incluye la columna Author en el encabezado pero no muestra el nombre del usuario en ninguna fila.  
**Comportamiento esperado:** La columna Author debe mostrar el nombre del usuario que dejó el comentario.  
**Comportamiento actual:** La celda Author aparece vacía en todos los registros (`<td></td>`).

---

## Aplicación bajo prueba

- **URL:** https://buggy.justtestit.org/
- **Auto testeado:** Lamborghini Aventador
- **Framework:** Angular (SPA)
