import { customAlphabet } from "nanoid";

import Gerencianet from "./gerencianet.js";
import Pix from "./Pix.js";

const gerarPix = async () => {
  const geradorTxid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    25
  );
  const txId = geradorTxid();
  console.log('txId: ', txId);

  const pix = new Pix(
    "pix",
    "6441c74e-4bbe-450b-b5be-0f665e97fc69",
    "30.25",
    "cidade",
    txId,
  );

  // // Gerar o código PIX
  const codePix = pix.createCodePix();
  console.log("Código pix:", codePix);

  // Gerar o QR Code
  await pix.createQrCode("./", 'qrcode'); // Coloque o diretório desejado aqui
};

const consultarPix = async () => {
  const gerencianet = new Gerencianet();
  const result = await gerencianet.getPixReceivedByTxid({ txId: "2l9x2oscQshXB8mwy2AOzkqft" });
  console.log("result: ", result);
};

(async () => {
  gerarPix();
  // consultarPix();
})();
