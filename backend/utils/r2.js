const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET = process.env.R2_BUCKET || 'rainboots';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

/**
 * Upload a file to R2
 * @param {Buffer} fileBuffer - File data
 * @param {string} folder - Folder name (e.g., 'attachments')
 * @param {string} filename - Original filename
 * @returns {Promise<{url: string, key: string}>}
 */
const uploadToR2 = async (fileBuffer, folder, filename) => {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: getContentType(filename),
  });

  await r2Client.send(command);

  const url = `${R2_PUBLIC_URL}/${key}`;
  return { url, key };
};

/**
 * Delete a file from R2
 * @param {string} url - File URL
 * @returns {Promise<void>}
 */
const deleteFromR2 = async (url) => {
  try {
    const key = extractKeyFromUrl(url);
    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
  }
};

/**
 * Check if URL is an R2 URL
 * @param {string} url
 * @returns {boolean}
 */
const isR2Url = (url) => {
  if (!url) return false;
  return (
    url.includes('r2.cloudflarestorage.com') ||
    url.includes('.r2.dev') ||
    (R2_PUBLIC_URL && url.includes(R2_PUBLIC_URL))
  );
};

/**
 * Extract key from R2 URL
 * @param {string} url
 * @returns {string|null}
 */
const extractKeyFromUrl = (url) => {
  if (R2_PUBLIC_URL && url.includes(R2_PUBLIC_URL)) {
    return url.replace(`${R2_PUBLIC_URL}/`, '');
  }
  const match = url.match(/\.r2\.dev\/(.+)$/);
  if (match) return match[1];
  return null;
};

/**
 * Get content type based on file extension
 * @param {string} filename
 * @returns {string}
 */
const getContentType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const contentTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
  };
  return contentTypes[ext] || 'application/octet-stream';
};

module.exports = {
  uploadToR2,
  deleteFromR2,
  isR2Url,
};
