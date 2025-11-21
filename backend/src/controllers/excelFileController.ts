import { Request, Response } from 'express'
import fs from 'fs'

export const handleUploadExcelFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File not sent' })
    const filePath = req.file.path
    console.log('filePath', filePath)
    const buffer = fs.readFileSync(filePath)
    console.log('buffer', buffer)
    return res.json({ message: 'File saved' })
  } catch (error) {
    console.log('upload error:', error)
    return res.status(500).json({ error: 'Error while processing the file' })
  }
}
