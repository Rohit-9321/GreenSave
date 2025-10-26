import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { auth, AuthRequest } from '../middleware/auth.js'
import { saveImage } from '../utils/uploader.js'

const router = Router()
router.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true }))

router.post('/image', auth, async (req: AuthRequest, res) => {
  const file: any = (req as any).files?.file
  if (!file) return res.status(400).json({ error: 'No file' })
  // Basic "moderation" placeholder (reject super small files)
  if (file.size < 1024) return res.status(400).json({ error: 'File too small' })
  try {
    const url = await saveImage(file, req.user!.id)
    res.json({ ok: true, url })
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Upload failed' })
  }
})

export default router
