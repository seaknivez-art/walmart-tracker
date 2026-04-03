const { chromium } = require('playwright');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Sucursales a rastrear (IDs reales de Walmart México)
const STORES = [
  { id: '1087', name: 'Walmart Insurgentes CDMX' },
  { id: '1093', name: 'Walmart Perisur CDMX' },
  { id: '1102', name: 'Walmart Satélite EdoMex' },
];

// Departamentos con sus slugs en walmart.com.mx
const DEPARTMENTS = [
  { slug: 'frutas-y-verduras', name: 'Frutas y Verduras' },
  { slug: 'carnes-y-pescados', name: 'Carnes y Pescados' },
  { slug: 'lacteos-y-huevo',   name: 'Lácteos y Huevo' },
  { slug: 'bebidas',           name: 'Bebidas' },
];

async function scrapeStore(page, store, department) {
  const url = `https://www.walmart.com.mx/tienda/${store.id}/${department.slug}?page=1`;
  const products = [];

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });

    const items = await page.$$eval('[data-testid="product-card"]', (cards) =>
      cards.map((card) => {
        const name  = card.querySelector('[data-testid="product-title"]')?.textContent?.trim() || '';
        const price = card.querySelector('[data-testid="price-integer"]')?.textContent?.trim() || '';
        const priceOld = card.querySelector('[data-testid="price-old"]')?.textContent?.trim() || '';
        const sku   = card.getAttribute('data-sku') || '';
        return { name, price, priceOld, sku };
      })
    );

    for (const item of items) {
      if (!item.name || !item.price) continue;
      const priceNum    = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      const priceOldNum = item.priceOld ? parseFloat(item.priceOld.replace(/[^0-9.]/g, '')) : null;
      const discount    = priceOldNum ? Math.round(((priceOldNum - priceNum) / priceOldNum) * 100) : 0;

      products.push({
        timestamp:   new Date().toISOString(),
        sucursal:    store.name,
        storeId:     store.id,
        departamento: department.name,
        sku:         item.sku,
        producto:    item.name,
        precio:      priceNum,
        precioAnterior: priceOldNum,
        descuento:   discount,
      });
    }
  } catch (err) {
    console.warn(`⚠ Error en ${store.name} / ${department.name}: ${err.message}`);
  }

  return products;
}

async function writeToSheets(allProducts) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Hoja: Registro histórico (append)
  const rows = allProducts.map((p) => [
    p.timestamp, p.sucursal, p.departamento, p.sku,
    p.producto, p.precio, p.precioAnterior || '', p.descuento,
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Historial!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  // Hoja: Precios actuales (sobreescribir)
  const header = [['Timestamp','Sucursal','Departamento','SKU','Producto','Precio','Precio Anterior','Descuento %']];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Actuales!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [...header, ...rows] },
  });

  // Hoja: Resumen por sucursal
  const resumen = {};
  for (const p of allProducts) {
    if (!resumen[p.sucursal]) resumen[p.sucursal] = { total: 0, descuentos: 0 };
    resumen[p.sucursal].total++;
    if (p.descuento > 0) resumen[p.sucursal].descuentos++;
  }
  const resumenRows = Object.entries(resumen).map(([s, v]) => [
    new Date().toISOString(), s, v.total, v.descuentos,
  ]);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Resumen!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: resumenRows },
  });

  console.log(`✓ ${allProducts.length} productos escritos en Google Sheets`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'es-MX' });
  const page = await context.newPage();

  const allProducts = [];

  for (const store of STORES) {
    for (const dept of DEPARTMENTS) {
      console.log(`Scraping: ${store.name} / ${dept.name}`);
      const products = await scrapeStore(page, store, dept);
      allProducts.push(...products);
      // Pausa para no bloquear
      await page.waitForTimeout(2000 + Math.random() * 1000);
    }
  }

  await browser.close();

  // Guardar JSON de respaldo
  const outDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, 'prices.json');
  fs.writeFileSync(outFile, JSON.stringify(allProducts, null, 2));
  console.log(`✓ ${allProducts.length} productos guardados en data/prices.json`);

  // Subir a Google Sheets
  if (process.env.GOOGLE_SERVICE_ACCOUNT && process.env.SPREADSHEET_ID) {
    await writeToSheets(allProducts);
  } else {
    console.warn('⚠ Sin credenciales de Sheets — solo guardado local');
  }
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
