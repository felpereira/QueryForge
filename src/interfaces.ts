export interface Selectable<T> {
  startSelection: (entity: string) => ConstructorQuery<T>;
}

export interface Updatable<T> {
  startUpdation: (entity: string) => ConstructorQuery<T>;
}

export interface Deletable<T> {
  startDeletion: (entity: string) => ConstructorQuery<T>;
}

export interface Insertable<T> {
  startInsertion: (entity: string) => ConstructorQueryInsertable<T>;
}

export interface Creatable<T> {
  startCreation: (entity: string) => ConstructorQuery<T>;
}

export interface Alterable<T> {
  startAlteration: (entity: string) => ConstructorQuery<T>;
}

export interface Dropable<T> {
  startDropping: (entity: string) => ConstructorQuery<T>;
}

export interface ConstructorQuery<T> {
  // Select: <K extends keyof T>(...columns: K[]) => ConstructorQuery<T>;
  Where: (filter: (item: T) => boolean) => ConstructorQuery<T>;
  toString: () => string;
}

export interface ConstructorQuerySelectable<T> extends ConstructorQuery<T> {
  Select: <K extends keyof T>(...columns: K[]) => ConstructorQuerySelectable<T>;
}

export interface ConstructorQueryUpdatable<T> extends ConstructorQuery<T> {
  Update: <K extends keyof T>(
    columnName: K,
    columnValue: T[K]
  ) => ConstructorQueryUpdatable<T>;
}

export interface ConstructorQueryDeletable<T> extends ConstructorQuery<T> {}

export interface ConstructorQueryInsertable<T> {
  Insert: <K extends keyof T>(
    columnName: K,
    columnValue: T[K]
  ) => ConstructorQueryInsertable<T>;
  toString: () => string;
}

export enum SQLOperation {
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INSERT = 'INSERT INTO',
}

export interface SQLFunctionMap {
  [key: string]: () => string; // Usando string como tipo de chave
}
