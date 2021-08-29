// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require("SupplyChain");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("SupplyChain", (accounts) => {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  var sku = 1;
  var upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = "John Doe";
  const originFarmInformation = "Yarray Valley";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  var productID = sku + upc;
  const productNotes = "Best beans for Espresso";
  const productPrice = web3.utils.toWei("1", "ether");
  var itemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = "0x00000000000000000000000000000000000000";


  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  let supplyChain;

  beforeEach(async () => {
    supplyChain = await SupplyChain.deployed()
  })

  describe('Farmer', async() => {
    let result
    it('add a farmer', async() => {
      result = await supplyChain.addFarmer(originFarmerID);
      const log = result.logs[0]
      const event = log.args
      // console.log(event.account)
      event.account.toString().should.equal(originFarmerID, 'Farmer is correct')
    });

  });

  describe('Harvesting', async() => {
    let result
    it('harvest an item', async() => {
      result = await supplyChain.harvestItem(
        upc,
        originFarmerID,
        originFarmName,
        originFarmInformation,
        originFarmLatitude,
        originFarmLongitude,
        productNotes
      );
      const log = result.logs[0]
      const event = log.args
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        originFarmerID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(
        resultBufferOne[3],
        originFarmerID,
        "Error: Missing or Invalid originFarmerID"
      );
      assert.equal(
        resultBufferOne[4],
        originFarmName,
        "Error: Missing or Invalid originFarmName"
      );
      assert.equal(
        resultBufferOne[5],
        originFarmInformation,
        "Error: Missing or Invalid originFarmInformation"
      );
      assert.equal(
        resultBufferOne[6],
        originFarmLatitude,
        "Error: Missing or Invalid originFarmLatitude"
      );
      assert.equal(
        resultBufferOne[7],
        originFarmLongitude,
        "Error: Missing or Invalid originFarmLongitude"
      );
      assert.equal(resultBufferTwo[5], itemState, "Error: Invalid item State");
      assert.equal(event[0].length, 1, "Invalid event emitted");
      
    });
  });

  describe('Process', async() => {
    let result
    it('process an item', async() => {
      result = await supplyChain.processItem(upc);
      const log = result.logs[0]
      const event = log.args
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(resultBufferTwo[5], 1, "Error: Invalid item State");
      assert.equal(event[0].length, 1, "Invalid event emitted");
    });
  });

  describe('Pack', async() => {
    let result
    it('pack an item', async() => {
      result = await supplyChain.packItem(upc);
      const log = result.logs[0]
      const event = log.event.toString()

      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(resultBufferTwo[5], 2, "Error: Invalid item State");
      assert.equal(event, "Packed", "Invalid event emitted");
    });
  });

  describe('Sell', async() => {
    let result
    it('sell an item', async() => {
      result = await supplyChain.sellItem(upc, productPrice);
      const log = result.logs[0]
      const event = log.event.toString()
      // console.log(event)
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(resultBufferTwo[4], productPrice, "Error: Invalid item price");
      assert.equal(resultBufferTwo[5], 3, "Error: Invalid item State");
      assert.equal(event, 'ForSale', "Invalid event emitted");
    });
  });


  describe('Buy', async() => {
    let result

    beforeEach(async () => {
      await supplyChain.addDistributor(distributorID);
    });

    it('buy an item', async() => {
      result = await supplyChain.buyItem(upc, {
            value: productPrice,
            from: distributorID,
          });
      const log = result.logs[0]
      const event = log.event.toString()
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      // Verify the result set
      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        distributorID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(resultBufferTwo[5], 4, "Error: Invalid item State");
      assert.equal(
        resultBufferTwo[6],
        distributorID,
        "Error: Missing or Invalid distributorID"
      );
      assert.equal(event, 'Sold', "Invalid event emitted");
    });
  });

  describe('Ship', async() => {
    let result
    it('ship an item', async() => {
      result = await supplyChain.shipItem(upc);
      const log = result.logs[0]
      const event = log.event.toString()
      // console.log(event)
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(resultBufferTwo[5], 5, "Error: Invalid item State");
      assert.equal(event, 'Shipped', "Invalid event emitted");
    });
  });

  describe('Receive', async() => {
    let result

    beforeEach(async () => {
      await supplyChain.addRetailer(retailerID);
    });

    it('receive an item', async() => {
      result = await supplyChain.receiveItem(upc, { from: retailerID });
      const log = result.logs[0]
      const event = log.event.toString()
      // console.log(event)
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        retailerID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(resultBufferTwo[5], 6, "Error: Invalid item State");
      assert.equal(
        resultBufferTwo[7],
        retailerID,
        "Error: Missing or Invalid retailerID"
      );
      assert.equal(event, 'Received', "Invalid event emitted");
    });
  });


  describe('Purchase', async() => {
    let result

    beforeEach(async () => {
      await supplyChain.addConsumer(consumerID);
    });

    it('purchase an item', async() => {
      result = await supplyChain.purchaseItem(upc, { from: consumerID });
      const log = result.logs[0]
      const event = log.event.toString()
      // console.log(event)
      const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        consumerID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(resultBufferTwo[5], 7, "Error: Invalid item State");
      assert.equal(
        resultBufferTwo[8],
        consumerID,
        "Error: Missing or Invalid consumerID"
      );
      assert.equal(event, 'Purchased', "Invalid event emitted");
    });
  });

  describe('Fetch Item', async() => {
    let resultBufferOne
    let resultBufferTwo

    it('fetchItemBufferOne', async() => {
      resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
      
      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        consumerID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(
        resultBufferOne[3],
        originFarmerID,
        "Error: Missing or Invalid originFarmerID"
      );
      assert.equal(
        resultBufferOne[4],
        originFarmName,
        "Error: Missing or Invalid originFarmName"
      );
      assert.equal(
        resultBufferOne[5],
        originFarmInformation,
        "Error: Missing or Invalid originFarmInformation"
      );
      assert.equal(
        resultBufferOne[6],
        originFarmLatitude,
        "Error: Missing or Invalid originFarmLatitude"
      );
      assert.equal(
        resultBufferOne[7],
        originFarmLongitude,
        "Error: Missing or Invalid originFarmLongitude"
      );
    });

    it('fetchItemBufferTwo', async() => {
      resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);
       // Verify the result set:
      assert.equal(resultBufferTwo[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferTwo[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferTwo[2],
        productID,
        "Error: Missing or Invalid productID"
      );
      assert.equal(
        resultBufferTwo[3],
        productNotes,
        "Error: Missing or Invalid productNotes"
      );
      assert.equal(
        resultBufferTwo[4],
        productPrice,
        "Error: Missing or Invalid productPrice"
      );
      assert.equal(resultBufferTwo[5], 7, "Error: Missing or Invalid itemState");
      assert.equal(
        resultBufferTwo[6],
        distributorID,
        "Error: Missing or Invalid distributorID"
      );
      assert.equal(
        resultBufferTwo[7],
        retailerID,
        "Error: Missing or Invalid retailerID"
      );
      assert.equal(
        resultBufferTwo[8],
        consumerID,
        "Error: Missing or Invalid consumerID"
      ); 
      
    });
  });

});
  
