import { type ParametroBd } from './parametrobd';

describe('ParametroBd', () => {
  it('deve ter propriedades campo e valor', () => {
    const parametro: ParametroBd = {
      campo: 'nome',
      valor: 'João'
    };

    const possuiCampo = 'campo' in parametro;
    const possuiValor = 'valor' in parametro;

    expect(possuiCampo).toBeTruthy();
    expect(possuiValor).toBeTruthy();
  });
});
