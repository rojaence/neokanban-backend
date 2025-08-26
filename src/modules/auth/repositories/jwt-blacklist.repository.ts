import { Injectable } from '@nestjs/common';
import { MongoService } from '@src/database/mongo/mongo.service';
import {
  JwtBlacklist,
  JwtBlacklistCreateDTO,
} from '../models/jwt-blacklist.interface';

@Injectable()
export class JwtBlacklistRepository {
  constructor(private readonly mongo: MongoService) {}

  private get collection() {
    return this.mongo.collection<JwtBlacklist>('sec_jwt_blacklist');
  }

  async create(payload: JwtBlacklistCreateDTO): Promise<JwtBlacklist> {
    const result = await this.collection.insertOne(payload);
    return {
      _id: result.insertedId,
      ...payload,
    };
  }

  async findInBlacklist(jti: string) {
    const result = await this.collection.findOne({ jti: { $eq: jti } });
    return result;
  }
}
