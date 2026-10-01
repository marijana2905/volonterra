// Cloudinary server SDK can be ESM or CJS; normalize to the v2 API in both cases.
// Using namespace import avoids default/CJS interop pitfalls in different bundlers.
import * as cloudinaryModule from 'cloudinary';

// In CJS: require('cloudinary').v2; in some bundlers default export is already v2
const cl = (cloudinaryModule as any)?.v2 ?? (cloudinaryModule as any);

if (typeof cl?.config === 'function') {
  cl.config({
    // Prefer server-side env var; fall back to public if that’s what’s configured
    cloud_name:
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Export the normalized v2-compatible instance
export default cl as any;