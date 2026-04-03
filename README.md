# 🛒 Walmart Tracker

Sistema automático de monitoreo de precios y disponibilidad de productos en sucursales físicas de Walmart.

## 📋 Características

✅ **Scraping automático** cada 6 horas  
✅ **Excel profesional** con 5 hojas organizadas  
✅ **Menús plegables** por sucursal  
✅ **Datos categorizados** por departamento  
✅ **Análisis de precios** y descuentos  
✅ **GitHub Actions** para automatización  

## 📊 Estructura del Excel

El archivo generado contiene 5 hojas:

1. **📋 Resumen** - Métricas globales
2. **📈 Detalles** - Listado completo de productos
3. **🏪 Análisis Sucursal** - Análisis por tienda
4. **🎁 Descuentos** - Productos en promoción
5. **📊 Por Departamento** - Estadísticas por departamento

## 🚀 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/seaknivez-art/walmart-tracker.git
cd walmart-tracker

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar scraper
npm run scrape
```

## 📁 Estructura de Carpetas

```
walmart-tracker/
├── scripts/
│   ├── scraper.js       # Script principal de scraping
│   └── utils.js         # Funciones de utilidad
├── data/                # Archivos generados (JSON y Excel)
├── .github/workflows/   # Configuración de GitHub Actions
├── package.json         # Dependencias del proyecto
├── .env.example         # Plantilla de variables de entorno
└── README.md           # Este archivo
```

## 📈 Datos Capturados

- **Fecha y Hora** de actualización
- **Sucursal** (nombre, ciudad, estado)
- **Departamento** y Categoría del producto
- **Código SKU** único
- **Nombre del Producto**
- **Precio Anterior** y **Precio Actual**
- **Descuento (%)** y **Variación (%)**
- **Stock** disponible
- **Disponibilidad** (Sí/No)

## ⚙️ Configuración

Edita el archivo `.env` con:

```env
API_KEY=tu_clave_aqui
WALMART_STORES_TO_MONITOR=5
```

## 🔄 Automatización con GitHub Actions

El workflow se ejecuta automáticamente cada 6 horas. Puedes:

- ✅ Ver el historial en la pestaña **Actions**
- ✅ Descargar archivos desde **Artifacts**
- ✅ Ejecutar manualmente: Actions → Update Walmart Prices → Run workflow

## 📊 Visualización de Datos

Los archivos Excel generados incluyen:

- 🎨 **Estilos profesionales** con colores y formatos
- 🔍 **Filtros automáticos** en todas las columnas
- 📌 **Menús plegables** por sucursal
- 💰 **Formato de moneda** en precios
- 📈 **Análisis y estadísticas** automáticas

## 📝 Notas

- Los archivos se generan en formato Excel (.xlsx) y JSON
- Se guardan en la carpeta `/data/` con la fecha del día
- El historial se mantiene para análisis históricos
- Los datos se actualizan automáticamente cada 6 horas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

Para preguntas o sugerencias: [seaknivez@gmail.com](mailto:seaknivez@gmail.com)