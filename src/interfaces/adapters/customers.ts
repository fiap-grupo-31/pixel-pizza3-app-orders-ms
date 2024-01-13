export const CustomerAdapter = {
  adaptObjectCustomer: function (data: any): any {
    if (data === null) {
      return {};
    }

    try {
      const dataConvert = JSON.parse(JSON.stringify(data));
      return dataConvert?.data ? dataConvert?.data : {};
    } catch (error) {
      return {};
    }
  }
};
