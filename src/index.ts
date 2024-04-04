import {
  Selectable,
  Updatable,
  Deletable,
  Insertable,
  ConstructorQueryInsertable,
  ConstructorQuery,
  SQLOperation,
  ConstructorQuerySelectable,
  ConstructorQueryUpdatable,
  SQLFunctionMap,
  ConstructorQueryDeletable,
} from './interfaces';

interface Casa {
  rua: string;
  quartos: number;
  bairro: string;
}

export default class QueryComposer<T>
  implements Selectable<T>, Updatable<T>, Deletable<T>, Insertable<T>
{
  private m_selectedColumns: (keyof T)[] = [];
  private m_updateColumns: { columnName: keyof T; columnValue: string }[] = [];
  private m_sqlOperation: SQLOperation = SQLOperation.SELECT;
  private m_tableName: string | null = null;
  private m_whereCondition: string | null = null;

  private toStringSelect = (): string => {
    let columns = '*';

    if (this.m_selectedColumns.length > 0) {
      columns = this.m_selectedColumns.join(', ');
    }

    return `${this.m_sqlOperation.toString()} ${columns} FROM ${
      this.m_tableName
    }${this.m_whereCondition ?? ';'}`;
  };

  private toStringUpdate = (): string => {
    let columns = '';

    if (this.m_updateColumns.length > 0) {
      columns = this.m_updateColumns
        .map((entry) => `${entry.columnName.toString()} = ${entry.columnValue}`)
        .join(', ');
    }

    return `${this.m_sqlOperation.toString()} ${
      this.m_tableName
    } SET ${columns}${this.m_whereCondition ?? ';'}`;
  };

  private toStringInsert = (): string => {
    let columns = '';

    if (this.m_updateColumns.length > 0) {
      const columnNames = this.m_updateColumns
        .map((entry) => entry.columnName)
        .join(', ');
      const columnValues = this.m_updateColumns
        .map((entry) => entry.columnValue)
        .join(',');

      columns = `(${columnNames}) VALUES (${columnValues})`;
    }

    return `${this.m_sqlOperation.toString()} ${
      this.m_tableName
    } SET ${columns};`;
  };

  private toStringDelete = (): string => {
    return `${this.m_sqlOperation.toString()} FROM ${this.m_tableName}${
      this.m_whereCondition ?? ';'
    }`;
  };

  private m_toString: SQLFunctionMap = {
    [SQLOperation.SELECT]: this.toStringSelect,
    [SQLOperation.UPDATE]: this.toStringUpdate,
    [SQLOperation.DELETE]: this.toStringDelete,
    [SQLOperation.INSERT]: this.toStringInsert,
  };

  private Select = <K extends keyof T>(
    ...columns: K[]
  ): ConstructorQuerySelectable<T> => {
    this.m_selectedColumns.push(...columns);
    return this as unknown as ConstructorQuerySelectable<T>;
  };

  private Insert = <K extends keyof T>(
    columnName: K,
    columnValue: T[K]
  ): ConstructorQueryInsertable<T> => {
    let value: any = '';
    if (typeof columnValue === 'string') {
      // Normaliza columnValue, colocando entre aspas simples
      value = `'${columnValue}'`;
    } else {
      value = columnValue;
    }

    this.m_updateColumns.push({ columnName, columnValue: value });
    return this as unknown as ConstructorQueryInsertable<T>;
  };

  private Update = <K extends keyof T>(
    columnName: K,
    columnValue: T[K]
  ): ConstructorQueryUpdatable<T> => {
    let value: any = '';
    if (typeof columnValue === 'string') {
      // Normaliza columnValue, colocando entre aspas simples
      value = `'${columnValue}'`;
    } else {
      value = columnValue;
    }

    this.m_updateColumns.push({ columnName, columnValue: value });
    return this as unknown as ConstructorQueryUpdatable<T>;
  };

  private Where = (filter: (item: T) => boolean): ConstructorQuery<T> => {
    const filterBody = this.getFilterBody(filter);
    const sqlCondition = this.convertToSQL(filterBody);
    this.m_whereCondition = ` WHERE ${sqlCondition}`;
    return this as unknown as ConstructorQuery<T>;
  };

  private getFilterBody(filter: (item: T) => boolean): string {
    const filterString = filter.toString();

    const filterBody = filterString
      .substring(filterString.indexOf('{') + 1, filterString.lastIndexOf('}'))
      .trim();

    return filterBody.slice(6).trim();
  }

  private convertToSQL(filterBody: string): string {
    return filterBody
      .replace(/item\./g, '')
      .replace(/&&/g, 'AND')
      .replace(/===|==/g, '=')
      .replace(/\|\|/g, 'OR');
  }

  private toString = (): string => {
    return this.m_toString[this.m_sqlOperation]();
  };

  //#region iniciadores

  startSelection(entity: string): ConstructorQuerySelectable<T> {
    this.m_sqlOperation = SQLOperation.SELECT;
    this.m_tableName = entity;

    return {
      Select: (...columns) => {
        return this.Select(...columns);
      },
      Where: this.Where,
      toString: this.toString,
    };
  }

  startUpdation(entity: string): ConstructorQueryUpdatable<T> {
    this.m_sqlOperation = SQLOperation.UPDATE;
    this.m_tableName = entity;

    return {
      Update: (columnName, columnValue) => {
        return this.Update(columnName, columnValue);
      },
      Where: this.Where,
      toString: this.toString,
    };
  }

  startDeletion(entity: string): ConstructorQueryDeletable<T> {
    this.m_sqlOperation = SQLOperation.DELETE;
    this.m_tableName = entity;

    return {
      Where: (filter) => {
        return this.Where(filter);
      },
      toString: this.toString,
    };
  }

  startInsertion(entity: string): ConstructorQueryInsertable<T> {
    this.m_sqlOperation = SQLOperation.INSERT;
    this.m_tableName = entity;

    return {
      Insert: (columnName, columnValue) => {
        return this.Insert(columnName, columnValue);
      },
      toString: this.toString,
    };
  }
}
