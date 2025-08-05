// server.js
require('dotenv').config();
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Conexión al servidor MySQL en Hostinger
const db = mysql.createConnection({
  host: "srv1455.hstgr.io", // O puedes usar: 82.197.82.8
  user: "u647025124_kosmos",
  password: "Integradora2!",
  database: "u647025124_reflexus"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión a la base de datos:", err);
  } else {
    console.log("✅ Conectado a la base de datos de Hostinger.");
  }
});

// 🔐 AUTENTICAR USUARIO
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = 'CALL autenticar_usuario(?, ?, @resultado, @mensaje)';
  db.query(sql, [correo, contrasena], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error en autenticación' });

    db.query('SELECT @resultado AS resultado, @mensaje AS mensaje', (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener resultado' });

      if (parseInt(result[0].resultado) === 1) {
        db.query('SELECT idUsuario FROM usuarios WHERE BINARY Correo = BINARY ? LIMIT 1', [correo], (err, userResult) => {
          if (err) return res.status(500).json({ mensaje: 'Error al obtener usuario' });

          const idUsuario = userResult.length > 0 ? userResult[0].idUsuario : null;
          res.json({ resultado: 1, mensaje: result[0].mensaje, idUsuario });
        });
      } else {
        res.json({ resultado: 0, mensaje: result[0].mensaje });
      }
    });
  });
});

// 🟢 REGISTRAR USUARIO
app.post('/registrar', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  const sql = 'CALL registrar_usuario(?, ?, ?, @mensaje)';
  db.query(sql, [nombre, correo, contrasena], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al registrar usuario' });

    db.query('SELECT @mensaje AS mensaje', (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener mensaje' });
      res.json({ mensaje: result[0].mensaje });
    });
  });
});

// 📝 REGISTRAR RECORDATORIO
app.post('/recordatorio/registrar', (req, res) => {
  const { idUsuario, recordatorio } = req.body;

  const sql = 'CALL registrar_recordatorio(?, ?, @mensaje)';
  db.query(sql, [idUsuario, recordatorio], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al registrar recordatorio' });

    db.query('SELECT @mensaje AS mensaje', (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener mensaje' });
      res.json({ mensaje: result[0].mensaje });
    });
  });
});

// ✏️ EDITAR RECORDATORIO
app.post('/recordatorio/editar', (req, res) => {
  const { idRecordatorio, idUsuario, nuevo_recordatorio } = req.body;

  const sql = 'CALL editar_recordatorio(?, ?, ?, @mensaje)';
  db.query(sql, [idRecordatorio, idUsuario, nuevo_recordatorio], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al editar recordatorio' });

    db.query('SELECT @mensaje AS mensaje', (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener mensaje' });
      res.json({ mensaje: result[0].mensaje });
    });
  });
});

// ❌ ELIMINAR RECORDATORIO
app.post('/recordatorio/eliminar', (req, res) => {
  const { idRecordatorio, idUsuario } = req.body;

  const sql = 'CALL eliminar_recordatorio(?, ?, @mensaje)';
  db.query(sql, [idRecordatorio, idUsuario], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar recordatorio' });

    db.query('SELECT @mensaje AS mensaje', (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener mensaje' });
      res.json({ mensaje: result[0].mensaje });
    });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${port}`);
});



