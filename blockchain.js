const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [];
  }

  createBlock(data, prevHash = '0') {
    const index = this.chain.length + 1;
    const timestamp = new Date().toISOString();

    const hash = crypto.createHash('sha256')
      .update(JSON.stringify({
        productId: data.productId,
        stage: data.stage,
        data: data.data
      }) + prevHash)
      .digest('hex');

    const block = {
      index,
      productId: data.productId,
      stage: data.stage,
      data: data.data,
      timestamp,
      previousHash: prevHash,
      hash
    };

    this.chain.push(block);
    return block;
  }

  addBlock(data) {
    const prevHash = this.chain.length
      ? this.chain[this.chain.length - 1].hash
      : '0';

    return this.createBlock(data, prevHash);
  }

  // ✅ (OPTIONAL) create new stage block
  updateBlock(productId, status, stage, extraData = {}) {
    const prevHash = this.chain.length
      ? this.chain[this.chain.length - 1].hash
      : '0';

    const newData = {
      productId,
      stage,
      data: {
        ...extraData,
        status
      }
    };

    return this.createBlock(newData, prevHash);
  }

  // ✅ VERY IMPORTANT (YOU WERE MISSING THIS)
  getProductChain(productId) {
    return this.chain.filter(b => b.productId == productId);
  }
}

module.exports = Blockchain;