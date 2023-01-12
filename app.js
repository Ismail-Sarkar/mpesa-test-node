const express = require("express");
const app = express();
const cors = require("cors");
const { default: axios } = require("axios");
app.use(express.json());

const getAccessToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic dmc5dzVxY0dKMEt4eG03VmQ3QVBCV25HS3pDQkNjZkc6eXRnbnZDUG12M2l5M3FPcA==`,
          },
        }
      );
      resolve(token.data.access_token);
    } catch (err) {
      reject(err);
    }
  });
};
// NOTE: CORS is only needed in this dev API server because it's
// running in a different port than the main app.
app.use(
  cors({
    origin: process.env.REACT_APP_CANONICAL_ROOT_URL,
    credentials: true,
  })
);

const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getAccessToken", async (req, res) => {
  try {
    const token = await getAccessToken();
    console.log("tok:" + token);
    res.send(token);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/qr", async (req, res) => {
  const token = await getAccessToken();
  axios
    .get(
      "https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate?TrxCode=BG&CPI=17408&RefNo=1&Amount=20000&queryTargetPath=http://localhost:3000",
      {
        TrxCode: "BG",
        CPI: "17408",
        RefNo: "rf38f04",
        MerchantName: "Ismail",
        Amount: "20000",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    .then((resp) => {
      res.status(200).send(resp.data);
      console.log(6968, resp.data);
    })
    .catch((err) => {
      res.status(500).send(err?.response?.data);
      console.log(1245, err, err.response.data.fault);
    });
  // res.send(err?.response?.data);
});

app.post("/qr", async (req, res) => {
  const token = await getAccessToken();
  axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate?TrxCode=BG&CPI=17408&RefNo=1&Amount=20000&queryTargetPath=http://localhost:3000",

      {
        MerchantName: "TEST SUPERMARKET",
        RefNo: "Invoice Test",
        Amount: 1,
        TrxCode: "BG",
        CPI: "373132",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    .then((resp) => {
      res.status(200).send(resp.data);
      console.log(6968, resp.data);
    })
    .catch((err) => {
      res.status(500).send(err?.response?.data);
      console.log(1245, err, err.response.data.fault);
    });
  // res.send(err?.response?.data);
});

app.post("/register", async (req, res) => {
  const token = await getAccessToken();
  console.log(9595, token);
  axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",

      {
        ShortCode: "60061",
        ResponseType: "Completed",
        ConfirmationURL: "http://test.com/success",
        ValidationURL: "http://test.com/validation",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    .then((resp) => {
      res.status(200).send(resp.data);
      console.log(6968, resp.data);
    })
    .catch((err) => {
      res.status(500).send({ ...err?.response?.data, tok: token });
      console.log(1245, err, err.response.data.fault);
    });
  // res.send(err?.response?.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
