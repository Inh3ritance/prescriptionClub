import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("prescriptionClub", () => {
  it("Should mint and transfer an NFT to someone", async () => {
    const Prescription = await ethers.getContractFactory("PrescriptionClub");
    const prescription = await Prescription.deploy();
    await prescription.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // account 0
    const metadataURL = "cid/test.png";

    let balance = await prescription.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await prescription.payToMint(
      recipient,
      metadataURL,
      {
        value: ethers.utils.parseEther("0.01"),
      }
    );

    await newlyMintedToken.wait();

    balance = await prescription.balanceOf(recipient);
    expect(balance).to.equal(1);
    expect(await prescription.isContentOwened(metadataURL)).to.equal(true);
  });
});
