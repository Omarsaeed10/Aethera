const crypto = require('crypto');
const db = require('../db');

// Encryption key derived or fallback
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.createHash('sha256').update(String(process.env.JWT_SECRET || 'mindspark-secret-key')).digest('base64').substring(0, 32);
const IV_LENGTH = 16;

/**
 * Encrypt sensitive text using AES-256-CBC
 */
function encryptText(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt sensitive text
 */
function decryptText(text) {
  if (!text || !text.includes(':')) return text;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return text;
  }
}

/**
 * Record Security Audit Log
 */
function logAudit(userId, action, ipAddress = '', userAgent = '') {
  try {
    db.run(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [userId || null, action, ipAddress, userAgent]
    );
  } catch (e) {
    console.error('Failed to log audit:', e);
  }
}

module.exports = {
  encryptText,
  decryptText,
  logAudit
};
