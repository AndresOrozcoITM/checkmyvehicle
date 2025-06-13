const mysql = require('mysql2'); // Importamos el paquete mysql2 para conectarnos a la base de datos MySQL

const connection = mysql.createConnection({ // Creamos una conexión a la base de datos
  host: 'localhost', //Docker servicer name, le docker es un contenedor
  user: 'root',
  password: 'root', //usuario y ocntraseña de la bd es root para no complicarme
  database: 'checkmyvehicle', //Ya que llame la base de datos como el proyecto
});

connection.connect((err) => { // Conectamos a la base de datos
  if (err) { // Si hay un error al conectar
    console.error('Error connecting to the database:', err); // Mostramos el error concatenando un mensaje
    console.error('Please check your database connection settings.'); // Sugiero revisar la configuración de conexión
    return; // Salimos de la función
  }
  console.log('Connected to the database'); // Si no hay error, mostramos un mensaje de éxito
});

module.exports = connection; // Exportamos la conexión para poder usarla en otros archivos