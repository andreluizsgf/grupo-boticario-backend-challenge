import { BaseModel } from './Base';

export interface Dealer extends BaseModel {
    name: string
    cpf: string
    email: string
    password: string
}