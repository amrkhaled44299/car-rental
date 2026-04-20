const notFound = (req, res, next) =>
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });

const errorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
  if (err.name === 'SequelizeValidationError')
    return res.status(400).json({ success: false, message: err.errors.map(e => e.message).join(', ') });
  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(409).json({ success: false, message: `${err.errors[0]?.path} already exists.` });
  return res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
};

module.exports = { notFound, errorHandler };