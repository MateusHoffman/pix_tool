import axios from "axios";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

export default class Gerencianet {
  async getToken() {
    try {
      const certificado = fs.readFileSync(`./${process.env.GN_CERTIFICADO}`);

      const credenciais = {
        client_id: process.env.GN_CLIENT_ID,
        client_secret: process.env.GN_CLIENT_SECRET,
      };

      const dataType = JSON.stringify({ grant_type: "client_credentials" });
      const dataCredenciais = `${credenciais.client_id}:${credenciais.client_secret}`;
      const auth = Buffer.from(dataCredenciais).toString("base64");

      const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
      });

      const config = {
        method: "POST",
        url: `${process.env.GN_API}/oauth/token`,
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-type": "application/json",
        },
        httpsAgent: agent,
        data: dataType,
      };

      const response = await axios(config);
      const data = response.data;
      // console.log("data: ", data);
      return data;
    } catch (error) {
      console.error("Error getToken", error);
    }
  }

  async getPixReceivedByTxid({ txId }) {
    try {
      const token = await this.getToken();

      const { token_type, access_token } = token;

      const certificado = fs.readFileSync(`./${process.env.GN_CERTIFICADO}`);

      const agent = new https.Agent({
        pfx: certificado,
        passphrase: "",
      });

      const query = new URLSearchParams({
        txId,
        inicio: moment.utc().startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]"),
        fim: moment
          .utc()
          .startOf("day")
          .add(48, "hours")
          .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      }).toString();

      const config = {
        method: "GET",
        url: `${process.env.GN_API}/v2/pix?${query}`,
        headers: {
          Authorization: `${token_type} ${access_token}`,
          "Content-type": "application/json",
        },
        httpsAgent: agent,
      };

      const response = await axios(config);
      const data = response.data;
      // console.log("data: ", data);
      return data;
    } catch (error) {
      console.error("Error getPixReceivedByTxid", error);
    }
  }
}
