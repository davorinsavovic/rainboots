const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
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
    console.error('Error fetching templates:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create template - IMPROVED ERROR HANDLING
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    console.log('📝 Creating email template...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { completeContent, ...data } = req.body;

      // Ensure required fields are present
      if (!data.title || !data.subject || !data.content) {
        return res.status(400).json({
          success: false,
          error:
            'Missing required fields: title, subject, and content are required',
        });
      }

      // Check for duplicate title
      const existingTemplate = await EmailTemplate.findOne({
        title: data.title,
      });
      if (existingTemplate) {
        return res.status(400).json({
          success: false,
          error: `A template with the title "${data.title}" already exists`,
        });
      }

      // Create template with default values for missing fields
      const template = new EmailTemplate({
        title: data.title.trim(),
        subject: data.subject.trim(),
        content: data.content,
        status: data.status !== undefined ? data.status : true,
        category: data.category || 'outreach',
        includeSignature: data.includeSignature || false,
        signatureConfig: data.signatureConfig || {
          organizationName: 'Rainboots Marketing',
          title: '',
          fullName: '',
          phone: '',
          email: '',
          website: 'https://rainbootsmarketing.com',
          additionalInfo: '',
        },
        variables: data.variables || [],
        tags: data.tags || [],
        attachments: data.attachments || [],
      });

      await template.save();
      console.log('✅ Template created successfully:', template._id);
      res.status(201).json({ success: true, data: template });
    } catch (err) {
      console.error('❌ Error creating template:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);

      // Handle duplicate key error (MongoDB error code 11000)
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          error:
            'A template with this title already exists. Please use a unique title.',
        });
      }

      // Handle validation errors
      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (e) => e.message,
        );
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', '),
        });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// GET template by id
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update template
router.put('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    }

    const { completeContent, ...updates } = req.body;

    // Handle nested signature config properly
    if (updates.signatureConfig) {
      template.signatureConfig = {
        ...(template.signatureConfig || {}),
        ...updates.signatureConfig,
      };
      delete updates.signatureConfig;
    }

    // Update all other fields
    for (const key in updates) {
      if (updates[key] !== undefined) {
        template.set(key, updates[key]);
      }
    }

    await template.save();
    console.log('✅ Template updated:', template._id);
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
    if (!template) {
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    }

    // Delete attachments from R2 if they exist
    for (const att of template.attachments || []) {
      if (att.url && isR2Url(att.url)) {
        try {
          await deleteFromR2(att.url);
        } catch (err) {
          console.error('Error deleting attachment from R2:', err);
        }
      }
    }

    await EmailTemplate.findByIdAndDelete(req.params.id);
    console.log('✅ Template deleted:', req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST upload attachment
router.post(
  '/:id/upload-attachment',
  upload.single('attachment'),
  async (req, res) => {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template) {
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: 'No file uploaded' });
      }

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
      console.error('Error uploading attachment:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// DELETE attachment
router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    }

    const idx = template.attachments.findIndex(
      (a) => a._id.toString() === req.params.attachmentId,
    );
    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, error: 'Attachment not found' });
    }

    const att = template.attachments[idx];
    if (att.url && isR2Url(att.url)) {
      try {
        await deleteFromR2(att.url);
      } catch (err) {
        console.error('Error deleting attachment:', err);
      }
    }

    template.attachments.splice(idx, 1);
    await template.save();

    res.json({ success: true, data: { removed: true } });
  } catch (err) {
    console.error('Error deleting attachment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET generate HTML preview
router.get('/:id/generate-html', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });
    }
    res.json({
      success: true,
      data: { html: template.getCompleteEmailHTML() },
    });
  } catch (err) {
    console.error('Error generating HTML:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
