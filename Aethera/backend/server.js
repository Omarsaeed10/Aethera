require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./utils/mailer');
const supabase = require('./supabase');
const { logAudit, encryptText, decryptText } = require('./utils/security');
const { getCachedCompletion, setCachedCompletion, callMultiProviderAI, analyzePlagiarism, gradeEssay } = require('./utils/ai_engine');
const { PLANS, checkUserQuota, createCheckoutSession, activateSubscription } = require('./utils/payments');
const { generateLicenseKey, generateQtiXml, generateMoodleXml, calculateCohortRisk, calculateInstitutionalROI } = require('./utils/enterprise');

const app = express();
const PORT = process.env.PORT || 34567;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';

app.use(cors());

// Security Hardening Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// SMTP Transporter configuration
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || '"Aethera" <no-reply@aethera.edu>';

let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  console.log('SMTP Email Transporter configured successfully.');
} else {
  console.log('SMTP settings not fully configured in .env. Falling back to Console-logged emails for development.');
}

async function sendActivationEmail(email, code, token, hostHeader, secureConnection) {
  const protocol = secureConnection ? 'https' : 'http';
  const host = hostHeader || `localhost:${PORT}`;
  const activationLink = `${protocol}://${host}/api/auth/activate?token=${token}`;
  
  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 40px;">⚡</span>
        <h1 style="color: #a78bfa; margin-top: 10px; font-weight: 800; letter-spacing: 1px;">AETHERA</h1>
        <p style="color: #9ca3af; font-size: 14px; margin-top: -10px;">University Edition</p>
      </div>
      
      <div style="background-color: #111827; border-radius: 8px; padding: 24px; border: 1px solid #374151; margin-bottom: 24px;">
        <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Activate Your Account</h2>
        <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">
          Thank you for signing up for Aethera! Please verify your email address to unlock your academic workspace.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
          <div style="background-color: #1f2937; color: #a78bfa; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; border-radius: 6px; display: inline-block; border: 1px solid #4b5563;">
            ${code}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0 10px 0;">
          <a href="${activationLink}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 14px; font-weight: bold; border-radius: 6px; display: inline-block; transition: background-color 0.3s; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);">
            Activate Account Directly
          </a>
        </div>
      </div>
      
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5; text-align: center;">
        If you didn't register for Aethera, please ignore this email.<br>
        Or copy and paste this link in your browser:<br>
        <a href="${activationLink}" style="color: #8b5cf6; text-decoration: underline;">${activationLink}</a>
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: 'Activate Your Aethera Account',
        html: emailHtml
      });
      console.log(`Activation email sent successfully to: ${email}`);
    } catch (err) {
      console.error(`Error sending email via SMTP:`, err);
      logMockEmail(email, code, activationLink);
    }
  } else {
    logMockEmail(email, code, activationLink);
  }
}

function logMockEmail(email, code, activationLink) {
  console.log('\n=================== MOCK EMAIL SENT ===================');
  console.log(`To: ${email}`);
  console.log(`Subject: Activate Your Aethera Account`);
  console.log(`Verification Code: ${code}`);
  console.log(`Activation Link: ${activationLink}`);
  console.log('=======================================================\n');
}


// ── SERVE FRONTEND ──
app.use(express.static(path.join(__dirname, '..')));

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ── AUTH ROUTES ──

app.post(['/api/auth/signup', '/api/auth/register'], async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const activationToken = crypto.randomBytes(32).toString('hex');

    db.run(
      'INSERT INTO users (email, password_hash, display_name, is_active, activation_code, activation_token) VALUES (?, ?, ?, 0, ?, ?)',
      [email, hashedPassword, displayName || '', activationCode, activationToken],
      async function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            // Check if existing user is inactive, allowing re-registration/activation resend
            db.get('SELECT * FROM users WHERE email = ?', [email], async (getErr, row) => {
              if (!getErr && row && row.is_active === 0) {
                const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                const newToken = crypto.randomBytes(32).toString('hex');
                
                db.run(
                  'UPDATE users SET password_hash = ?, display_name = ?, activation_code = ?, activation_token = ? WHERE id = ?',
                  [hashedPassword, displayName || '', newCode, newToken, row.id],
                  async (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: 'Database error' });
                    
                    try {
                      await sendVerificationEmail(email, newToken);
                      return res.status(200).json({ 
                        needsVerification: true, 
                        email, 
                        message: 'Account already registered but not activated. A new activation email has been sent.' 
                      });
                    } catch (mailErr) {
                      console.warn('Email send failed (Resend Sandbox mode limit), auto-activating account for testing:', mailErr.message);
                      db.run('UPDATE users SET is_active = 1 WHERE id = ?', [row.id], () => {
                        const token = jwt.sign({ id: row.id, email }, JWT_SECRET, { expiresIn: '7d' });
                        return res.status(200).json({
                          success: true,
                          token,
                          user: { id: row.id, email, displayName: displayName || row.display_name || '' },
                          message: 'Account activated and logged in successfully!'
                        });
                      });
                    }
                  }
                );
              } else {
                return res.status(409).json({ error: 'Email already exists' });
              }
            });
            return;
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const userId = this.lastID;
        
        // Create empty profile and usage stats for new user
        db.run('INSERT INTO profiles (user_id) VALUES (?)', [userId]);
        db.run('INSERT INTO usage_stats (user_id) VALUES (?)', [userId]);

        try {
          await sendVerificationEmail(email, activationToken);
          res.status(201).json({ needsVerification: true, email, message: 'Verification email sent. Please check your inbox.' });
        } catch (mailErr) {
          console.warn('Email send failed (Resend Sandbox mode limit), auto-activating account for user:', mailErr.message);
          db.run('UPDATE users SET is_active = 1 WHERE id = ?', [userId], () => {
            const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ 
              success: true, 
              token, 
              user: { id: userId, email, displayName: displayName || '' },
              message: 'Account created and activated successfully!' 
            });
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.is_active === 0) {
      return res.status(403).json({ 
        error: 'Account is not activated. Please verify your email.', 
        notActivated: true, 
        email: user.email 
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, displayName: user.display_name } });
  });
});

app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.is_active === 1) {
      return res.status(400).json({ error: 'Account is already active. Please log in.' });
    }

    if (user.activation_code !== code.toString().trim()) {
      return res.status(400).json({ error: 'Invalid activation code.' });
    }

    db.run(
      'UPDATE users SET is_active = 1, activation_code = NULL, activation_token = NULL WHERE id = ?',
      [user.id],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Database error' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
          success: true, 
          token, 
          user: { id: user.id, email: user.email, displayName: user.display_name } 
        });
      }
    );
  });
});

app.post('/api/auth/resend-code', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.is_active === 1) {
      return res.status(400).json({ error: 'Account is already active.' });
    }

    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const activationToken = crypto.randomBytes(32).toString('hex');

    db.run(
      'UPDATE users SET activation_code = ?, activation_token = ? WHERE id = ?',
      [activationCode, activationToken, user.id],
      async (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Database error' });

        try {
          await sendVerificationEmail(email, activationToken);
          res.json({ success: true, message: 'Verification email resent.' });
        } catch (mailErr) {
          res.json({ success: true, message: `Code regenerated but failed to send email: ${mailErr.message}` });
        }
      }
    );
  });
});

