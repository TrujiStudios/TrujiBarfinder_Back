

// // import { Request, Response } from 'express';
// // import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../../interfaces/userInterface';
// // import * as userService from '../services/userService';

// export const createUser = async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;
//     const userData: CreateUserDTO = { name, email, password };
//     try {
//         const newUser = await userService.createUser(userData);
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateUser = async (req: Request, res: Response) => {
//     const userId = req.params.id;
//     const { name, email, password } = req.body;
//     const updateData: UpdateUserDTO = { name, email, password };
//     try {
//         const updatedUser = await userService.updateUser(userId, updateData);
//         if (updatedUser) {
//             res.status(200).json(updatedUser);
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
