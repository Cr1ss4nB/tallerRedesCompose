# Ejercicio 1 - Docker Compose con Neo4j y API en Express

## Introducción
En este ejercicio desarrollé un **docker-compose.yml** con dos servicios:
1. Una API en Node.js con Express.
2. Una base de datos Neo4j.

La API tiene:
- **Un endpoint GET** para mostrar los datos (`/artworks`).
- **Un endpoint POST** para crear un nuevo registro en la base de datos.

Me basé en el **trabajo anterior**, donde ya tenía cargada la base de datos con información de **artworks**.  
El objetivo de esta primera parte (puntos 1 y 2) fue comprobar el comportamiento usando la **red bridge por defecto**.

---

## Evidencias solicitadas

### 1. Archivos principales

- **docker-compose.yml** → Configuración de dos servicios (`neo4j` y `backend`) conectados sin red definida explícita (usando bridge por defecto).
<img width="793" height="868" alt="image" src="https://github.com/user-attachments/assets/a2679066-de79-421e-9a56-b74ad02ced83" />


- **.env** → Variables de entorno con credenciales y configuración de conexión.
<img width="795" height="231" alt="image" src="https://github.com/user-attachments/assets/c321754f-16cc-41c3-85f1-3ef1a41d4390" />

  
- **Dockerfile** → Imagen personalizada para la API en Express.
<img width="795" height="367" alt="image" src="https://github.com/user-attachments/assets/6d3895dc-ddad-4468-9d3e-7c460f921671" />


- **package.json** → Dependencias del backend, incluyendo `express`, `neo4j-driver` y `dotenv`.
<img width="620" height="437" alt="image" src="https://github.com/user-attachments/assets/ce7f01a3-e3fb-46bc-9388-c21700f45016" />

---

### 2. Prueba de ejecución

- Con ayuda del docker compose ps se puede apreciar que los servicios están arriba.
<img width="1910" height="248" alt="image" src="https://github.com/user-attachments/assets/a1db2c63-893e-42d3-a950-a11642e3f154" />

     
- Acceso a la URL `http://localhost:3000/artworks` en el navegador, mostrando la respuesta de error (fallo en la conexión).

  <img width="1909" height="317" alt="image" src="https://github.com/user-attachments/assets/7ff8f821-ca02-4123-8e2e-22465fe669a6" />
  <img width="1918" height="81" alt="image" src="https://github.com/user-attachments/assets/59d99412-1a5c-462b-9344-f132d0e0e399" />


---

Cuando no se declara una red user-defined en el docker-compose.yml, todos los contenedores se conectan por defecto a la red bridge de Docker.
Al estar en esa red bridge los contenedores no pueden resolverse por nombre de servicio sino solo por localhost o por IP interna (que como fue mencionado en clase, cambia siempre que apagamos o reiniciamos la máquina).
Como en el backend al conectarse a mi Neo4j usaba NEO4J_URI=bolt://neo4j:7687, dicho nombre no se resuelve dentro de la red bridge predeterminada, encontes el contenedor backend no encuentra el contenedor de la base de datos y por eso el error de *Failed to connect to server...*

El siguiente paso ahora es crear un user-defined en el mismo docker-compose.yml  y configurar ambos sergicios en dicha red y probar la conexión ahora usando el nombre de dicho servicio.

---

