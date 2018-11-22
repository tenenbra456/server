var express  = require('express');
var app      = express();
var http     = require('http').Server(app);
var io       = require('socket.io')(http);

var shortid = require ('shortid');
var clients = []; //[] sgnifica varios dados;
var bolas = []; 

io.on('connection', function(socket){
	
	var currentUser;//guarda informações do player que fez login para devolver para ele mesmo
	var bola;
	socket.on('beep', function(){
		socket.emit('boop');
	});
	
	socket.on ('MAKEBOLA', function(newbola){
		{
			
			
			bola = { 
			name:shortid.generate(),
		position:newbola.position,
		rotation:newbola.rotation}
		bolas.push(bola);//adicionei a lista de clients (players online)
		console.log('Foi Adicionada '+ newbola.name+ ' no jogo!');
		socket.emit('MAKEBOLA_SUCESS', bola);
		for (var x = 0; x < bolas.length; x++){
		
		
		   if (bolas[x].name != bola){ 
		  if (bolas[x].name != bola.name){
			  socket.emit('SPAW_BOLA',{
				          name:bolas[x].name,
				          id:bolas[x].id,
						  position:bolas[x].position,

			         });
		
			
		   }
		   }
		
		}
		
		socket.broadcast.emit('SPAW_BOLA',bola);	
		
		}
	});
	
	
	
	
	
	socket.on('MOVEBOLA', function (data)
	
	
	{
     //console.log('A Bola N'+data.name+" Move to "+bolas[0].name);
	
		for (var o = 0; o < bolas.length; o++){
		
		if (bolas[o].name == data.name){
			if (bolas[o].position != data.position){
			bolas[o].position = data.position;
	  socket.broadcast.emit('UPDATE_MOVEBOLA', data);//envia para todos os outros clientes a nova posicao do cliente que chamou este socket UPDATE_MOVE' sera
      console.log('A Bola N'+data.name+" Move to "+bolas[o].position);

			}
		}

		}
			
		
		
	  
	
	});
	
	
	//funcao para atualizar a movimentacao do cliente que chamou este socket para os demais clientes do game
	socket.on('ROTATEBOLA', function (data)
	{
    
	  currentUser.rotation = data.rotation;
      socket.broadcast.emit('UPDATE_ROTATEBOLA', currentUser);//envia para todos os outros clientes a nova posicao do cliente que chamou este socket UPDATE_MOVE' sera
      console.log(currentUser.name+" Rotate to "+currentUser.rotation); // processada pela funcao onUserMove em todos os clientes exceto o cliente que chamou este socket
	 
	});
	
	
	
	
	
	
	
	
	
	//login do player
	socket.on('LOGIN', function(player){
		
		
		console.log ('[INFO] Player'+ player.name +' connected!');
		
		currentUser = { 
		name:player.name,
		id:shortid.generate(),
		position:player.position,
		rotation:player.rotation}
		clients.push(currentUser);//adicionei a lista de clients (players online)
		console.log('currentUser ' + currentUser.name);
        console.log('Total players: '+clients.length);	

        //da o comando onLoginSucess para o player logar
        socket.emit('LOGIN_SUCESS', currentUser);
		//verifica se não é o proprio client
		for (var i = 0; i < clients.length; i++){
		
		if (clients[i].id != currentUser.id){
			
			socket.emit('SPAW_PLAYER',{
				          name:clients[i].name,
				          id:clients[i].id,
						  position:clients[i].position,

			         });
					 
			console.log('O Jogador '+ clients[i].name+ ' está conectado!');
		}
			
			
		}
		
		
		
		
		
		socket.broadcast.emit('SPAW_PLAYER',currentUser);
		
		}

		
		
	);
	
	
		//funcao para atualizar a movimentacao do cliente que chamou este socket para os demais clientes do game
	socket.on('MOVE', function (data)
	{
		if (currentUser.position != data.position){
	  currentUser.position = data.position;
	  socket.broadcast.emit('UPDATE_MOVE', currentUser);//envia para todos os outros clientes a nova posicao do cliente que chamou este socket UPDATE_MOVE' sera
      console.log(currentUser.name+" Move to "+currentUser.position);
		}
	
	});
	
	
	//funcao para atualizar a movimentacao do cliente que chamou este socket para os demais clientes do game
	socket.on('ROTATE', function (data)
	{
      if (currentUser.rotation != data.rotation){
	  currentUser.rotation = data.rotation;
      socket.broadcast.emit('UPDATE_ROTATE', currentUser);//envia para todos os outros clientes a nova posicao do cliente que chamou este socket UPDATE_MOVE' sera
      console.log(currentUser.name+" Rotate to "+currentUser.rotation); // processada pela funcao onUserMove em todos os clientes exceto o cliente que chamou este socket
	  }
	});
	
	
	
	
	
	socket.on('disconnect', function ()
	{

		socket.broadcast.emit('USER_DISCONNECTED',currentUser);
		for (var i = 0; i < clients.length; i++)
		{
			if (clients[i].name == currentUser.name && clients[i].id == currentUser.id) 
			{

				console.log("User "+clients[i].name+" has disconnected");
				clients.splice(i,1);

			};
		};
	});
	
	
	
})
	
	 
	 http.listen(process.env.PORT ||3000, function(){
	console.log('listening on *:3000');
});


 console.log('------Servidor Iniciado-------');  