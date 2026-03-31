# Fund Management

## 🚀 Introducción

Aplicación web desarrollada en Angular con arquitectura hexagonal para gestionar la
suscripción y cancelación de fondos de inversión (FPV/FIC) para un usuario BTG. El objetivo es
ofrecer una experiencia clara y responsiva para consultar fondos, gestionar participación y
revisar el historial de operaciones.

## ✅ Requisitos funcionales

1. Visualizar la lista de fondos disponibles.
2. Suscribirse a un fondo, si cumple con el monto mínimo.
3. Cancelar su participación en un fondo y ver el saldo actualizado.
4. Visualizar el historial de transacciones (suscripciones y cancelaciones).
5. Seleccionar método de notificación (email o SMS) al realizar una suscripción.
6. Mostrar mensajes de error apropiados si no hay saldo suficiente.

## 🛠️ Requisitos técnicos

- Usar Angular.
- Utilizar buenas prácticas de diseño UI/UX.
- Manejo de estado con servicios, signals y comunicación reactiva en Angular.
- Validaciones de formularios/campos de entrada.
- Diseño responsivo y experiencia de usuario clara.
- Consumo de datos desde una API REST simulada (en este proyecto se usan mocks locales).
- Manejo adecuado de errores, estados de carga y feedback visual.
- Código limpio, estructurado y comentado.

## ⭐ Extras valorados (no obligatorios)

- Pruebas unitarias de componentes.
- Uso de TypeScript en Angular.
- Navegación y ruteo con Angular Router.
- Uso de componentes reutilizables.

## 🌐 Despliegue

La aplicación está desplegada en GitHub Pages:

- [https://cvillar6.github.io/fund-management/](https://cvillar6.github.io/fund-management/)

## 📦 Datos disponibles (mock)

| ID | Nombre                         | Monto mínimo | Categoría |
|----|--------------------------------|--------------|-----------|
| 1  | FPV_BTG_PACTUAL_RECAUDADORA    | COP $75.000  | FPV       |
| 2  | FPV_BTG_PACTUAL_ECOPETROL      | COP $125.000 | FPV       |
| 3  | DEUDAPRIVADA                   | COP $50.000  | FIC       |
| 4  | FDO-ACCIONES                   | COP $250.000 | FIC       |
| 5  | FPV_BTG_PACTUAL_DINAMICA       | COP $100.000 | FPV       |

## 👤 Usuario mock

- Nombre: Camilo Villa
- Saldo inicial: COP $500.000

## ⚙️ Instalación y ejecución del proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/cvillar6/fund-management.git
cd fund-management
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
npm start
```

4. Abre en navegador:

```text
http://localhost:4200/
```

## 🧪 Ejecutar tests

Este proyecto usa Vitest con Angular test runner.

```bash
npm test
```
