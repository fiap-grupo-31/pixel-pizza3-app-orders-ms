import { QRCodeGeneratorAdapter } from './qrcode';

describe('QRCodeGeneratorAdapter', () => {
  describe('generateQRCode', () => {
    it('deve gerar um código QR válido para os dados fornecidos', async () => {
      const qrData = 'Teste de dados QR';

      const qrCodeGeneratorAdapter = new QRCodeGeneratorAdapter();

      const qrCodeUrl = await qrCodeGeneratorAdapter.generateQRCode(qrData);

      expect(qrCodeUrl).toBeTruthy();

      expect(qrCodeUrl).toContain('data:image/png;base64,');
    });
  });
});
