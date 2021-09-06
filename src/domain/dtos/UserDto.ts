interface BaseUserDto {
    name: string
    age: number
}

export interface CreateUserRequest extends BaseUserDto {}

export interface UserResponse extends BaseUserDto {
    id: string
    createdAt: Date
    updatedAt: Date
}