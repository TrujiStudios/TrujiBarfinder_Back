

// // import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../interfaces/userInterface';
// // import { UserModel, IUserModel } from '../models/userModel';

// export const createUser = async (data: CreateUserDTO): Promise<UserResponseDTO> => {
//     const newUser = new UserModel(data);
//     await newUser.save();
//     return {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         createdAt: newUser.createdAt,
//         updatedAt: newUser.updatedAt,
//     };
// };

// export const updateUser = async (
//     id: string,
//     data: UpdateUserDTO): Promise<UserResponseDTO | null> => {
//     const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
//     if (!updatedUser) return null;
//     return {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         createdAt: updatedUser.createdAt,
//         updatedAt: updatedUser.updatedAt,
//     };
// };
