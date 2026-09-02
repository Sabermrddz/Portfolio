export default async function handler(req, res) {
  const emailConfigured = !!(process.env.EMAIL_HOST_USER && process.env.EMAIL_HOST_PASSWORD);
  res.status(200).json({ status: "ok", emailConfigured });
}
