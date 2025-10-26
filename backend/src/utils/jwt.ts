import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
