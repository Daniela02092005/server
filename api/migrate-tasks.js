// migrate-tasks.js (Ejecutar con: node migrate-tasks.js)
const mongoose = require('mongoose');
const Task = require('./server/api/models/Task');  // Ajusta la ruta si es necesario

const MONGO_URI = process.env.MONGO_URI;  // Usa tu .env o configúralo
const JWT_SECRET = process.env.JWT_SECRET;  // No necesario aquí, pero para consistencia

async function migrateTasks() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for migration');

    // Encontrar tareas con status inválido o null
    const invalidTasks = await Task.find({
      $or: [
        { status: { $exists: false } },  // Sin campo status
        { status: null },
        { status: { $nin: ['pending', 'in-progress', 'done'] } }  // Valores no permitidos
      ]
    });

    console.log(`Found ${invalidTasks.length} tasks to migrate`);

    let updatedCount = 0;
    for (const task of invalidTasks) {
      try {
        task.status = 'pending';  // Setear a default
        await task.save({ runValidators: true });
        updatedCount++;
        console.log(`Migrated task ${task._id}: status set to 'pending'`);
      } catch (err) {
        console.error(`Failed to migrate task ${task._id}:`, err.message);
      }
    }

    console.log(`Migration complete: ${updatedCount} tasks updated`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateTasks();
