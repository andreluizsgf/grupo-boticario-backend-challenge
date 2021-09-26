import { BaseModel } from "./Base";

export interface User extends BaseModel {
    name: string
    age: number
}