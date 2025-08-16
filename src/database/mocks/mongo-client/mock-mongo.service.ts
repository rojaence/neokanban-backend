import { Injectable } from '@nestjs/common';
import { UnitTestUtils } from '@src/common/test/unit/unit-test.utils';
import { CollectionNameType } from '@src/database/mongo/mongo.interface';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Collection, InsertOneResult, ObjectId, OptionalId } from 'mongodb';

@Injectable()
export class MockMongoService {
  db: DeepMockProxy<Record<CollectionNameType, Collection<Document>>>;
  constructor() {
    this.db = mockDeep<Record<CollectionNameType, Collection<Document>>>();

    this.initializeDbMock();
  }

  initializeDbMock() {
    const collections: CollectionNameType[] = [
      'sec_jwt_blacklist',
      'sec_jwt_whitelist',
    ];
    for (const name of collections) {
      const collection = mockDeep<Collection<Document>>();
      switch (name) {
        case 'sec_jwt_blacklist':
          this.addJwtBlacklistImplementations(collection);
          break;
        case 'sec_jwt_whitelist':
          this.addJwtWhitelistImplementations(collection);
          break;
      }
      this.db[name] = collection;
    }
  }

  addJwtBlacklistImplementations(
    collection: DeepMockProxy<Collection<Document>>,
  ) {
    collection.insertOne.mockImplementation(
      async (doc: OptionalId<Document>): Promise<InsertOneResult> => {
        const inserted = { _id: new ObjectId(), ...doc };
        await UnitTestUtils.sleepTest(100);
        return {
          acknowledged: true,
          insertedId: inserted._id,
        };
      },
    );
    collection.findOne.mockResolvedValue(null);
  }

  addJwtWhitelistImplementations(
    collection: DeepMockProxy<Collection<Document>>,
  ) {
    collection.insertOne.mockImplementation(
      async (doc: OptionalId<Document>): Promise<InsertOneResult> => {
        const inserted = { _id: new ObjectId(), ...doc };
        await UnitTestUtils.sleepTest(100);
        return {
          acknowledged: true,
          insertedId: inserted._id,
        };
      },
    );
    collection.findOne.mockResolvedValue(null);
  }

  collection<T extends Document = Document>(
    name: CollectionNameType,
  ): Collection<T> {
    return this.db[name] as unknown as Collection<T>;
  }
}