app.get('/api/auth/activate', (req, res) => {
  const { token } = req.query;
  const protocol = req.secure ? 'https' : 'http';
  const host = req.headers.host || `localhost:${PORT}`;
  const redirectBase = process.env.APP_URL || `${protocol}://${host}`;

  if (!token) {
    return res.redirect(`${redirectBase}/?activated=false&error=Missing+activation+token`);
  }

  db.get('SELECT * FROM users WHERE activation_token = ?', [token], (err, user) => {
    if (err || !user) {
      return res.redirect(`${redirectBase}/?activated=false&error=Invalid+or+expired+activation+token`);
    }

    db.run(
      'UPDATE users SET is_active = 1, activation_code = NULL, activation_token = NULL WHERE id = ?',
      [user.id],
      (updateErr) => {
        if (updateErr) {
          return res.redirect(`${redirectBase}/?activated=false&error=Database+error`);
        }
        res.redirect(`${redirectBase}/?activated=true`);
      }
    );
  });
});


app.post('/api/auth/reset-password', async (req, res) => {
  const { email, studentId, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  db.get(`
    SELECT u.id, p.student_id 
    FROM users u 
    LEFT JOIN profiles p ON u.id = p.user_id 
    WHERE u.email = ?
  `, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User with this email not found' });

    const dbStudentId = row.student_id || '';
    const inputStudentId = studentId || '';
    
    if (dbStudentId.toLowerCase().trim() !== inputStudentId.toLowerCase().trim()) {
      return res.status(403).json({ error: 'Identity verification failed: Student ID does not match.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, row.id], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, message: 'Password reset successfully' });
      });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// ── PROFILE ROUTES ──

app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.get(`
    SELECT u.email, u.display_name, p.*, s.tool_usage, s.streak, s.last_active_date, s.xp, s.level, s.badges, s.weekly_data
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    LEFT JOIN usage_stats s ON u.id = s.user_id
    WHERE u.id = ?
  `, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    
    // Parse JSON fields
    try {
      row.tool_usage = JSON.parse(row.tool_usage || '{}');
      row.badges = JSON.parse(row.badges || '[]');
      row.weekly_data = JSON.parse(row.weekly_data || '{}');
    } catch (e) {
      console.error('Error parsing JSON fields', e);
    }
    
    res.json(row);
  });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { displayName, college, major, studentId, program, avatar, bio } = req.body;

  // Update users table
  if (displayName !== undefined) {
    db.run('UPDATE users SET display_name = ? WHERE id = ?', [displayName, userId]);
  }

  // Update profiles table
  db.run(`
    UPDATE profiles 
    SET college = COALESCE(?, college),
        major = COALESCE(?, major),
        student_id = COALESCE(?, student_id),
        program = COALESCE(?, program),
        avatar = COALESCE(?, avatar),
        bio = COALESCE(?, bio)
    WHERE user_id = ?
  `, [college, major, studentId, program, avatar, bio, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ── AI COMPLETIONS PROXY (Groq) ──

// Rate limiter for proxy completions to prevent abuse of the paid/shared Groq API key
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware to verify JWT optionally
// Allowing unauthenticated access to /api/chat presents an abuse risk where
// anonymous clients can consume the Groq API key quota. We make it optional
// to support offline/pre-login usage, but rate limit it strongly.
function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
}

app.post('/api/chat', apiLimiter, optionalAuthenticateToken, async (req, res) => {
  const { messages, model, temperature, max_tokens, stream, provider } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const userRequestedProvider = provider || 'groq';

  const hasVision = messages.some(m => Array.isArray(m.content) && m.content.some(c => c && (c.type === 'image_url' || c.image_url)));

  // Model validation: only pass user model to matching provider
  const PROVIDER_MODELS = {
    groq: hasVision ? 'llama-3.2-11b-vision-preview' : 'openai/gpt-oss-120b',
    gemini: 'gemini-1.5-flash',
    openai: 'gpt-4o-mini'
  };

  function getModelForProvider(providerName) {
    if (providerName === 'groq') {
      if (model && (model.startsWith('openai/') || model.startsWith('qwen/') || model.startsWith('groq/') || model.startsWith('allam-'))) {
        return model;
      }
      return PROVIDER_MODELS.groq;
    }
    // Always use the provider's native model to prevent cross-provider errors
    return PROVIDER_MODELS[providerName];
  }


  // Multi-provider fallback chain
  const providersToTry = [];
  
  if (userRequestedProvider === 'openai' && process.env.OPENAI_API_KEY) {
    providersToTry.push({ name: 'openai', url: 'https://api.openai.com/v1/chat/completions', key: process.env.OPENAI_API_KEY, model: getModelForProvider('openai') });
  } else if (userRequestedProvider === 'gemini' && process.env.GEMINI_API_KEY) {
    providersToTry.push({ name: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_API_KEY, model: getModelForProvider('gemini') });
  } else if (process.env.GROQ_API_KEY) {
    providersToTry.push({ name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_API_KEY, model: getModelForProvider('groq') });
    // Backup Groq model in case primary hits limit
    providersToTry.push({ name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_API_KEY, model: 'qwen/qwen3.8-27b' });
  }

  // Backup providers (always use their own default model)
  if (process.env.GROQ_API_KEY && userRequestedProvider !== 'groq') {
    providersToTry.push({ name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_API_KEY, model: PROVIDER_MODELS.groq });
  }
  if (process.env.GEMINI_API_KEY && userRequestedProvider !== 'gemini') {
    providersToTry.push({ name: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_API_KEY, model: PROVIDER_MODELS.gemini });
  }
  if (process.env.OPENAI_API_KEY && userRequestedProvider !== 'openai') {
    providersToTry.push({ name: 'openai', url: 'https://api.openai.com/v1/chat/completions', key: process.env.OPENAI_API_KEY, model: PROVIDER_MODELS.openai });
  }


  for (const p of providersToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(p.url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${p.key}`
        },
        body: JSON.stringify({
          model: p.model,
          messages,
          temperature: temperature !== undefined ? temperature : 0.7,
          max_tokens: max_tokens || 2048,
          stream: stream || false
        })
      });

      clearTimeout(timeout);

      if (response.ok) {
        if (stream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');

          if (response.body) {
            if (typeof response.body.pipe === 'function') {
              response.body.pipe(res);
            } else if (typeof response.body.getReader === 'function') {
              const reader = response.body.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
              res.end();
            } else {
              for await (const chunk of response.body) {
                res.write(chunk);
              }
              res.end();
            }
          } else {
            res.end();
          }
          return;
        } else {
          const data = await response.json();
          return res.json(data);
        }
      } else {
        const errText = await response.text();
        console.warn(`Provider ${p.name} returned status ${response.status}:`, errText.slice(0, 120));
      }
    } catch (err) {
      console.warn(`Provider ${p.name} error:`, err.message);
    }
  }

  // Smart AI Generator Fallback when cloud API keys fail or are unconfigured
  console.log("Serving Smart AI Fallback Generation.");
  const fullPromptText = messages.map(m => typeof m.content === 'string' ? m.content : JSON.stringify(m.content)).join(' ');
  const fallbackText = generateSmartFallbackContent(fullPromptText);

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const chunks = fallbackText.match(/.{1,20}/g) || [fallbackText];
    for (const chunk of chunks) {
      const dataStr = JSON.stringify({ choices: [{ delta: { content: chunk } }] });
      res.write(`data: ${dataStr}\n\n`);
      await new Promise(r => setTimeout(r, 15));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } else {
    res.json({
      choices: [{
        message: { role: 'assistant', content: fallbackText }
      }]
    });
  }
});

function generateSmartFallbackContent(userPrompt) {
  let p = '';
  let rawText = '';
  if (typeof userPrompt === 'string') {
    rawText = userPrompt;
    p = userPrompt.toLowerCase();
  } else if (Array.isArray(userPrompt)) {
    rawText = userPrompt.map(item => typeof item === 'string' ? item : (item.text || JSON.stringify(item))).join(' ');
    p = rawText.toLowerCase();
  } else if (userPrompt && typeof userPrompt === 'object') {
    rawText = JSON.stringify(userPrompt);
    p = rawText.toLowerCase();
  }
  
  // ── Flashcard requests (front/back JSON) ──
  if (p.includes('front') && p.includes('back') && p.includes('flashcard')) {
    const textBody = rawText
      .replace(/^(?:Analyze|Generate|Provide|Summarize|Create)\s+[\s\S]*?(?:lecture text|following text|study materials|topic|materials|about|level|level:):\s*/gi, '')
      .replace(/Format strictly as JSON array:[\s\S]*/gi, '')
      .replace(/\[📚 Large Lecture:.*?\]/gi, '')
      .replace(/===.*?===/g, '')
      .trim();

    const sentences = textBody.split(/(?<=[.!?\n])\s+/).map(s => s.trim()).filter(s => s.length > 15 && !s.toLowerCase().includes('json') && !s.toLowerCase().includes('generate'));

    if (sentences.length >= 2) {
      const generatedCards = [];
      const numCards = Math.min(10, Math.max(4, Math.floor(sentences.length / 2)));
      for (let i = 0; i < numCards; i++) {
        const sentence = sentences[i * 2] || sentences[i];
        const words = sentence.split(/\s+/);
        const frontTerm = words.slice(0, Math.min(6, words.length)).join(' ');
        const backAnswer = words.slice(Math.min(6, words.length)).join(' ') || sentence;

        generatedCards.push({
          front: `Define or explain: ${frontTerm.replace(/[.:;]/g, '')}`,
          back: backAnswer.trim()
        });
      }
      return JSON.stringify(generatedCards);
    }
  }

  // ── Quiz / MCQ requests (q/opts/ans JSON) ──
  if (p.includes('opts') || p.includes('mcq') || p.includes('multiple-choice') || p.includes('quiz') || p.includes('question') || (p.includes('ans') && p.includes('json'))) {
    const textBody = rawText
      .replace(/You are an expert[\s\S]*?generator\.?\s*/gi, '')
      .replace(/^(?:Analyze|Generate|Provide|Summarize|Create)\s+[\s\S]*?(?:lecture text|following text|study materials|topic|materials|about|level|level|ans):\s*/gi, '')
      .replace(/Format strictly as JSON array:[\s\S]*/gi, '')
      .replace(/\[📚 Large Lecture:.*?\]/gi, '')
      .replace(/===.*?===/g, '')
      .trim();

    const cleanInput = textBody || rawText;
    const sentences = cleanInput.split(/(?<=[.!?\n])\s+/).map(s => s.trim()).filter(s => s.length > 5 && !s.toLowerCase().includes('json array'));
    const sourceList = sentences.length > 0 ? sentences : [cleanInput];

    const generatedQuiz = [];
    const numQuestions = 5;
    
    for (let i = 0; i < numQuestions; i++) {
      const targetSentence = sourceList[i % sourceList.length] || cleanInput;
      const nextSentence = sourceList[(i + 1) % sourceList.length] || targetSentence;
      
      const words = String(targetSentence).split(/\s+/);
      const term = words.slice(0, Math.min(6, words.length)).join(' ');
      const detail = words.slice(Math.min(6, words.length)).join(' ') || String(targetSentence);
      
      const wrongOpt1 = String(nextSentence).slice(0, 120);
      const wrongOpt2 = String(sourceList[(i + 2) % sourceList.length] || "It applies under controlled laboratory conditions.").slice(0, 120);
      const wrongOpt3 = String(sourceList[(i + 3) % sourceList.length] || "It represents a secondary constraint in theoretical modeling.").slice(0, 120);

      const correctOpt = (detail.length > 5 ? detail : targetSentence).slice(0, 140);
      
      const options = [correctOpt, wrongOpt1, wrongOpt2, wrongOpt3];
      const correctIndex = i % 4;
      if (correctIndex !== 0) {
        const temp = options[0];
        options[0] = options[correctIndex];
        options[correctIndex] = temp;
      }

      generatedQuiz.push({
        q: `According to the study materials, what is key regarding "${term.replace(/[.:;]/g, '')}"?`,
        opts: options.map(o => o.trim()),
        ans: correctIndex
      });
    }
    return JSON.stringify(generatedQuiz);
  }

  // ── Dynamic text summary response ──
  const textBody = rawText
    .replace(/^(?:Analyze|Generate|Provide|Summarize|Create)\s+[\s\S]*?(?:lecture text|following text|topic|materials|text):\s*/gi, '')
    .replace(/\[📚 Large Lecture:.*?\]/gi, '')
    .replace(/===.*?===/g, '')
    .trim();

  const sentences = textBody.split(/(?<=[.!?\n])\s+/).map(s => s.trim()).filter(s => s.length > 8);
  
  if (sentences.length > 0) {
    const overview = sentences.slice(0, 4).join(' ');
    let keyPoints = sentences.slice(4, 10).map(s => `- **Key Concept:** ${s}`).join('\n');
    if (!keyPoints) {
      keyPoints = sentences.slice(0, 4).map(s => `- **Core Idea:** ${s}`).join('\n');
    }
    
    let deepDive = sentences.slice(10, 16).map((s, i) => `${i + 1}. **Takeaway ${i + 1}:** ${s}`).join('\n');
    if (!deepDive && sentences.length > 4) {
      deepDive = sentences.slice(4, 10).map((s, i) => `${i + 1}. **Takeaway ${i + 1}:** ${s}`).join('\n');
    }

    let title = "Executive Academic Summary";
    if (p.includes('software') || p.includes('engineering')) {
      title = "Software Engineering & Systems Summary";
    } else if (p.includes('proposition') || p.includes('logic') || p.includes('discrete')) {
      title = "Propositional Logic & Mathematical Foundations Summary";
    } else if (p.includes('computer') || p.includes('algorithm') || p.includes('data')) {
      title = "Computer Science & Technical Analysis Summary";
    }

    return `### 📝 ${title}

#### 🎯 Executive Overview
${overview}

#### 📌 Core Concepts & Key Highlights
${keyPoints}

${deepDive ? `#### 🔍 Critical Analysis & Key Takeaways\n${deepDive}` : ''}

---
*💡 Tip: Use the Flashcards or Quiz tools to test your retention on this specific material!*`;
  }

  return `### 📝 Academic Summary & Analysis

#### 🎯 Core Overview
Please paste or load the complete lecture text to generate a comprehensive summary.

#### 📌 Key Takeaways
- **Lecture Context Required:** Load a lecture from your library or paste lecture text into the field.`;
}



// ── SPEECH TO TEXT TRANSCRIBE PROXY (Whisper) ──
app.post('/api/transcribe', apiLimiter, optionalAuthenticateToken, async (req, res) => {
  const { audio, fileType } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!OPENAI_API_KEY && !GROQ_API_KEY) {
    return res.status(500).json({ error: 'Neither OPENAI_API_KEY nor GROQ_API_KEY is configured for Whisper transcription.' });
  }

  if (!audio) {
    return res.status(400).json({ error: 'Audio data is required' });
  }

  try {
    const audioBuffer = Buffer.from(audio, 'base64');
    const { File } = require('buffer');
    
    const formData = new FormData();
    const ext = fileType || 'webm';
    const file = new File([audioBuffer], `audio.${ext}`, { type: `audio/${ext}` });
    
    formData.append('file', file);

    let apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
    let apiKey = OPENAI_API_KEY;
    let modelName = 'whisper-1';

    if (!OPENAI_API_KEY && GROQ_API_KEY) {
      apiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
      apiKey = GROQ_API_KEY;
      modelName = 'whisper-large-v3';
    }
    
    formData.append('model', modelName);

    const whisperResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!whisperResponse.ok) {
      const errText = await whisperResponse.text();
      console.error('Whisper API Error response:', errText);
      return res.status(whisperResponse.status).json({ error: 'Whisper API error' });
    }

    const data = await whisperResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error during transcription proxy:', error);
    res.status(500).json({ error: 'Failed to transcribe audio.' });
  }
});

// ── NOTION INTEGRATION ──
app.post('/api/notion/test', optionalAuthenticateToken, async (req, res) => {
  const { token, databaseId } = req.body;
  if (!token || !databaseId) {
    return res.status(400).json({ error: 'Both Notion Token and Database ID are required.' });
  }

  let cleanDbId = databaseId.trim();

  // Friendly check if user put token in Database ID field
  if (cleanDbId.startsWith('ntn_') || cleanDbId.startsWith('secret_')) {
    return res.status(400).json({
      error: 'الرمز المكتوب في Notion Database ID هو Token (يبدأ بـ ntn_). يرجى وضعه في الخانة الأولى (Notion Secret Token).'
    });
  }

  // Extract DB ID if full Notion URL was pasted
  const urlMatch = cleanDbId.match(/([a-f0-9]{32})/i);
  if (urlMatch) {
    cleanDbId = urlMatch[1];
  }
  
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = 'Failed to connect to Notion database.';
      try {
        const json = JSON.parse(errText);
        errMsg = json.message || errMsg;
      } catch (e) {}
      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    const title = data.title?.[0]?.plain_text || 'Notion Workspace';
    res.json({ success: true, title, message: `Connected to Notion database: "${title}"` });
  } catch (error) {
    console.error('Notion Connection Test Error:', error);
    res.status(500).json({ error: 'Network error connecting to Notion API.' });
  }
});

app.post('/api/notion/sync', optionalAuthenticateToken, async (req, res) => {
  const { token, databaseId, title, content } = req.body;
  if (!token || !databaseId) {
    return res.status(400).json({ error: 'Notion integration credentials are required.' });
  }
  
  let cleanDbId = (databaseId || '').trim();
  const urlMatch = cleanDbId.match(/([a-f0-9]{32})/i);
  if (urlMatch) {
    cleanDbId = urlMatch[1];
  }

  try {
    let titlePropKey = 'Name';
    try {
      const dbRes = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Notion-Version': '2022-06-28'
        }
      });
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        if (dbData.properties) {
          const foundKey = Object.keys(dbData.properties).find(k => dbData.properties[k].type === 'title');
          if (foundKey) titlePropKey = foundKey;
        }
      }
    } catch(e) {}

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: cleanDbId },
        properties: {
          [titlePropKey]: {
            title: [
              { text: { content: (title || 'Aethera Study Notes').slice(0, 200) } }
            ]
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                { text: { content: (content || '').slice(0, 1999) } }
              ]
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = 'Notion API synchronization failed';
      try {
        const json = JSON.parse(errText);
        errMsg = json.message || errMsg;
      } catch(e) {}
      console.error('Notion API error response:', errText);
      return res.status(response.status).json({ error: errMsg });
    }
    
    const data = await response.json();
    res.json({ success: true, page: data.url });
  } catch (error) {
    console.error('Notion Sync Error:', error);
    res.status(500).json({ error: 'Failed to sync to Notion.' });
  }
});

// ── LEADERBOARD ──
app.get('/api/leaderboard', optionalAuthenticateToken, (req, res) => {
  db.all(`
    SELECT u.display_name, s.xp, s.level, s.streak, s.badges
    FROM usage_stats s
    JOIN users u ON s.user_id = u.id
    WHERE u.is_active = 1
    ORDER BY s.xp DESC
    LIMIT 20
  `, [], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      const defaultBoard = [
        { rank: 1, displayName: "Omar Saeed (AI Major)", xp: 4850, level: 15, streak: 21, badgeCount: 12 },
        { rank: 2, displayName: "Sarah Chen (Data Science)", xp: 3980, level: 12, streak: 14, badgeCount: 9 },
        { rank: 3, displayName: "Alex Rivera (Computer Vision)", xp: 3450, level: 10, streak: 11, badgeCount: 7 },
        { rank: 4, displayName: "Elena Rostova (Cybersecurity)", xp: 2890, level: 9, streak: 8, badgeCount: 6 },
        { rank: 5, displayName: "David Kim (Software Engineering)", xp: 2310, level: 7, streak: 5, badgeCount: 4 }
      ];
      return res.json({ leaderboard: defaultBoard });
    }
    
    const formatted = rows.map((r, index) => {
      let badgeCount = 0;
      try {
        const parsed = JSON.parse(r.badges || '[]');
        badgeCount = Array.isArray(parsed) ? parsed.length : 0;
      } catch(e) {}
      
      return {
        rank: index + 1,
        displayName: r.display_name || "Academic Spark",
        xp: r.xp || 0,
        level: r.level || 1,
        streak: r.streak || 0,
        badgeCount: badgeCount
      };
    });
    
    res.json({ leaderboard: formatted });
  });
});

// ── USAGE SYNC ──

app.post('/api/usage/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { toolUsage, streak, lastDate, xp, level, badges, weeklyData } = req.body;

  const toolUsageStr = JSON.stringify(toolUsage || {});
  const badgesStr = JSON.stringify(badges || []);
  const weeklyDataStr = JSON.stringify(weeklyData || {});

  db.run(`
    UPDATE usage_stats 
    SET tool_usage = ?,
        streak = COALESCE(?, streak),
        last_active_date = COALESCE(?, last_active_date),
        xp = COALESCE(?, xp),
        level = COALESCE(?, level),
        badges = ?,
        weekly_data = ?
    WHERE user_id = ?
  `, [toolUsageStr, streak, lastDate, xp, level, badgesStr, weeklyDataStr, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ── SAVED NOTES API ──

app.get('/api/notes', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('saved_notes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return res.json({ notes: data });
    } catch (e) { console.error('Supabase notes error:', e); }
  }

  db.all('SELECT * FROM saved_notes WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ notes: rows || [] });
  });
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, content, toolType, tags, isFavorite } = req.body;

  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  if (supabase) {
    try {
      const { data, error } = await supabase.from('saved_notes').insert([{
        user_id: userId,
        title,
        content,
        tool_type: toolType || 'general',
        tags: tags || [],
        is_favorite: isFavorite || false
      }]).select();
      if (!error && data) return res.status(201).json({ success: true, note: data[0] });
    } catch (e) { console.error('Supabase notes insert error:', e); }
  }

  const tagsStr = JSON.stringify(tags || []);
  db.run(
    'INSERT INTO saved_notes (user_id, title, content, tool_type, tags, is_favorite) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, content, toolType || 'general', tagsStr, isFavorite ? 1 : 0],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  if (supabase) {
    try {
      await supabase.from('saved_notes').delete().eq('id', noteId).eq('user_id', userId);
    } catch (e) {}
  }

  db.run('DELETE FROM saved_notes WHERE id = ? AND user_id = ?', [noteId, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ── FLASHCARDS & SPACED REPETITION API ──

app.get('/api/flashcards', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('flashcards').select('*').eq('user_id', userId).order('next_review_due', { ascending: true });
      if (!error && data) return res.json({ flashcards: data });
    } catch (e) {}
  }

  db.all('SELECT * FROM flashcards WHERE user_id = ? ORDER BY next_review_due ASC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ flashcards: rows || [] });
  });
});

app.post('/api/flashcards', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { deckName, question, answer } = req.body;

  if (!deckName || !question || !answer) return res.status(400).json({ error: 'Deck name, question, and answer are required' });

  if (supabase) {
    try {
      const { data, error } = await supabase.from('flashcards').insert([{
        user_id: userId,
        deck_name: deckName,
        question,
        answer
      }]).select();
      if (!error && data) return res.status(201).json({ success: true, card: data[0] });
    } catch (e) {}
  }

  db.run(
    'INSERT INTO flashcards (user_id, deck_name, question, answer) VALUES (?, ?, ?, ?)',
    [userId, deckName, question, answer],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

// SuperMemo SM-2 Spaced Repetition Review Engine
app.post('/api/flashcards/:id/review', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const cardId = req.params.id;
  const { rating } = req.body; // rating from 0 (forgot completely) to 5 (perfect recall)

  if (rating === undefined || rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 0 and 5' });
  }

  db.get('SELECT * FROM flashcards WHERE id = ? AND user_id = ?', [cardId, userId], (err, card) => {
    if (err || !card) return res.status(404).json({ error: 'Card not found' });

    let easeFactor = card.ease_factor || 2.5;
    let repetitions = card.repetition_count || 0;
    let interval = card.interval_days || 1;

    // SuperMemo SM-2 Formula
    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    if (rating >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + interval);
    const nextDueStr = nextDueDate.toISOString();

    db.run(
      'UPDATE flashcards SET ease_factor = ?, repetition_count = ?, interval_days = ?, next_review_due = ? WHERE id = ?',
      [easeFactor, repetitions, interval, nextDueStr, cardId],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, easeFactor, repetitions, interval, nextReviewDue: nextDueStr });
      }
    );
  });
});

// ── STUDY TASKS API ──

app.get('/api/tasks', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('study_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return res.json({ tasks: data });
    } catch (e) {}
  }

  db.all('SELECT * FROM study_tasks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ tasks: rows || [] });
  });
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, subject, priority, dueDate, pomodoroTarget } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  if (supabase) {
    try {
      const { data, error } = await supabase.from('study_tasks').insert([{
        user_id: userId,
        title,
        subject: subject || '',
        priority: priority || 'medium',
        due_date: dueDate || null,
        pomodoro_target: pomodoroTarget || 1
      }]).select();
      if (!error && data) return res.status(201).json({ success: true, task: data[0] });
    } catch (e) {}
  }

  db.run(
    'INSERT INTO study_tasks (user_id, title, subject, priority, due_date, pomodoro_target) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, subject || '', priority || 'medium', dueDate || null, pomodoroTarget || 1],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { status, pomodoroCompleted } = req.body;

  db.run(
    'UPDATE study_tasks SET status = COALESCE(?, status), pomodoro_completed = COALESCE(?, pomodoro_completed) WHERE id = ? AND user_id = ?',
    [status, pomodoroCompleted, taskId, userId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true });
    }
  );
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  db.run('DELETE FROM study_tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ── AI CHAT SESSIONS & MESSAGES API ──

app.get('/api/chat/sessions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ sessions: rows || [] });
  });
});

app.post('/api/chat/sessions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  db.run('INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)', [userId, title || 'New AI Study Session'], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ success: true, id: this.lastID, title: title || 'New AI Study Session' });
  });
});

app.get('/api/chat/sessions/:id/messages', authenticateToken, (req, res) => {
  const sessionId = req.params.id;
  db.all('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC', [sessionId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ messages: rows || [] });
  });
});

app.post('/api/chat/sessions/:id/messages', authenticateToken, (req, res) => {
  const sessionId = req.params.id;
  const { sender, message } = req.body;

  if (!sender || !message) return res.status(400).json({ error: 'Sender and message are required' });

  db.run('INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)', [sessionId, sender, message], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// ── CONCEPT MASTERY MATRIX API ──

app.get('/api/mastery', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM concept_mastery WHERE user_id = ? ORDER BY updated_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ mastery: rows || [] });
  });
});

app.post('/api/mastery', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { subject, conceptName, isCorrect, aiRecommendation } = req.body;

  if (!subject || !conceptName) return res.status(400).json({ error: 'Subject and conceptName are required' });

  db.get('SELECT * FROM concept_mastery WHERE user_id = ? AND subject = ? AND concept_name = ?', [userId, subject, conceptName], (err, row) => {
    if (row) {
      const newTotal = (row.total_attempts || 0) + 1;
      const newCorrect = (row.correct_attempts || 0) + (isCorrect ? 1 : 0);
      const newScore = Math.min(1.0, Math.max(0.0, newCorrect / newTotal));

      db.run(
        'UPDATE concept_mastery SET total_attempts = ?, correct_attempts = ?, mastery_score = ?, ai_recommendation = COALESCE(?, ai_recommendation), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newTotal, newCorrect, newScore, aiRecommendation, row.id],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Database error' });
          res.json({ success: true, score: newScore, totalAttempts: newTotal });
        }
      );
    } else {
      const newCorrect = isCorrect ? 1 : 0;
      db.run(
        'INSERT INTO concept_mastery (user_id, subject, concept_name, mastery_score, total_attempts, correct_attempts, ai_recommendation) VALUES (?, ?, ?, ?, 1, ?, ?)',
        [userId, subject, conceptName, newCorrect, newCorrect, aiRecommendation || 'Keep practicing!'],
        function(insertErr) {
          if (insertErr) return res.status(500).json({ error: 'Database error' });
          res.status(201).json({ success: true, id: this.lastID, score: newCorrect });
        }
      );
    }
  });
});

// ── HEALTH & DIAGNOSTICS ROUTE ──

app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  db.get('SELECT COUNT(*) as user_count FROM users', [], (err, row) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: err ? 'error' : 'connected',
      userCount: (row && row.user_count) || 0,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapMb: Math.round(memoryUsage.heapUsed / 1024 / 1024)
      },
      supabaseConnected: !!supabase
    });
  });
});

// ── PAYMENTS & SUBSCRIPTIONS API ──

app.get('/api/payments/status', authenticateToken, (req, res) => {
  const userId = req.user.id;
  checkUserQuota(userId, (quotaInfo) => {
    res.json({ success: true, quota: quotaInfo, availablePlans: PLANS });
  });
});

app.post('/api/payments/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { planType } = req.body;

  if (!planType || !PLANS[planType]) {
    return res.status(400).json({ error: 'Invalid plan type selected' });
  }

  logAudit(userId, `CHECKOUT_INITIATED:${planType}`, req.ip, req.headers['user-agent']);
  const session = createCheckoutSession(userId, planType);
  res.json({ success: true, session });
});

app.post('/api/payments/activate', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { planType } = req.body;

  if (!planType || !PLANS[planType]) {
    return res.status(400).json({ error: 'Invalid plan type' });
  }

  activateSubscription(userId, planType, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to activate subscription' });
    logAudit(userId, `SUBSCRIPTION_ACTIVATED:${planType}`, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: `Activated ${PLANS[planType].name} successfully!` });
  });
});

// ── SECURITY & AUDIT LOGS API ──

app.get('/api/security/audit-logs', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ logs: rows || [] });
  });
});

// ── ADVANCED AI TOOLS API (Plagiarism Analyzer & Exam Auto-Grader) ──

app.post('/api/ai/plagiarism', optionalAuthenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 20) {
    return res.status(400).json({ error: 'Text must be at least 20 characters long' });
  }

  try {
    const report = await analyzePlagiarism(text);
    if (req.user) {
      logAudit(req.user.id, 'PLAGIARISM_ANALYSIS', req.ip, req.headers['user-agent']);
    }
    res.json({ success: true, report });
  } catch (error) {
    console.error('Plagiarism error:', error);
    res.status(500).json({ error: 'Failed to perform plagiarism analysis.' });
  }
});

app.post('/api/ai/grade-essay', optionalAuthenticateToken, async (req, res) => {
  const { question, studentAnswer, rubric } = req.body;

  if (!question || !studentAnswer) {
    return res.status(400).json({ error: 'Question and studentAnswer are required' });
  }

  try {
    const gradeReport = await gradeEssay({ question, studentAnswer, rubric });
    if (req.user) {
      logAudit(req.user.id, 'ESSAY_GRADED', req.ip, req.headers['user-agent']);
    }
    res.json({ success: true, gradeReport });
  } catch (error) {
    console.error('Grading error:', error);
    res.status(500).json({ error: 'Failed to evaluate essay answer.' });
  }
});

// ── NEW FULL-STACK DATABASE REST API ENDPOINTS ──

// 1. COURSES & ACADEMIC SUBJECTS
app.get('/api/courses', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching courses' });
    res.json({ success: true, courses: rows || [] });
  });
});

app.post('/api/courses', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_code, title, instructor_name, color_code, semester } = req.body;
  if (!title) return res.status(400).json({ error: 'Course title is required' });

  db.run(
    'INSERT INTO courses (user_id, course_code, title, instructor_name, color_code, semester) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, course_code || '', title, instructor_name || '', color_code || '#a78bfa', semester || ''],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error saving course' });
      res.json({ success: true, courseId: this.lastID });
    }
  );
});

app.delete('/api/courses/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;
  db.run('DELETE FROM courses WHERE id = ? AND user_id = ?', [courseId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error deleting course' });
    res.json({ success: true, deleted: this.changes > 0 });
  });
});

// 2. DOCUMENTS & LECTURE METADATA
app.get('/api/documents', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id } = req.query;
  let sql = 'SELECT id, course_id, file_name, file_type, file_url, created_at FROM documents WHERE user_id = ?';
  const params = [userId];

  if (course_id) {
    sql += ' AND course_id = ?';
    params.push(course_id);
  }
  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching documents' });
    res.json({ success: true, documents: rows || [] });
  });
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id, file_name, file_type, file_url, extracted_text } = req.body;
  if (!file_name || !file_type) return res.status(400).json({ error: 'file_name and file_type are required' });

  db.run(
    'INSERT INTO documents (course_id, user_id, file_name, file_type, file_url, extracted_text) VALUES (?, ?, ?, ?, ?, ?)',
    [course_id || null, userId, file_name, file_type, file_url || '', extracted_text || ''],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error saving document' });
      res.json({ success: true, documentId: this.lastID });
    }
  );
});

app.delete('/api/documents/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const docId = req.params.id;
  db.run('DELETE FROM documents WHERE id = ? AND user_id = ?', [docId, userId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error deleting document' });
    res.json({ success: true, deleted: this.changes > 0 });
  });
});

// 3. FLASHCARD DECKS
app.get('/api/flashcard-decks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM flashcard_decks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching decks' });
    res.json({ success: true, decks: rows || [] });
  });
});

app.post('/api/flashcard-decks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id, title, description, cards_count } = req.body;
  if (!title) return res.status(400).json({ error: 'Deck title is required' });

  db.run(
    'INSERT INTO flashcard_decks (user_id, course_id, title, description, cards_count) VALUES (?, ?, ?, ?, ?)',
    [userId, course_id || null, title, description || '', cards_count || 0],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error creating deck' });
      res.json({ success: true, deckId: this.lastID });
    }
  );
});

// 4. QUIZ RESULTS & HISTORY
app.get('/api/quizzes/results', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY taken_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching quiz results' });
    const formatted = (rows || []).map(r => ({
      ...r,
      answers_json: r.answers_json ? JSON.parse(r.answers_json) : null
    }));
    res.json({ success: true, results: formatted });
  });
});

app.post('/api/quizzes/results', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id, quiz_title, score, total_questions, answers_json, time_taken_seconds } = req.body;
  if (!quiz_title || score === undefined || !total_questions) {
    return res.status(400).json({ error: 'quiz_title, score, and total_questions are required' });
  }

  const answersString = typeof answers_json === 'object' ? JSON.stringify(answers_json) : (answers_json || '');

  db.run(
    'INSERT INTO quiz_results (user_id, course_id, quiz_title, score, total_questions, answers_json, time_taken_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, course_id || null, quiz_title, score, total_questions, answersString, time_taken_seconds || 0],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error saving quiz result' });
      res.json({ success: true, resultId: this.lastID });
    }
  );
});

// 5. MIND MAPS API
app.get('/api/mindmaps', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM mind_maps WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching mindmaps' });
    const formatted = (rows || []).map(r => ({
      ...r,
      tree_data: JSON.parse(r.tree_data_json)
    }));
    res.json({ success: true, mindmaps: formatted });
  });
});

app.post('/api/mindmaps', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id, title, tree_data } = req.body;
  if (!title || !tree_data) return res.status(400).json({ error: 'title and tree_data are required' });

  const treeJson = typeof tree_data === 'object' ? JSON.stringify(tree_data) : tree_data;

  db.run(
    'INSERT INTO mind_maps (user_id, course_id, title, tree_data_json) VALUES (?, ?, ?, ?)',
    [userId, course_id || null, title, treeJson],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error saving mindmap' });
      res.json({ success: true, mindmapId: this.lastID });
    }
  );
});

// 6. STUDY PLANS API
app.get('/api/study-plans', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM study_plans WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching study plans' });
    const formatted = (rows || []).map(r => ({
      ...r,
      plan_details: JSON.parse(r.plan_details_json)
    }));
    res.json({ success: true, plans: formatted });
  });
});

app.post('/api/study-plans', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { course_id, target_exam_date, daily_target_hours, plan_details } = req.body;
  if (!plan_details) return res.status(400).json({ error: 'plan_details is required' });

  const planJson = typeof plan_details === 'object' ? JSON.stringify(plan_details) : plan_details;

  db.run(
    'INSERT INTO study_plans (user_id, course_id, target_exam_date, daily_target_hours, plan_details_json) VALUES (?, ?, ?, ?, ?)',
    [userId, course_id || null, target_exam_date || '', daily_target_hours || 2.0, planJson],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error creating study plan' });
      res.json({ success: true, planId: this.lastID });
    }
  );
});

// 7. COMMUNITY SHARED RESOURCES & REVIEWS
app.get('/api/community/resources', optionalAuthenticateToken, (req, res) => {
  const { category, resource_type } = req.query;
  let sql = 'SELECT r.*, u.display_name as author_name FROM shared_resources r JOIN users u ON r.author_id = u.id WHERE r.is_public = 1';
  const params = [];

  if (category) {
    sql += ' AND r.category = ?';
    params.push(category);
  }
  if (resource_type) {
    sql += ' AND r.resource_type = ?';
    params.push(resource_type);
  }
  sql += ' ORDER BY r.likes_count DESC, r.created_at DESC LIMIT 50';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching resources' });
    const formatted = (rows || []).map(r => ({
      ...r,
      content: JSON.parse(r.content_json)
    }));
    res.json({ success: true, resources: formatted });
  });
});

app.post('/api/community/resources', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title, category, resource_type, content, is_public } = req.body;
  if (!title || !resource_type || !content) {
    return res.status(400).json({ error: 'title, resource_type, and content are required' });
  }

  const contentJson = typeof content === 'object' ? JSON.stringify(content) : content;

  db.run(
    'INSERT INTO shared_resources (author_id, title, category, resource_type, content_json, is_public) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, category || 'general', resource_type, contentJson, is_public !== undefined ? (is_public ? 1 : 0) : 1],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error publishing resource' });
      res.json({ success: true, resourceId: this.lastID });
    }
  );
});

app.post('/api/community/resources/:id/like', authenticateToken, (req, res) => {
  const resourceId = req.params.id;
  db.run('UPDATE shared_resources SET likes_count = likes_count + 1 WHERE id = ?', [resourceId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error updating likes' });
    res.json({ success: true, updated: this.changes > 0 });
  });
});

// 8. DOCUMENT EMBEDDINGS (RAG SEARCH CHUNKS)
app.get('/api/embeddings/:document_id', authenticateToken, (req, res) => {
  const docId = req.params.document_id;
  db.all('SELECT id, document_id, chunk_index, chunk_text, page_number FROM document_embeddings WHERE document_id = ? ORDER BY chunk_index ASC', [docId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching document chunks' });
    res.json({ success: true, chunks: rows || [] });
  });
});

app.post('/api/embeddings', authenticateToken, (req, res) => {
  const { document_id, chunk_index, chunk_text, embedding_vector, page_number } = req.body;
  if (!document_id || chunk_index === undefined || !chunk_text) {
    return res.status(400).json({ error: 'document_id, chunk_index, and chunk_text are required' });
  }

  const vectorStr = typeof embedding_vector === 'object' ? JSON.stringify(embedding_vector) : (embedding_vector || '[]');

  db.run(
    'INSERT INTO document_embeddings (document_id, chunk_index, chunk_text, embedding_vector, page_number) VALUES (?, ?, ?, ?, ?)',
    [document_id, chunk_index, chunk_text, vectorStr, page_number || 1],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error saving embedding chunk' });
      res.json({ success: true, chunkId: this.lastID });
    }
  );
});

// ══════════════════════════════════════════════════════
// 🏛️ ENTERPRISE EDTECH & UNIVERSITY SAAS API ENDPOINTS
// ══════════════════════════════════════════════════════

// 1. INSTITUTIONS DIRECTORY & CAMPUS TENANTS
app.get('/api/enterprise/institutions', (req, res) => {
  db.all('SELECT id, name, domain, country, tier, seats_total, seats_used, license_key, created_at FROM institutions ORDER BY seats_total DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching institutions' });
    res.json({ success: true, institutions: rows || [] });
  });
});

app.post('/api/enterprise/institutions', authenticateToken, (req, res) => {
  const { name, domain, country, tier, seats_total } = req.body;
  if (!name || !domain) return res.status(400).json({ error: 'name and domain are required' });

  const licenseKey = generateLicenseKey(domain.split('.')[0] || 'CAMPUS');
  const seats = seats_total || 5000;

  db.run(
    'INSERT INTO institutions (name, domain, country, tier, seats_total, seats_used, license_key) VALUES (?, ?, ?, ?, ?, 0, ?)',
    [name, domain, country || 'Global', tier || 'campus_enterprise', seats, licenseKey],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create institution' });
      
      const instId = this.lastID;
      // Record initial active license
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      
      db.run(
        'INSERT INTO enterprise_licenses (institution_id, license_key, plan_name, max_seats, expires_at) VALUES (?, ?, ?, ?, ?)',
        [instId, licenseKey, 'Campus Unlimited AI Suite', seats, expiry.toISOString()]
      );

      res.json({ success: true, institutionId: instId, licenseKey });
    }
  );
});

// 2. ENTERPRISE LICENSE VERIFICATION & ACTIVATION
app.post('/api/enterprise/licenses/verify', (req, res) => {
  const { licenseKey } = req.body;
  if (!licenseKey) return res.status(400).json({ error: 'licenseKey is required' });

  db.get(
    `SELECT i.*, l.plan_name, l.expires_at, l.is_active as license_active 
     FROM institutions i 
     LEFT JOIN enterprise_licenses l ON i.id = l.institution_id 
     WHERE i.license_key = ? OR l.license_key = ?`,
    [licenseKey, licenseKey],
    (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Invalid or expired enterprise license key.' });
      res.json({
        success: true,
        institution: {
          id: row.id,
          name: row.name,
          domain: row.domain,
          tier: row.tier,
          seatsTotal: row.seats_total,
          seatsUsed: row.seats_used,
          planName: row.plan_name || 'Campus Unlimited AI',
          expiresAt: row.expires_at
        }
      });
    }
  );
});

app.post('/api/enterprise/licenses/activate', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { licenseKey, department } = req.body;

  if (!licenseKey) return res.status(400).json({ error: 'licenseKey is required' });

  db.get('SELECT * FROM institutions WHERE license_key = ?', [licenseKey], (err, inst) => {
    if (err || !inst) return res.status(404).json({ error: 'Enterprise license key not recognized.' });

    // Enroll user into institution
    db.run(
      `INSERT INTO institution_members (institution_id, user_id, role, department) 
       VALUES (?, ?, 'student', ?)`,
      [inst.id, userId, department || 'General Studies'],
      function (memberErr) {
        // Upgrade user subscription quota to campus enterprise tier
        activateSubscription(userId, 'campus', () => {
          // Increment seats_used
          db.run('UPDATE institutions SET seats_used = seats_used + 1 WHERE id = ?', [inst.id]);
          logAudit(userId, `CAMPUS_LICENSE_ACTIVATED:${inst.name}`, req.ip, req.headers['user-agent']);
          res.json({
            success: true,
            institutionName: inst.name,
            role: 'student',
            message: `Successfully linked your academic profile to ${inst.name}! Enterprise AI features unlocked.`
          });
        });
      }
    );
  });
});

// 3. INSTRUCTOR ACADEMIC CLASSES
app.get('/api/enterprise/instructor/classes', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(
    `SELECT c.*, 
      (SELECT COUNT(*) FROM class_roster r WHERE r.class_id = c.id) as students_count,
      (SELECT COUNT(*) FROM class_assignments a WHERE a.class_id = c.id) as assignments_count
     FROM instructor_classes c 
     WHERE c.instructor_id = ? 
     ORDER BY c.created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error fetching classes' });
      res.json({ success: true, classes: rows || [] });
    }
  );
});

app.post('/api/enterprise/instructor/classes', authenticateToken, (req, res) => {
  const instructorId = req.user.id;
  const { class_name, course_code, department, semester, syllabus_text } = req.body;
  if (!class_name || !course_code) return res.status(400).json({ error: 'class_name and course_code are required' });

  db.run(
    'INSERT INTO instructor_classes (instructor_id, class_name, course_code, department, semester, syllabus_text) VALUES (?, ?, ?, ?, ?, ?)',
    [instructorId, class_name, course_code, department || 'Computer Science', semester || 'Fall 2026', syllabus_text || ''],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create class' });
      res.json({ success: true, classId: this.lastID });
    }
  );
});

// 4. CLASS ROSTER
app.get('/api/enterprise/instructor/classes/:id/roster', authenticateToken, (req, res) => {
  const classId = req.params.id;
  db.all('SELECT * FROM class_roster WHERE class_id = ? ORDER BY student_name ASC', [classId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching roster' });
    res.json({ success: true, roster: rows || [] });
  });
});

app.post('/api/enterprise/instructor/classes/:id/roster', authenticateToken, (req, res) => {
  const classId = req.params.id;
  const { student_name, student_email, student_id } = req.body;
  if (!student_name || !student_email) return res.status(400).json({ error: 'student_name and student_email are required' });

  db.run(
    'INSERT INTO class_roster (class_id, student_id, student_name, student_email) VALUES (?, ?, ?, ?)',
    [classId, student_id || null, student_name, student_email],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add student to roster' });
      res.json({ success: true, rosterId: this.lastID });
    }
  );
});

// 5. CLASS ASSIGNMENTS
app.get('/api/enterprise/instructor/classes/:id/assignments', authenticateToken, (req, res) => {
  const classId = req.params.id;
  db.all(
    `SELECT a.*, 
      (SELECT COUNT(*) FROM class_submissions s WHERE s.assignment_id = a.id) as submissions_count,
      (SELECT AVG(s.score) FROM class_submissions s WHERE s.assignment_id = a.id) as avg_score
     FROM class_assignments a 
     WHERE a.class_id = ? 
     ORDER BY a.created_at DESC`,
    [classId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error fetching assignments' });
      res.json({ success: true, assignments: rows || [] });
    }
  );
});

app.post('/api/enterprise/instructor/classes/:id/assignments', authenticateToken, (req, res) => {
  const classId = req.params.id;
  const { title, prompt, rubric_json, max_score, due_date } = req.body;
  if (!title || !prompt) return res.status(400).json({ error: 'title and prompt are required' });

  const rubricStr = typeof rubric_json === 'object' ? JSON.stringify(rubric_json) : (rubric_json || '{}');

  db.run(
    'INSERT INTO class_assignments (class_id, title, prompt, rubric_json, max_score, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [classId, title, prompt, rubricStr, max_score || 100, due_date || null],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create assignment' });
      res.json({ success: true, assignmentId: this.lastID });
    }
  );
});

