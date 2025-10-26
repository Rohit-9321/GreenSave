// backend/src/utils/uploader.ts
import path from 'path'
import fs from 'fs'
import { UPLOAD_DIR, UPLOAD_STRATEGY } from '../config.js'

// Lazy Cloudinary loader (called only when needed)
let cloudinaryV2: any = null
async function getCloudinary() {
  if (!cloudinaryV2) {
    const mod = await import('cloudinary')
    cloudinaryV2 = mod.v2
    cloudinaryV2.config({ secure: true }) // uses CLOUDINARY_URL env
  }
  return cloudinaryV2
}

export async function saveImage(file: any, ownerId: number): Promise<string> {
  const ext = path.extname(file.name || '').toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    throw new Error('Invalid file type')
  }

  if (UPLOAD_STRATEGY === 'cloudinary') {
    const cloud = await getCloudinary()

    // Ensure we have the file buffer; express-fileupload gives file.data
    const buf: Buffer | undefined = (file as any)?.data
    if (!buf) throw new Error('No file data')

    // Write to tmp then upload to Cloudinary
    const tmp = path.join('/tmp', `u${ownerId}_${Date.now()}${ext}`)
    fs.writeFileSync(tmp, buf)
    const result = await cloud.uploader.upload(tmp, {
      folder: 'greensteps',
      resource_type: 'image'
    })
    try { fs.unlinkSync(tmp) } catch {}
    return result.secure_url
  }

  // Local fallback (default)
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const name = `u${ownerId}_${Date.now()}${ext}`
  const dest = path.join(UPLOAD_DIR, name)

  // express-fileupload gives either .mv() or .data
  if (typeof (file as any)?.mv === 'function') {
    await file.mv(dest)
  } else if ((file as any)?.data) {
    fs.writeFileSync(dest, (file as any).data)
  } else {
    throw new Error('Unsupported upload payload')
  }
  return `/uploads/${name}`
}
