import { Injectable } from '@nestjs/common';
import { MongoService } from '@src/database/mongo/mongo.service';
import {
  JwtWhitelist,
  JwtWhitelistCreateDTO,
} from '../models/jwt-whitelist.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class JwtWhitelistRepository {
  constructor(private readonly mongo: MongoService) {}

  private get collection() {
    return this.mongo.collection<JwtWhitelist>('sec_jwt_whitelist');
  }

  async create(payload: JwtWhitelistCreateDTO): Promise<JwtWhitelist> {
    const result = await this.collection.insertOne(payload);
    return {
      _id: result.insertedId,
      ...payload,
    };
  }

  async delete(id: ObjectId) {
    const result = await this.collection.deleteOne({ _id: id });
    return result;
  }

  async findInWhitelist(jti: string) {
    const result = await this.collection.findOne({ jti });
    return result;
  }
}