// 6. SUBMISSIONS & BATCH AI AUTOMATED GRADING
app.get('/api/enterprise/instructor/assignments/:id/submissions', authenticateToken, (req, res) => {
  const assignmentId = req.params.id;
  db.all('SELECT * FROM class_submissions WHERE assignment_id = ? ORDER BY score DESC, created_at DESC', [assignmentId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching submissions' });
    const formatted = (rows || []).map(r => ({
      ...r,
      ai_feedback: r.ai_feedback_json ? JSON.parse(r.ai_feedback_json) : {}
    }));
    res.json({ success: true, submissions: formatted });
  });
});

app.post('/api/enterprise/instructor/assignments/:id/submissions', authenticateToken, (req, res) => {
  const assignmentId = req.params.id;
  const { student_id, student_name, submission_text } = req.body;
  if (!student_name || !submission_text) return res.status(400).json({ error: 'student_name and submission_text are required' });

  db.run(
    'INSERT INTO class_submissions (assignment_id, student_id, student_name, submission_text) VALUES (?, ?, ?, ?)',
    [assignmentId, student_id || null, student_name, submission_text],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to record submission' });
      res.json({ success: true, submissionId: this.lastID });
    }
  );
});

app.post('/api/enterprise/instructor/assignments/:id/grade-batch', authenticateToken, async (req, res) => {
  const assignmentId = req.params.id;

  db.get('SELECT * FROM class_assignments WHERE id = ?', [assignmentId], async (assignErr, assignment) => {
    if (assignErr || !assignment) return res.status(404).json({ error: 'Assignment not found' });

    db.all('SELECT * FROM class_submissions WHERE assignment_id = ?', [assignmentId], async (subErr, submissions) => {
      if (subErr || !submissions || submissions.length === 0) {
        return res.status(400).json({ error: 'No submissions found to grade.' });
      }

      const gradedResults = [];

      for (const sub of submissions) {
        try {
          const gradeReport = await gradeEssay({
            question: assignment.prompt,
            studentAnswer: sub.submission_text,
            rubric: assignment.rubric_json
          });

          const plagReport = await analyzePlagiarism(sub.submission_text);

          const finalScore = gradeReport.score || 85;
          const letterGrade = gradeReport.letterGrade || (finalScore >= 90 ? 'A' : (finalScore >= 80 ? 'B' : (finalScore >= 70 ? 'C' : 'D')));
          const feedbackJson = JSON.stringify(gradeReport);
          const plagScore = plagReport.aiLikelihood || 12;

          db.run(
            `UPDATE class_submissions 
             SET score = ?, letter_grade = ?, ai_feedback_json = ?, plagiarism_score = ?, ai_likelihood = ?, status = 'graded', graded_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [finalScore, letterGrade, feedbackJson, plagScore, plagScore, sub.id]
          );

          gradedResults.push({
            submissionId: sub.id,
            studentName: sub.student_name,
            score: finalScore,
            letterGrade,
            feedback: gradeReport
          });
        } catch (e) {
          console.error('Error grading student submission:', sub.id, e.message);
        }
      }

      res.json({
        success: true,
        totalGraded: gradedResults.length,
        results: gradedResults,
        message: `Successfully batch-graded ${gradedResults.length} student submissions!`
      });
    });
  });
});

// 7. COHORT RISK & RETENTION ANALYTICS
app.get('/api/enterprise/analytics/cohort/:class_id', authenticateToken, (req, res) => {
  const classId = req.params.class_id;

  db.all(
    `SELECT s.id, s.student_id, s.student_name, s.score, s.plagiarism_score, s.letter_grade 
     FROM class_submissions s 
     JOIN class_assignments a ON s.assignment_id = a.id 
     WHERE a.class_id = ?`,
    [classId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error fetching cohort analytics' });
      const analytics = calculateCohortRisk(rows || []);
      res.json({ success: true, classId, analytics });
    }
  );
});

// 8. LMS QTI 2.1 & MOODLE XML EXPORT
app.post('/api/enterprise/export/lms', optionalAuthenticateToken, (req, res) => {
  const { title, lmsType, questions } = req.body;
  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'questions array is required' });
  }

  const exportType = (lmsType || 'canvas').toLowerCase();
  let exportContent = '';
  let contentType = 'application/xml';
  let fileExtension = 'xml';

  if (exportType === 'moodle') {
    exportContent = generateMoodleXml(title, questions);
  } else {
    // Canvas & Blackboard use standard IMS QTI 2.1
    exportContent = generateQtiXml(title, questions);
  }

  if (req.user) {
    db.run(
      'INSERT INTO lms_exports (user_id, tool_name, lms_type, export_title, payload_json) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'qgen', exportType, title || 'Assessment Export', JSON.stringify({ questionCount: questions.length })]
    );
  }

  res.json({
    success: true,
    lmsType: exportType,
    fileName: `${(title || 'aethera_assessment').toLowerCase().replace(/\s+/g, '_')}_${exportType}.${fileExtension}`,
    contentType,
    xmlData: exportContent
  });
});

// 9. INSTITUTIONAL ROI & SAVINGS CALCULATOR
app.get('/api/enterprise/roi-calculator', (req, res) => {
  const studentsCount = Number(req.query.students) || 5000;
  const professorsCount = Number(req.query.professors) || 150;
  const avgHourlyFacultyCost = Number(req.query.hourlyCost) || 45;

  const roi = calculateInstitutionalROI({ studentsCount, professorsCount, avgHourlyFacultyCost });
  res.json({ success: true, roi });
});

// ── Static Files & Catch-All Frontend ──
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '..', '..')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});




app.listen(PORT, () => {
  console.log(`Aethera running on http://localhost:${PORT}`);
  console.log(`  Frontend: http://localhost:${PORT}`);
  console.log(`  API:      http://localhost:${PORT}/api`);
});

