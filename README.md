# 🚗 CheckMyVehicle - Prueba Full-Stack

¡Bienvenido a CheckMyVehicle! Esta es una aplicación web completa diseñada para un centro de servicios automotrices. Permite gestionar el registro de vehículos, agendar revisiones y, lo más importante, se integra con un proveedor de telemática externo a través de un WebService SOAP para sincronizar vehículos y consultar su ubicación en tiempo real.

## ✨ Características Principales

-   **Integración SOAP:** Consume un WebService externo para: #Aún intentando modificar esta parte ya que no me esta haciendo el consumo de la API
    -   Sincronizar la flota de vehículos desde el proveedor.
    -   Consultar la última ubicación conocida de un vehículo bajo demanda.
-   **Gestión de Vehículos:**
    -   Crear, leer y consultar vehículos en una base de datos local.
    -   Ver una vista detallada con la información del vehículo y su última revisión completada.
-   **Sistema de Revisiones:**
    -   Agendar nuevas revisiones para cualquier vehículo con fechas, horas y un listado dinámico de ítems a revisar.
    -   Registrar los resultados de cada ítem de una revisión (técnico, comentarios).
    -   Consultar un listado de todas las revisiones pendientes del taller.
-   **Visualización Geográfica:**
    -   Muestra la ubicación del vehículo en un mapa interactivo utilizando OpenStreetMap y Leaflet.
-   **Entorno Dockerizado:** Toda la aplicación (Frontend, Backend, Base de Datos) está contenerizada con Docker y orquestada con Docker Compose para un despliegue y desarrollo fácil, consistente y replicable.

## 🛠️ Stack Tecnológico

-   **Frontend:**
    -   **React.js**: Librería principal para la interfaz de usuario.
    -   **React Router**: Para la navegación y el enrutamiento del lado del cliente.
    -   **Axios**: Para realizar peticiones HTTP a la API del backend.
    -   **React Leaflet**: Para la integración de mapas interactivos.
-   **Backend:**
    -   **Node.js** con **Express.js**: Para construir una API RESTful robusta y ligera.
    -   **node-soap**: Librería para consumir el WebService SOAP externo.
    -   **mysql2**: Driver para la conexión con la base de datos MySQL.
-   **Base de Datos:**
    -   **MySQL 8.0**: Sistema de gestión de bases de datos relacional.
-   **Contenerización y Despliegue:**
    -   **Docker y Docker Compose**: Para crear y gestionar el entorno de la aplicación.
    -   **Nginx**: Como servidor web para servir el frontend de React y como proxy inverso para las llamadas a la API.

## 📁 Estructura del Proyecto
checkmyvehicle/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── services/
│ │ └── config/
│ ├── .env # Archivo de variables de entorno (debe ser creado)
│ ├── Dockerfile
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ └── pages/
│ ├── Dockerfile
│ ├── nginx.conf # Configuración del proxy inverso de Nginx
│ └── package.json
├── db/
│ └── init.sql # Script de inicialización de la base de datos
│
├── docker-compose.yml # Orquestador principal de los servicios Docker
└── README.md # Este archivo


## 🚀 Cómo Empezar

Sigue estos pasos para levantar la aplicación completa en tu entorno local.

### Prerrequisitos

-   **Git** instalado para clonar el repositorio.
-   **Docker** y **Docker Compose** instalados y en ejecución en tu sistema.

### Guía de Instalación

