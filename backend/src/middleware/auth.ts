import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export interface AuthRequest extends Request {
  user?: { id: number, email: string, name: string };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
