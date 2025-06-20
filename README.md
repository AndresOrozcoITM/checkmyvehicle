# CheckMyVehicle Fullstack Application

Este proyecto es una aplicación full-stack para el control de revisiones de vehículos, integrando un servicio SOAP externo y utilizando ReactJS para el frontend y Node.js/Express.js para el backend con MySQL como base de datos.

## Estructura del Proyecto
checkmyvehicle/
├── frontend/             # Aplicación ReactJS
│   ├── public/
│   ├── src/
│   ├── package.json
├── backend/              # Servidor Node.js/Express.js
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── database/             # Esquema de la base de datos MySQL
│   └── checkmyvehicle_schema.sql
└── README.md


## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

* **Node.js** (versión 14 o superior recomendada) y **npm** (viene con Node.js)
* **MySQL Server** (versión 5.7 o superior recomendada)

## Configuración de la Base de Datos

1.  **Crea la base de datos y tablas**:
    * Abre tu cliente MySQL (ej. MySQL Workbench, línea de comandos `mysql`).
    * Ejecuta el script `database/checkmyvehicle_schema.sql` para crear la base de datos (`checkmyvehicle_db`) y las tablas (`vehicles`, `revisions`).

    ```bash
    mysql -u your_mysql_user -p < database/checkmyvehicle_schema.sql
    ```
    Reemplaza `your_mysql_user` con tu usuario de MySQL. Te pedirá tu contraseña.

## Configuración y Ejecución del Backend

1.  **Navega a la carpeta del backend**:
    ```bash
    cd checkmyvehicle/backend
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno**:
    * Crea un archivo llamado `.env` en la raíz de la carpeta `backend` (junto a `package.json`).
    * Copia el contenido del bloque `.env` proporcionado anteriormente y **reemplaza los placeholders** con tus credenciales de MySQL y las credenciales del servicio SOAP (si son diferentes a las de demo).

    ```
    PORT=3001

    DB_HOST=localhost
    DB_USER=YOUR_MYSQL_USER
    DB_PASSWORD=YOUR_MYSQL_PASSWORD
    DB_NAME=YOUR_MYSQL_DATABASE

    SOAP_USER=usuariodemo
    SOAP_PASSWORD=demo2025*
    SOAP_FLEET_ID=2549
    SOAP_WSDL_MOBILELIST=[http://sonaravl.com/webservices/telematics.asmx?wsdl](http://sonaravl.com/webservices/telematics.asmx?wsdl)
    SOAP_WSDL_LASTLOCATION=[http://sonaravl.com/webservices/telematics.asmx?wsdl](http://sonaravl.com/webservices/telematics.asmx?wsdl)
    ```

4.  **Ejecuta el servidor backend**:
    ```bash
    npm start
    # O para desarrollo con reinicio automático en cambios de código:
    npm run dev
    ```
    El servidor se ejecutará en `http://localhost:3001`. Al iniciar, intentará sincronizar la lista de vehículos desde el servicio SOAP al MySQL.

## Configuración y Ejecución del Frontend

1.  **Navega a la carpeta del frontend**:
    ```bash
    cd checkmyvehicle/frontend
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecuta la aplicación React**:
    ```bash
    npm start
    ```
    Esto abrirá la aplicación en tu navegador predeterminado (generalmente `http://localhost:3000`).

## Funcionalidades Implementadas (con Mocks en Frontend)

* **Listado y Consulta de Vehículos**: Muestra los vehículos. La integración con el backend permitirá traerlos de MySQL.
* **Creación de Nuevo Vehículo**: Formulario para añadir un nuevo vehículo. Los datos se enviarán al backend.
* **Detalles del Vehículo**: Muestra información del vehículo y su última revisión. Incluye un placeholder para la ubicación en el mapa.
* **Agendamiento de Nueva Revisión**: Permite programar una revisión para un vehículo seleccionado.
* **Registro de Resultados de Revisión Pendiente**: Permite al técnico registrar comentarios y su nombre para cada ítem de una revisión.

## Puntos a Desarrollar/Mejorar

* **Integración Frontend-Backend Completa**: Actualmente, el frontend usa datos mock. Necesitarás conectar cada componente para que realice llamadas `fetch` o `axios` a los endpoints del backend (`/api/vehicles`, `/api/revisions`, etc.).
* **Manejo de Errores en Frontend**: Reemplazar los `alert()` con modales o notificaciones más amigables.
* **Integración de OpenStreetMap**: Utilizar una librería de React para mapas (ej. `react-leaflet`) para mostrar la ubicación real del vehículo.
* **Persistencia de Revisiones**: El backend ya tiene un esquema para guardar revisiones, pero el frontend necesitará llamar a esas APIs.
* **Interfaz de Usuario**: Aplicar estilos más avanzados y refinar la experiencia de usuario según tus preferencias.
* **Validaciones en Backend**: Añadir validaciones robustas a las entradas de las APIs del backend.
* **Autenticación y Autorización**: Implementar un sistema de usuarios (ej. JWT) para asegurar las APIs y diferenciar roles (ej. técnicos, administradores).
* **Pruebas**: Escribir pruebas unitarias e de integración para el frontend y el backend.

