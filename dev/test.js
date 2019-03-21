const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

//Checking blockchain
console.log("Checking blockchain for the first time\n");
console.log(bitcoin);

//Creating new block
bitcoin.createNewBlock(2456,'gsdahgg3hg34h35g','33gh34gh34ghg43hg');

//After Adding block
console.log("\nAfter Adding Block");
console.log(bitcoin);

//Displaying last block
console.log("\nGetting Last Block");
console.log(bitcoin.getLastBlock());

//Testing create transaction method
console.log("\nAdding Transactions");
bitcoin.createNewBlock(23326,'gsdahggsfdsdsdf4h35g','33gh3dfsfsdsds4gh34ghg43hg');
bitcoin.createNewTransaction(100,'saddsasasadsa','adsdasdsadassa');

console.log("\nBefore adding transactions to new block");
console.log(bitcoin);
bitcoin.createNewBlock(34343443,'sddsasadsasdgg3hg34h35g','gffghfghse3h34ghg43hg');

console.log("\nAfter adding transactions to new block")
console.log(bitcoin.chain[2]);

//Testing Hash Function
const previousBlockHash='ABCDEFGH';
const currentBlockData=[
	{
		amount:10,
		sender:'sdsadsa43433',
		receiver:'syuwyeyw131'
	},
	{
		amount:230,
		sender:'sdsadsa43433',
		receiver:'syuwyeyw131'
	},
	{
		amount:45,
		sender:'sdsadsa43433',
		receiver:'syuwyeyw131'
	}
];
const nonce=100;

console.log("\nHash of a block");
console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce));

//Testing Proof Of Work
//Taking previousBlockHash and currentBlockData from previous test
console.log("\nNonce found from proof of work is : ");
console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));

//Testing Genesis Block
console.log("Blockchain with Genesis Block");
const blockchainWithGenesis=new Blockchain();
console.log(blockchainWithGenesis); 
