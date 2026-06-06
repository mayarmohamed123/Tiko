import { v2 as cloudinary } from 'cloudinary';

let configured = false;

const ensureConfigured = (): boolean => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }

  return true;
};

export const isCloudinaryConfigured = (): boolean => ensureConfigured();

export const uploadProductImage = async (
  buffer: Buffer,
  productId: string
): Promise<{ url: string; publicId: string; mimeType?: string; sizeBytes?: number }> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `tiko/products/${productId}`,
        resource_type: 'auto', // 'auto' handles HEIC/HEIF from Apple devices
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          mimeType: `image/${result.format}`,
          sizeBytes: result.bytes,
        });
      }
    );
    uploadStream.end(buffer);
  });
};

export const uploadTransactionImage = async (
  buffer: Buffer,
  orderId: string
): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `tiko/transactions/${orderId}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
  if (!isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId);
};

export const uploadUserAvatar = async (
  buffer: Buffer,
  userId: string
): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `tiko/avatars/${userId}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto', width: 250, height: 250, crop: 'fill' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export const uploadSettingsImage = async (
  buffer: Buffer,
  key: string
): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `tiko/settings/${key}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export default cloudinary;
