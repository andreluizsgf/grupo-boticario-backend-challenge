import { BaseModel } from "./Base";

export const ORDER_STATUS = ["approved", "validating"] as const;
type OrderStatusTuple = typeof ORDER_STATUS;
export type OrderStatus = OrderStatusTuple[number];

export interface Order extends BaseModel {
  id: string;
  status: OrderStatus;
  code: string;
  dealerCpf: string;
  dealerId: string;
  date: Date;
  subtotal: number;
  cashbackPercentage: number;
  cashbackValueInCents: number;
}
