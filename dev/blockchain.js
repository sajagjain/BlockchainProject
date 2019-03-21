//This file defines the new blockchain data structure

///Imports
const sha256=require('sha256');

const currentNodeURL=process.argv[3];
//Main constructor function
function Blockchain(){
	this.chain=[];
	this.pendingTransactions=[];

	this.currentNodeURL=currentNodeURL;
	this.networkNodes=[];

	//Creating Genesis Block
	this.createNewBlock(100,'0','0');
}

// Adding create new block method to create new blocks and add to the chain
Blockchain.prototype.createNewBlock=function(nonce,previousBlockHash,hash){
	
	//new block structure
	const newBlock={
		index:this.chain.length+1,
		timestamp:Date.now(),
		transactions:this.pendingTransactions,
		nonce:nonce,
		hash:hash,
		previousBlockHash:previousBlockHash
	};

	//emptying the pending transcations after adding transactions to the chain
	this.pendingTransactions=[];

	//pushing the block to the chain
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock=function(){
	return this.chain[this.chain.length-1];
}

Blockchain.prototype.createNewTransaction=function(amount,sender,reciever){
	
	const newTransaction={
		amount:amount,
		sender:sender,
		reciever:reciever
	}

	this.pendingTransactions.push(newTransaction);

	return this.getLastBlock()['index']+1;
}

Blockchain.prototype.hashBlock=function(previousBlockHash,currentBlockData,nonce){
	
	const dataAsString = previousBlockHash+nonce.toString()
	+JSON.stringify(currentBlockData);

	const hash=sha256(dataAsString);

	return hash;
}

Blockchain.prototype.proofOfWork=function(previousBlockHash,currentBlockData){
	let nonce=0;
	let hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);

	while(hash.substring(0,4)!=='0000'){
		nonce++;
		hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);
	}

	return nonce;
}


// Exporting the Blockchain constructor function
module.exports=Blockchain;