const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const crypto = require('crypto');
const EmailTemplate = require('../models/EmailTemplate');
const { uploadToR2, deleteFromR2, isR2Url } = require('../utils/r2');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadAttachmentToR2 = async (fileBuffer, filename, mimetype) => {
  const { url } = await uploadToR2(fileBuffer, 'attachments', filename);
  return {
    filename,
    url,
    size: fileBuffer.length,
    mimeType: mimetype,
    uploadedAt: new Date(),
  };
};

// GET all templates
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET template by id
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    if (!template.completeContent) {
      template.completeContent = template.getCompleteEmailHTML();
      await template.save();
    }
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create template
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { completeContent, ...data } = req.body;
      const template = new EmailTemplate({
        ...data,
        attachments: data.attachments || [],
      });

      await template.save();
      res.status(201).json({ success: true, data: template });
    } catch (err) {
      console.error('Error creating template:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// PUT update template
router.put('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    const { completeContent, ...updates } = req.body;

    // ✅ Handle nested signature config properly
    if (updates.signatureConfig) {
      template.signatureConfig = {
        ...template.signatureConfig.toObject(),
        ...updates.signatureConfig,
      };
      delete updates.signatureConfig;
    }

    // ✅ Properly set all other fields
    for (const key in updates) {
      template.set(key, updates[key]);
    }

    await template.save();

    res.json({ success: true, data: template });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE template
router.delete('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });

    for (const att of template.attachments || []) {
      if (att.url && isR2Url(att.url)) {
        try {
          await deleteFromR2(att.url);
        } catch (_) {}
      }
    }

    await EmailTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST upload single attachment - REMOVED authenticate
router.post(
  '/:id/upload-attachment',
  upload.single('attachment'),
  async (req, res) => {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template)
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, error: 'No file uploaded' });

      const attachment = await uploadAttachmentToR2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );
      template.attachments.push(attachment);
      await template.save();

      res.json({
        success: true,
        data: { attachment, templateId: template._id },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// DELETE attachment - REMOVED authenticate
router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });

    const idx = template.attachments.findIndex(
      (a) => a._id.toString() === req.params.attachmentId,
    );
    if (idx === -1)
      return res
        .status(404)
        .json({ success: false, error: 'Attachment not found' });

    const att = template.attachments[idx];
    if (att.url && isR2Url(att.url)) {
      try {
        await deleteFromR2(att.url);
      } catch (_) {}
    }

    template.attachments.splice(idx, 1);
    await template.save();

    res.json({ success: true, data: { removed: true } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET generate HTML preview - REMOVED authenticate
router.get('/:id/generate-html', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    res.json({
      success: true,
      data: { html: template.getCompleteEmailHTML() },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
