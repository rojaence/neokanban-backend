import environment from '@src/environment/environment';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Collection, Db, Document, MongoClient } from 'mongodb';
import { CollectionNameType } from './mongo.interface';

@Injectable()
export class MongoService implements OnModuleDestroy, OnModuleInit {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    console.log('🚀 ~ environment:', environment);
    this.client = new MongoClient(environment.MONGO_DATABASE_URL);
    await this.client.connect();
    this.db = this.client.db();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getDatabase() {
    return this.db;
  }

  collection<T extends Document>(name: CollectionNameType): Collection<T> {
    return this.db.collection(name);
  }
}
