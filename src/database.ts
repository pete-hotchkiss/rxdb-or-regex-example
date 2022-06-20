import { RxCollection } from "rxdb";
import { createRxDatabase, addRxPlugin, RxPlugin } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";

import * as DB from "./meta";
import * as Person from "./schemas/person.json";

export class DataStore {

  private db: any;

  constructor() {
    console.log("make a database…");

    addPouchPlugin(require("pouchdb-adapter-memory"));

    this.init();
  }

  async init() {
    this.db = await createRxDatabase<DB.ExampleCollections>({
      name: "Example",
      /* istanbul ignore else */
      storage: getRxStoragePouch("memory"),
    });

    await this.db.addCollections({
      people: {
        schema: Person.schema
      }
    });

    await this.db.people.bulkUpsert([
      { id: "id0001", firstName: "Arnold", surName: "Snarold"},
      { id: "id0002", firstName: "Brian", surName: "Koolun"},
      { id: "id0003", firstName: "Ramish", surName: "Signna"},
      { id: "id0004", firstName: "Ian", surName: "Putternal"},
      { id: "id0005", firstName: "Milian", surName: "Sanchez"},
      { id: "id0006", firstName: "Kascey", surName: "Piannal"},
    ]);

    console.log("done creating DB");

    let set1 = await this.db.people.find({
      selector: {
        "$or": [
          { firstName: {"$eq": "Ian" } },
          { surName: {"$eq": "Piannal" } }
        ]
      }
    }).exec();

    console.log(`There are ${set1.length} results`);

    let set2 = await this.db.people.find({
      selector: {
        "$or": [
          { firstName: {"$regex": new RegExp(".*Ian.*", "gi") } },
          { surName: {"$regex": new RegExp(".*Ian.*", "gi") } }
        ]
      }
    }).exec();
  }
}
