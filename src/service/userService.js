import { v4 as uuidv4 } from 'uuid';
import { register } from '../repositories/userRepository.js';

export const registerUser = async(args) => {
    const values = {
        username: args.data.username,
        email: args.data.email,
        password: args.data.password,
        emailVerificationToken: uuidv4(),
      };

    const registeredUser = await register(values);
    return registeredUser;
}