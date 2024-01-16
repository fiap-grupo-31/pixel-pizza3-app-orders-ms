import { GenerateQRCodeUseCase } from './GemerateQrcode';

// Mock para QRCodeGenerator
const qrCodeGeneratorMock = {
  generateQRCode: jest.fn(),
};

describe('GenerateQRCodeUseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar o código QR com sucesso', async () => {
    qrCodeGeneratorMock.generateQRCode.mockResolvedValueOnce('url-do-codigo-qr');

    const generateQRCodeUseCase = new GenerateQRCodeUseCase(qrCodeGeneratorMock);

    const result = await generateQRCodeUseCase.execute('dados-para-o-qr');

    expect(result).toEqual('url-do-codigo-qr');
    expect(qrCodeGeneratorMock.generateQRCode).toHaveBeenCalledWith('dados-para-o-qr');
  });

  it('deve tratar erro ao gerar o código QR', async () => {
    qrCodeGeneratorMock.generateQRCode.mockRejectedValueOnce(new Error('Erro ao gerar o código QR'));

    const generateQRCodeUseCase = new GenerateQRCodeUseCase(qrCodeGeneratorMock);

    await expect(generateQRCodeUseCase.execute('dados-para-o-qr')).rejects.toThrow('Failed to generate QR Code');

    expect(qrCodeGeneratorMock.generateQRCode).toHaveBeenCalledWith('dados-para-o-qr');
  });
});
