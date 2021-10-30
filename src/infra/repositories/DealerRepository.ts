import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository"
import { Dealer } from "../../domain/entities/Dealer";
import BaseRepository from "./BaseRepository";

export default class DealerRepository extends BaseRepository<Dealer> implements IDealerRepository  {
    constructor() {
        super("dealers");
    }
    
    
 }