var express=require("express");
app=express(),
servidor=require("http").createServer(app)
io=require("socket.io").listen(servidor);

servidor.listen(3000);

app.use(express.static(__dirname+"/"));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/index.html")
});

io.sockets.on("connection", function(socket){
  socket.on("create", function(data){
    io.sockets.emit("created",data);
  });

  socket.on("move", function(data){
    io.sockets.emit("moved",data);
  });

  socket.on("kill", function(data){
    io.sockets.emit("killed",data);
  });

  socket.on("playerkilled", function(data){
    io.sockets.emit("killedplayer",data);
  });

  socket.on("posicionar", function(data){
    io.sockets.emit("posicionado", data);
  });
});
