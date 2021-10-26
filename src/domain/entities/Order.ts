import { BaseModel } from "./Base";

export type OrderStatus = "Approved" | "Validating";

export interface Order extends BaseModel {
    id: string
    status: OrderStatus
    code: string
    dealerCpf: string
    date: Date
    subtotal: number
    cashbackPercentage: number
    cashbackValueInCents: number
}