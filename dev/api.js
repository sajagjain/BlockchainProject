const express=require('express');
const app=express();

const Blockchain=require("./blockchain");
const bitcoin=new Blockchain();

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const uuid=require("uuid/v1");
const minerAddr=uuid().split('-').join('');

const port=process.argv[2];

const rp=require('request-promise');


app.get("/",function(req,res){
	res.send("Blockchain API");
});

app.get("/info",function(req,res){
	res.send("Blockchain API for requesting blockchain function's");
});

app.get("/hello",function(req,res){
	res.send("Hello World");
});

app.get("/blockchain",function(req,res){
	res.send(bitcoin);
});

app.post("/transaction",function(){
	
	const index=bitcoin.createNewTransactions(req.body.amount
		,req.body.sender,req.body.reciever);

	res.json({note:`Transaction is added to block ${index}`});
});

app.get("/mine",function(req,res){

	const lastBlock=bitcoin.getLastBlock();
	const previousBlockHash=lastBlock['hash'];

	const currentBlockData={
		transactions:bitcoin.pendingTransactions,
		index:lastBlock['index']+1
	};

	const nonce=bitcoin.proofOfWork(previousBlockHash,currentBlockData);

	const blockHash=bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

	bitcoin.createNewTransaction(12.5,"00",minerAddr);

	const newBlock=bitcoin.createNewBlock(nonce,prevBlockHash,blockHash);

	res.json({
		note:"Block successfully added",
		block:newBlock
	});
});

app.post('/register-and-broadcast-node',function(req,res){
	
	const newNodeURL=req.body.newNodeURL;

	console.log("\n\n\n"+JSON.stringify(req.body));

	if(bitcoin.currentNodeURL!==newNodeURL && bitcoin.networkNodes.indexOf(newNodeURL)==-1){	
		bitcoin.networkNodes.push(newNodeURL);
	}

	const regNodePromises=[];

	bitcoin.networkNodes.forEach(networkNodeURL=>{
		//Adding request promise
		const requestOptions={
			uri:networkNodeURL+'/register-node',
			method:'POST',
			body:{ newNodeURL : newNodeURL },
			json:true
		};
		regNodePromises.push(rp(requestOptions));
	});
	
	Promise.all(regNodePromises)
	.then(data=>{
		const bulkRegisterOptions={
			uri:newNodeURL+'/register-nodes-bulk',
			method:'POST',
			body:{ allNetworkNodes: [...bitcoin.networkNodes,bitcoin.currentNodeURL]},
			json:true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data=>{
		res.json({note:"The new node is registered with the network"});
	});

});

app.post('/register-node',function(req,res){
	
	const newNodeURL=req.body.newNodeURL;
	if(newNodeURL!==bitcoin.currentNodeURL && bitcoin.networkNodes.indexOf(newNodeURL)==-1){
		bitcoin.networkNodes.push(newNodeURL);
	}

	res.json({note:'New Node registered with network'})
});

app.post('/register-nodes-bulk',function(req,res){

	const allNetworkNodes=req.body.allNetworkNodes;

	allNetworkNodes.forEach(networkNodeURL=>{
		if(networkNodeURL!==bitcoin.currentNodeURL && bitcoin.networkNodes.indexOf(networkNodeURL)==-1)
		bitcoin.networkNodes.push(networkNodeURL);
	});

	res.json({note:"Bulk Registration Succesfull"});
});

app.listen(port,function(){
	console.log(`Listening on port ${port}`);
});