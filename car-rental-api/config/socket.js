const jwt = require('jsonwebtoken');

const connectedUsers = new Map();
let _io = null;

const setIO = (io) => { _io = io; };

const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    connectedUsers.set(socket.user.id, socket.id);
    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);
    socket.on('disconnect', () => connectedUsers.delete(socket.user.id));
  });
};

const notify     = (userId, event, data) => _io?.to(`user:${userId}`).emit(event, data);
const notifyRole = (role, event, data)   => _io?.to(`role:${role}`).emit(event, data);

const notifyAdminNewPending         = (type, data)           => notifyRole('admin', 'new_pending', { type, data, timestamp: new Date() });
const notifyOwnerAccountStatus      = (ownerId, status, reason=null) => notify(ownerId, 'account_status_changed', { status, reason, timestamp: new Date() });
const notifyOwnerCarStatus          = (ownerId, car, status, reason=null) => notify(ownerId, 'car_status_changed', { car, status, reason, timestamp: new Date() });
const notifyOwnerNewRentalRequest   = (ownerId, rental)      => notify(ownerId, 'new_rental_request', { rental, timestamp: new Date() });
const notifyRenterRentalUpdate      = (renterId, rental, status, reason=null) => notify(renterId, 'rental_status_changed', { rental, status, reason, timestamp: new Date() });
const notifyRenterLicenseStatus     = (renterId, status, reason=null) => notify(renterId, 'license_status_changed', { status, reason, timestamp: new Date() });

module.exports = {
  initSocket, setIO, notify, notifyRole,
  notifyAdminNewPending, notifyOwnerAccountStatus, notifyOwnerCarStatus,
  notifyOwnerNewRentalRequest, notifyRenterRentalUpdate, notifyRenterLicenseStatus,
};