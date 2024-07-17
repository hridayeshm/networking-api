import bcrypt from 'bcrypt'

export const verifyPassword = async(loginPassword, dbPassword) => {
   return await bcrypt.compare(loginPassword, dbPassword)
}