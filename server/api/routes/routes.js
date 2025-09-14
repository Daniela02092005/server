//importemos express y el módulo de rutas
const express = require("express");
const router = express.Router();

//Crear enrutadores raiz
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");

//Montamos el enrutador tasks y auth
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

//Exportamos el enrutador
module.exports = router;
