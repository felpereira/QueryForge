import QueryComposer from '../src/index';
interface Casa {
  quartos: number;
  bairro: string;
  rua: string;
}

describe('QueryComposer', () => {
  let queryComposer: QueryComposer<Casa>;

  beforeEach(() => {
    queryComposer = new QueryComposer<Casa>();
  });

  it('deve gerar uma consulta SELECT corretamente', () => {
    const query = queryComposer
      .startSelection('Casa')
      .Select('quartos', 'bairro', 'rua')
      .Where((item) => {
        return item.quartos > 2 && item.bairro === '1';
      })
      .toString();

    expect(query).toEqual(
      "SELECT quartos, bairro, rua FROM Casa WHERE quartos > 2 AND bairro = '1';"
    );
  });

  it('deve gerar uma consulta SELECT corretamente Sem Where', () => {
    const query = queryComposer
      .startSelection('Casa')
      .Select('quartos', 'bairro', 'rua')
      .toString();

    expect(query).toEqual('SELECT quartos, bairro, rua FROM Casa;');
  });

  it('deve gerar uma consulta UPDATE corretamente', () => {
    const query = queryComposer
      .startUpdation('Casa')
      .Update('bairro', 'Verde')
      .Update('bairro', 'paulista')
      .Where((item) => {
        return item.quartos > 2 && item.bairro === '1';
      })
      .toString();

    expect(query).toEqual(
      "UPDATE Casa SET bairro = 'Verde', bairro = 'paulista' WHERE quartos > 2 AND bairro = '1';"
    );
  });

  it('deve gerar uma consulta UPDATE corretamente Sem where', () => {
    const query = queryComposer
      .startUpdation('Casa')
      .Update('bairro', 'Verde')
      .Update('quartos', 3)
      .toString();

    expect(query).toEqual("UPDATE Casa SET bairro = 'Verde', quartos = 3;");
  });

  it('deve gerar uma consulta DELETE corretamente', () => {
    const query = queryComposer
      .startDeletion('Casa')
      .Where((item) => {
        return item.quartos > 2 && item.bairro === '1';
      })
      .toString();

    expect(query).toEqual(
      "DELETE FROM Casa WHERE quartos > 2 AND bairro = '1';"
    );
  });

  it('deve gerar uma consulta DELETE corretamente Sem where', () => {
    const query = queryComposer.startDeletion('Casa').toString();

    expect(query).toEqual('DELETE FROM Casa;');
  });

  it('deve gerar uma consulta INSERT corretamente', () => {
    const query = queryComposer
      .startInsertion('Casa')
      .Insert('bairro', 'Paulista')
      .Insert('quartos', 3)
      .toString();

    expect(query).toEqual(
      "INSERT INTO Casa SET (bairro, quartos) VALUES ('Paulista',3);"
    );
  });
});
