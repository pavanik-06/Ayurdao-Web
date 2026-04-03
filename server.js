const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const Blockchain = require('./blockchain');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

const blockchain = new Blockchain();


// ✅ ADD PRODUCT (Farmer → creates FIRST block)
app.post('/addProduct', async (req, res) => {
  const { name, location, date, qty, farmer } = req.body;

  const productId = Date.now(); // unique ID

  const data = {
    productId,
    stage: "Farmer",
    data: {
      name,
      location,
      date,
      qty,
      farmer,
      status: "Harvested"
    }
  };

  const block = blockchain.addBlock(data);

  // ✅ QR should open track page with productId
  const qrData = `http://localhost:3000/track.html?productId=${productId}`;
  const qrCode = await QRCode.toDataURL(qrData);

  res.json({
    message: 'Product added successfully!',
    productId,
    qrCode,
    block
  });
});


// ✅ UPDATE PRODUCT (Manufacturer → creates NEW block)
app.post('/updateProduct', (req, res) => {
  const { productId, status, manufacturer } = req.body;

  if (!productId) {
    return res.json({ message: 'Product ID missing!' });
  }

  const data = {
    productId: parseInt(productId),
    stage: "Manufacturer",
    data: {
      manufacturer,
      status
    }
  };

  const block = blockchain.addBlock(data);

  res.json({
    message: 'Manufacturer block added successfully!',
    block
  });
});


// ✅ GET PRODUCT FULL CHAIN (Consumer)
app.get('/getProduct/:productId', (req, res) => {
  const productId = req.params.productId;

  const chain = blockchain.getProductChain(productId);

  if (chain && chain.length > 0) {
    res.json({ chain });
  } else {
    res.json({ message: 'Product not found!' });
  }
});


// ✅ GET ALL BLOCKS (optional)
app.get('/getAllProducts', (req, res) => {
  res.json({ products: blockchain.chain });
});


// ✅ START SERVER
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});