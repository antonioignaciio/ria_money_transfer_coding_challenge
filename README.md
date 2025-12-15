# 💱 Currency Exchange Dashboard

Un dashboard de conversión de divisas construido con Next.js que permite a los usuarios convertir monedas y ver tasas de cambio en tiempo real.

## 🌐 Live Demo

**Aplicación desplegada:** [https://ria-money-transfer-coding-challenge.vercel.app](https://ria-money-transfer-coding-challenge.vercel.app)

## 📋 Descripción del Proyecto

Este proyecto es una aplicación web moderna que proporciona herramientas esenciales para personas que realizan transferencias internacionales de dinero. Incluye:

- **Conversor de Divisas**: Permite convertir cantidades entre diferentes monedas de forma rápida y precisa con conversión automática
- **Tasas de Cambio Actuales**: Muestra las tasas de cambio actuales para las principales monedas del mundo con selector de moneda base
- **Tendencia Histórica**: Visualiza la tendencia de cambio de un par de monedas en los últimos 7 días con un gráfico profesional interactivo
- **Búsqueda por Fecha**: Permite consultar tasas de cambio históricas para cualquier fecha específica (hasta 1 año atrás)

## 🚀 Instrucciones de Setup

### Prerrequisitos

- Node.js 18+ 
- Yarn (o npm/pnpm)

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd currency-dashboard
```

2. Instala las dependencias:
```bash
yarn install
# o
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
yarn dev
# o
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

### Build para Producción

```bash
yarn build
yarn start
```

## ✨ Característica Innovadora: Tendencia Histórica

### ¿Qué agregué?

Implementé un componente de **Tendencia Histórica** que muestra la evolución de las tasas de cambio de un par de monedas seleccionado durante los últimos 7 días.

### ¿Por qué la elegí?

Para alguien que envía dinero internacionalmente, el timing es crucial. Las tasas de cambio fluctúan constantemente, y enviar dinero en el momento equivocado puede resultar en pérdidas significativas. Esta característica ayuda a:

1. **Tomar decisiones informadas**: Ver si la tendencia es alcista o bajista antes de realizar una transferencia
2. **Optimizar el timing**: Identificar el mejor momento para enviar dinero basándose en datos históricos
3. **Reducir ansiedad**: Proporcionar transparencia sobre cómo han cambiado las tasas recientemente

### ¿Cómo mejora la experiencia del usuario?

- **Gráfico profesional**: Utiliza Recharts con un AreaChart moderno que muestra la evolución de las tasas con un gradiente azul elegante
- **Visualización clara**: Muestra la tendencia con indicadores visuales (↗ alza, ↘ baja) y colores (verde/rojo)
- **Cambio porcentual**: Calcula y muestra el porcentaje de cambio entre el primer y último día
- **Tooltip interactivo**: Al pasar el mouse sobre el gráfico, muestra la fecha y tasa exacta
- **Contexto histórico**: Presenta los últimos 7 días de datos en formato visual intuitivo
- **Integración fluida**: Se actualiza automáticamente cuando el usuario cambia las monedas en el conversor
- **Responsive**: El gráfico se adapta perfectamente a diferentes tamaños de pantalla

Esta característica transforma el dashboard de una simple herramienta de conversión en una plataforma de análisis profesional que empodera a los usuarios para tomar mejores decisiones financieras.

## 🤖 Uso de IA

Durante el desarrollo de este proyecto, utilicé herramientas de IA (específicamente Cursor AI) para:

- **Asistencia en la estructura del código**: Ayuda para organizar componentes y hooks de manera limpia
- **Revisión de código**: Sugerencias para mejorar la calidad del código TypeScript
- **Optimización de UX**: Ideas para mejorar la experiencia del usuario y la accesibilidad
- **Documentación**: Ayuda para escribir documentación clara y completa

Todas las decisiones arquitectónicas, la lógica de negocio y las implementaciones fueron realizadas por mí, utilizando la IA como herramienta de asistencia.

## 🏗️ Arquitectura y Decisiones Técnicas

### Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS 4
- **Gráficos**: Recharts (para visualización de datos financieros)
- **API**: Frankfurter API (gratuita, sin API key)

### Estructura del Proyecto

```
currency-dashboard/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal con Navbar
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── Converter.tsx      # Conversor de divisas
│   ├── ExchangeRates.tsx  # Tabla de tasas de cambio
│   ├── HistoricalTrend.tsx # Tendencia histórica con gráfico (bonus)
│   ├── DateRateLookup.tsx # Búsqueda de tasas por fecha
│   └── Navbar.tsx         # Barra de navegación
├── hooks/                 # Custom hooks
│   └── useCurrencies.ts   # Hook para obtener monedas
├── lib/                   # Utilidades y lógica de negocio
│   ├── frankfurter.ts     # Cliente API de Frankfurter
│   ├── constants.ts       # Constantes del proyecto
│   └── utils.ts           # Funciones utilitarias
└── types/                 # Definiciones TypeScript
    └── index.ts           # Tipos e interfaces
```

### Suposiciones y Trade-offs

#### Suposiciones

1. **Monedas principales**: Asumí que las 11 monedas principales (EUR, USD, GBP, JPY, AUD, CAD, CHF, CNY, SEK, NZD, MXN) cubren la mayoría de casos de uso para transferencias internacionales
2. **Período histórico**: Elegí 7 días como período histórico porque proporciona suficiente contexto sin sobrecargar la API
3. **Idioma**: La aplicación está en español, asumiendo que el usuario objetivo habla español

#### Trade-offs

1. **Conversión automática con debounce**: 
   - **Decisión**: Conversión automática con delay de 500ms después del último cambio
   - **Razón**: Balance entre conveniencia y eficiencia, evita llamadas excesivas mientras el usuario escribe
   - **Trade-off**: Pequeño delay pero mejor UX que conversión manual

2. **Filtrado de monedas principales**:
   - **Decisión**: Mostrar solo 11 monedas principales en ExchangeRates
   - **Razón**: Mejor UX al evitar sobrecargar la interfaz
   - **Trade-off**: No muestra todas las monedas disponibles, pero cumple el requisito de "al menos 10"

3. **Sin caché de datos**:
   - **Decisión**: Cada cambio recarga los datos desde la API
   - **Razón**: Siempre muestra datos actualizados
   - **Trade-off**: Más llamadas a la API pero datos más frescos

4. **Endpoints de API**:
   - **Decisión**: Implementados todos los endpoints disponibles de Frankfurter API
   - **Razón**: Máxima funcionalidad y flexibilidad para el usuario
   - **Trade-off**: Más código pero mejor cobertura de casos de uso

## 🔍 Cumplimiento de Requisitos

### Requisitos Técnicos ✅

- ✅ Next.js 14+ (App Router) - Usando Next.js 16
- ✅ TypeScript - Todo el código está tipado
- ✅ Styling - Tailwind CSS 4
- ✅ Gráficos - Recharts para visualización profesional
- ✅ API - Frankfurter API implementada correctamente (todos los endpoints disponibles)

### Requisitos Funcionales ✅

#### 1. Currency Converter ✅
- ✅ Usuario puede ingresar un monto
- ✅ Usuario puede seleccionar moneda "from" y "to"
- ✅ Muestra el monto convertido
- ✅ Conversión automática con debounce al cambiar monedas o monto
- ✅ Validación de monedas diferentes y montos válidos

#### 2. Exchange Rates Overview ✅
- ✅ Muestra tasas de cambio actuales para al menos 10 monedas principales (11 implementadas)
- ✅ Permite cambiar la moneda base

### Bonus ✅
- ✅ Característica innovadora: Tendencia Histórica con gráfico profesional
- ✅ Búsqueda de tasas por fecha específica
- ✅ Visualización moderna tipo fintech con Recharts
- ✅ Explicación incluida en este README

## 🚀 Mejoras Futuras (con más tiempo)

1. ✅ **Conversión automática con debounce**: ✅ **IMPLEMENTADO** - Conversión automática con delay de 500ms

2. **Caché de datos**: Implementar caché para reducir llamadas a la API y mejorar rendimiento

3. ✅ **Gráficos interactivos**: ✅ **IMPLEMENTADO** - Gráfico profesional con Recharts (AreaChart con gradiente)

4. **Notificaciones de alerta**: Permitir a los usuarios configurar alertas cuando una tasa alcance un valor específico

5. **Comparación de múltiples pares**: Permitir comparar varios pares de monedas simultáneamente

6. **Modo oscuro**: Agregar soporte para tema oscuro

7. **PWA**: Convertir en Progressive Web App para uso offline

8. **Tests**: Agregar tests unitarios y de integración

9. **Internacionalización**: Soporte para múltiples idiomas

10. **Optimización de rendimiento**: Implementar React.memo y useMemo donde sea apropiado

## 📝 Notas Adicionales

- La aplicación es completamente responsive y funciona bien en dispositivos móviles
- Todos los componentes incluyen estados de carga y manejo de errores
- La aplicación sigue principios de accesibilidad (ARIA labels, navegación por teclado)
- El código sigue principios SOLID y DRY
- Diseño moderno tipo fintech con gráficos profesionales y UI limpia
- Todos los endpoints de la API de Frankfurter están implementados y disponibles
- Layout optimizado con componentes organizados visualmente (Tendencia y Búsqueda por Fecha lado a lado)
