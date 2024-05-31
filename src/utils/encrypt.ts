import bcrypt from 'bcrypt';
import { ComparePasswordFunction } from '../interfaces/campareInterface';



export const encrypt = async (password: string): Promise<string> => {

    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        return hash;

    } catch (error) {
        throw new Error('Error encrypting password: ' + (error as Error).message);

    }
};



export const comparePassword: ComparePasswordFunction = async (password: string, hash: string): Promise<boolean> => {
    try {

        const isMatch = await bcrypt.compare(password, hash);
        if (!isMatch) {
            throw new Error('Password is invalid');
        } return isMatch;


    } catch (error) {
        throw new Error('Error comparing password: ' + (error as Error).message);
    }
};