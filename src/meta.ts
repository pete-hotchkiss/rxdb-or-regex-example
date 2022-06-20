import { RxDatabase } from 'rxdb';
import { Observable } from "rxjs";

export type ExampleCollections = {
  people: any,
}

export type ExampleDB = RxDatabase<ExampleCollections>;
