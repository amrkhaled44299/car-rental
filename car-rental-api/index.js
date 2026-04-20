require('dotenv').config();
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const path       = require('path');

const { connectDB }         = require('./config/database');
const { setupAssociations } = require('./models/associations');
const { initSocket, setIO } = require('./config/socket');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes   = require('./routes/auth.routes');
const adminRoutes  = require('./routes/admin.routes');
const ownerRoutes  = require('./routes/owner.routes');
const renterRoutes = require('./routes/renter.routes');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 5000;

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
});
setIO(io);
initSocket(io);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',  authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api',       renterRoutes);

app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Car Rental API is running', timestamp: new Date() })
);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  setupAssociations();
  await connectDB();
  server.listen(PORT, () => {
    console.log(`\n Car Rental API on port ${PORT}`);
    console.log(` Health: http://localhost:${PORT}/api/health\n`);
  });
};

start();