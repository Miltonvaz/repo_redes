const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Por favor ingresa todos los campos requeridos." });
    }

    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Por favor ingresa el correo y la contraseña." });
    }

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generando el token con el userId
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "User ID is not available" });
    }

    const [users] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [req.user.userId]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

const uploadVideo = (req, res) => {
  const videoName = req.body.videoName.trim();
  const videoPath = req.file ? req.file.path : null;
  const userId = req.body.userId;

  if (!videoName || !videoPath || !userId) {
    return res.status(400).json({ message: 'Faltan parámetros necesarios' });
  }

  const videoUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const query = 'INSERT INTO videos (video_name, video_url, user_id) VALUES (?, ?, ?)';
  const params = [videoName, videoUrl, userId];

  pool.execute(query, params)
    .then(result => {
      res.status(200).json({ message: 'Video subido exitosamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al subir el video' });
    });
};

const getAllVideos = async (req, res) => {
  try {
    const userId = req.user.userId; // Se obtiene el userId del token

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const [videos] = await pool.execute('SELECT id, video_name, video_url FROM videos WHERE user_id = ?', [userId]);

    if (videos.length === 0) {
      return res.status(404).json({ message: 'No se han encontrado videos para este usuario' });
    }

    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los videos' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  uploadVideo,
  getAllVideos,
};