1.  **Clona el Repositorio**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd checkmyvehicle
    ```

2.  **Crea el Archivo de Variables de Entorno (`.env`)**

    Este paso es **crucial**. En la carpeta `backend/`, crea un nuevo archivo llamado `.env` y pega el siguiente contenido. Contiene las credenciales para la base de datos y el servicio SOAP.

    **Ubicación:** `backend/.env`
    **Contenido:**
    ```
    # Credenciales de la Base de Datos (deben coincidir con docker-compose.yml)
    DB_HOST=db
    DB_USER=root
    DB_PASSWORD=secret
    DB_DATABASE=checkmyvehicle

    # Credenciales del WebService SOAP Externo
    SOAP_USER=usuariodemo
    SOAP_PASSWORD=demo2025*
    ```

3.  **Construye y Levanta los Contenedores**

    Desde la **carpeta raíz** del proyecto (`checkmyvehicle/`), ejecuta el siguiente comando. Este único comando se encargará de todo:

    ```bash
    docker-compose up --build
    ```
    -   `--build`: Fuerza la reconstrucción de las imágenes de Docker, asegurando que se incluyan todos tus cambios.
    -   Este proceso puede tardar unos minutos la primera vez mientras se descargan las imágenes base y se instalan las dependencias.

4.  **Accede a la Aplicación**

    Una vez que los logs en la terminal se estabilicen y veas mensajes de que la base de datos y el servidor están listos, abre tu navegador web y ve a:

    ➡️ **[http://localhost:3000](http://localhost:3000)**

## 📋 Flujo de Uso de la Aplicación

1.  **Sincronizar Vehículos:** La primera acción recomendada es ir a la pestaña **Vehículos** y hacer clic en el botón **"Sincronizar Vehículos desde Proveedor"**. Esto llamará a la API SOAP externa y poblará la base de datos local.
    *(Nota: Si la API de demo no devuelve vehículos, la tabla permanecerá vacía, pero la funcionalidad de la app sigue siendo correcta).*

2.  **Crear un Vehículo Manualmente:** Puedes registrar vehículos que no estén en el servicio externo usando el botón "Nuevo Vehículo".

3.  **Ver Detalles:** Haz clic en la **placa** de cualquier vehículo para navegar a su página de detalles.

4.  **Consultar Ubicación:** En la página de detalles de un vehículo **sincronizado**, haz clic en "Consultar Ubicación Actual" para ver su última posición conocida en un mapa.

5.  **Agendar y Gestionar Revisiones:**
    -   Desde la página de detalles, puedes agendar una nueva revisión.
    -   En la pestaña principal de **Revisiones**, puedes ver todas las revisiones pendientes y actualizar el resultado de cada ítem (añadir técnico y comentarios).

## 🗄️ API Endpoints del Backend

El backend expone la siguiente API REST para ser consumida por el frontend:

| Método | Ruta                      | Descripción                                           |
| :----- | :------------------------ | :---------------------------------------------------- |
| `POST` | `/api/vehicles/sync`      | Dispara la sincronización con el WebService SOAP.     |
| `GET`  | `/api/vehicles`           | Obtiene todos los vehículos de la base de datos local. |
| `POST` | `/api/vehicles`           | Crea un nuevo vehículo manualmente en la BD.          |
| `GET`  | `/api/vehicles/:plate`    | Obtiene los detalles de un vehículo por su placa.     |
| `GET`  | `/api/vehicles/location/:mid` | Obtiene la ubicación de un vehículo desde el SOAP.    |
| `POST` | `/api/revisions`          | Agenda una nueva revisión.                            |
| `GET`  | `/api/revisions/pending`  | Obtiene todas las revisiones con estado pendiente.    |
| `PUT`  | `/api/revisions/:revId/items/:itemId` | Actualiza un ítem específico de una revisión. |

## 🐳 Comandos Útiles de Docker

-   **Detener la aplicación:**
    ```bash
    docker-compose down
    ```
-   **Detener y eliminar volúmenes de datos (reset completo de la BD):**
    ```bash
    docker-compose down -v
    ```
-   **Ver los logs de un servicio específico en tiempo real:**
    ```bash
    docker-compose logs -f backend
    # O también:
    docker-compose logs -f frontend
    ```
-   **Ejecutar la aplicación en segundo plano:**
    ```bash
    docker-compose up -d --build
    ```
---
