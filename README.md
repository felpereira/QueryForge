May contain errors, chatgpt created it

### QueryForge

QueryForge is a TypeScript library that provides a flexible and type-safe way to compose SQL queries dynamically. With QueryForge, you can easily construct SELECT, INSERT, UPDATE, and DELETE queries using TypeScript code.

### Installation

You can install QueryForge via npm or yarn:

```bash
npm install queryforge
```

or

```bash
yarn add queryforge
```

### Usage

```typescript
import QueryComposer from 'queryforge';

interface Casa {
  quartos: number;
  bairro: string;
  rua: string;
}

// Create an instance of QueryComposer with the desired type
const queryComposer = new QueryComposer<Casa>();

// Example: Generating a SELECT query
const selectQuery = queryComposer
  .startSelection('Casa')
  .Select('quartos', 'bairro', 'rua')
  .Where((item) => {
    return item.quartos > 2 && item.bairro === '1';
  })
  .toString();
console.log(selectQuery);
// Output: SELECT quartos, bairro, rua FROM Casa WHERE quartos > 2 AND bairro = '1';

// Example: Generating an INSERT query
const insertQuery = queryComposer
  .startInsertion('Casa')
  .Insert('bairro', 'Paulista')
  .Insert('quartos', 3)
  .toString();
console.log(insertQuery);
// Output: INSERT INTO Casa SET (bairro, quartos) VALUES ('Paulista',3);

// Other examples for UPDATE and DELETE queries are also available.
```

### API Documentation

#### `QueryComposer<T>`

The main class responsible for composing SQL queries. It accepts a type parameter `T` representing the schema of the table.

#### Methods:

- `startSelection(entity: string): ConstructorQuerySelectable<T>`: Initialize a SELECT query for the specified entity.
- `startUpdation(entity: string): ConstructorQueryUpdatable<T>`: Initialize an UPDATE query for the specified entity.
- `startDeletion(entity: string): ConstructorQueryDeletable<T>`: Initialize a DELETE query for the specified entity.
- `startInsertion(entity: string): ConstructorQueryInsertable<T>`: Initialize an INSERT query for the specified entity.

### License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Contributions

Contributions are welcome! If you find any issues or have suggestions, feel free to open an issue or create a pull request on [GitHub](https://github.com/felpereira/queryforge).

### Authors

- [cb.felipe](https://github.com/felpereira)

### Support

For any inquiries or support, please contact [cb.felipe@example.com](mailto:cb.felipe@example.com).

### Acknowledgements

Special thanks to the developers and contributors of TypeScript, Jest, and other dependencies used in this project.

### Version History

- 1.0.0 (YYYY-MM-DD): Initial release.

### Keywords

TypeScript, SQL, Query Builder, Dynamic Queries, Database, Jest

### Related Projects

- [Link to Related Project](https://github.com/felpereira/QueryForge)

Feel free to add any additional sections or modify the content according to your project's specific requirements.
