import { v4 } from "uuid";
import { BaseModel } from "../../domain/entities/Base";
import { knex } from "../db";

type Insert<T extends BaseModel> = Omit<T, "createdAt" | "updatedAt" | "id"> & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

export class BaseRepository<T extends BaseModel> {
    constructor(private readonly tableName: string) {}

    async insert(item: Insert<T>) {
        const now = new Date();

        return (await knex(this.tableName).insert({
            id: v4(),
            ...item,
            createdAt: now,
            updatedAt: now
        }).returning('*'))[0] as T
    }
}