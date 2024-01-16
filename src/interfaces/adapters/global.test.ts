import { Global } from './global';

describe('Global', () => {
  it('deve retornar um objeto de erro corretamente', () => {
    const errorMessage = 'Algo deu errado';
    const statusCode = 404;

    const resultado = Global.error(errorMessage, statusCode);

    expect(resultado).toEqual({
      statusCode,
      status: 'error',
      message: errorMessage
    });
  });

  it('deve retornar um objeto de erro padrão se não houver mensagem de erro', () => {
    const resultado = Global.error(null);

    expect(resultado).toEqual({
      statusCode: 200,
      status: 'success',
      data: []
    });
  });

  it('deve retornar um objeto de sucesso corretamente', () => {
    const successData = { key: 'value' };

    const resultado = Global.success(successData);

    expect(resultado).toEqual({
      statusCode: 200,
      status: 'success',
      data: successData
    });
  });

  it('deve retornar um objeto de sucesso padrão se não houver dados de sucesso', () => {
    const resultado = Global.success(null);

    expect(resultado).toEqual({
      status: 'success',
      data: []
    });
  });

  it('deve converter corretamente para um objeto', () => {
    const testData = { key: 'value' };

    const resultado = Global.convertToObject(testData);

    expect(resultado).toEqual(testData);
  });

  it('deve retornar um objeto vazio ao converter dados nulos', () => {
    const resultado = Global.convertToObject(null);

    expect(resultado).toEqual({});
  });

  it('deve formatar corretamente a data ISO com fuso horário', () => {
    const date = new Date('2022-01-01T12:00:00Z');

    const resultado = Global.formatISOWithTimezone(date);

    expect(resultado).toMatch('2022-01-01T12:00:00.000+-3:00');
  });
});
