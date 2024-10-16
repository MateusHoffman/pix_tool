import crc from "crc";
import QRCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";

// Para obter o diretório atual, necessário em módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Pix {
  constructor(nome, chavepix, valor, cidade, txtId, diretorio = "") {
    this.nome = nome;
    this.chavepix = chavepix;
    this.valor = valor.replace(",", ".");
    this.cidade = cidade;
    this.txtId = txtId;
    this.diretorioQrCode = diretorio;

    // Atributos de tamanho
    this.nome_tam = this.nome.length.toString().padStart(2, "0");
    this.chavepix_tam = this.chavepix.length.toString().padStart(2, "0");
    this.valor_tam = this.valor.length.toString().padStart(2, "0");
    this.cidade_tam = this.cidade.length.toString().padStart(2, "0");
    this.txtId_tam = this.txtId.length.toString().padStart(2, "0");
  }

  // Função para criar o código PIX
  createCodePix() {
    this.merchantAccount_tam = `0014BR.GOV.BCB.PIX01${this.chavepix_tam}${this.chavepix}`;
    this.transactionAmount_tam = `${this.valor_tam}${parseFloat(
      this.valor
    ).toFixed(2)}`;
    this.addDataField_tam = `05${this.txtId_tam}${this.txtId}`;

    this.payloadFormat = "000201";
    this.merchantAccount = `26${this.merchantAccount_tam.length
      .toString()
      .padStart(2, "0")}${this.merchantAccount_tam}`;
    this.merchantCategCode = "52040000";
    this.transactionCurrency = "5303986";
    this.transactionAmount = `54${this.transactionAmount_tam}`;
    this.countryCode = "5802BR";
    this.merchantName = `59${this.nome_tam}${this.nome}`;
    this.merchantCity = `60${this.cidade_tam}${this.cidade}`;
    this.addDataField = `62${this.addDataField_tam.length
      .toString()
      .padStart(2, "0")}${this.addDataField_tam}`;
    this.crc16 = "6304";

    // Gerar payload completo
    this.payload = `${this.payloadFormat}${this.merchantAccount}${this.merchantCategCode}${this.transactionCurrency}${this.transactionAmount}${this.countryCode}${this.merchantName}${this.merchantCity}${this.addDataField}${this.crc16}`;

    // Calcular o CRC16 e adicionar ao payload
    const crc16 = crc
      .crc16ccitt(Buffer.from(this.payload, "utf-8"))
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");

    this.payload_completa = `${this.payload}${crc16}`;
    return this.payload_completa; // Retorna o payload completo
  }

  // Função para criar o QR Code
  async createQrCode(diretorio, index) {
    try {
      const dir = path.resolve(__dirname, diretorio);
      await QRCode.toFile(
        path.join(dir, index + ".png"),
        this.payload_completa
      );
      console.log("QR Code gerado com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  }
}

// // Exemplo de uso
// const pix = new Pix(
//   "PIX",
//   "024cc8b4-c919-4e47-8ab8-f9553c54bafb",
//   "0.02",
//   "cidade",
//   "test"
// );

// // Gerar o código PIX
// const codePix = pix.createCodePix();
// console.log("Código pix:", codePix);

// // Gerar o QR Code
// await pix.createQrCode("./"); // Coloque o diretório desejado aqui
