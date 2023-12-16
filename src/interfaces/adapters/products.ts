import { type Products } from 'src/domain/entities';

export const ProductsAdapter = {
  adaptJsonProducts: function (dados: Products[] | null): string {
    if (dados === null) {
      return JSON.stringify({});
    }
    const alldata = dados.map(function (item) {
      return { name: item.name, id: item.id };
    });
    return JSON.stringify(alldata);
  }
};
