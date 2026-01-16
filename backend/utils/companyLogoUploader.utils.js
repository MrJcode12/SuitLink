import cloudinary from '../config/cloudinaryCompany.config.js';

export const uploadCompanyLogo = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'company-logos',
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      }
    ).end(fileBuffer);
  });
};

export const deleteCompanyLogo = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });
};