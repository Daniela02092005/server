//importamos express configuremos a dotenv e inializamos a app, cors
const express = require("express");
require("dotenv").config();
const cors = require("cors");

//importamos a connectDB
const {connectDB} = require("./config/database");
//Importamos el router principal en index.js
const routes = require("./routes/routes.js");

const app = express();

//Configuramos los middleware para que pueda interpretar JSON y habilitar cors
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors())

//Creacion de esta parte para evitar restricciones con vercel
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://code-nova-project.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];





//Creacion de constante para cors
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));


// Connect to MongoDB - invocamos a la función para conectarnos a la DB
connectDB();


// Mount routes bajo un prefijo comun
app.use("/api/v1", routes);


//Creemos una ruta básica--esto quitarlo ¡¡¡¡Leer¡¡
// Root route
app.get("/", (req, res) => res.send("Server is running"));

//Creemos nuestro puerto de escucha en una la variable de entorno o el puerto 3000
// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
module.exports = app;
