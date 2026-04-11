// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${message}`)
  if (status === 500) console.error(err.stack)
  res.status(status).json({ success: false, message })
}
