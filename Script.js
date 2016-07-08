$(document).on("ready", function(){

  var socket = io.connect();
  var txtMen = $("#txtPlayer");
  var color = $("#color");
  var killed;
  var listaj = $('#listaj');

  setInterval(ordenar,1000);
  function ordenar(){


    listaj.find(".test").sort(function (a,b){
      return +a.dataset.percentage - +b.dataset.percentage;
    }).appendTo(listaj);

    [].reverse.call($('#listaj li')).appendTo('#listaj');
  }

  $("#btn").on("click", function(){
    $("#quadro").slideUp();
  });

  $("#mapa").on("click", function(){
    for(var i=1; i<100; i++){
      var c = Math.floor(Math.random() * 5) +1;
      var col;

      if(c==1){
        col="#f220e6";
      }
      if(c==2){
        col="#a4f21e";
      }
      if(c==3){
        col="#2096f3";
      }
      if(c==4){
        col="#fbe100";
      }

      var posBol={
        left:Math.floor(Math.random() * 2000) + 1,
        top:Math.floor(Math.random() * 900) + 1,
        color:col
      }

      var ball = "<div id='ball"+i+"' class='ball' type='ball' name='ball' style='background-color:"+posBol.color+";left:"+posBol.left+"px;top:"+posBol.top+"px;'>"+i+"</div>";

      socket.emit("posicionar",ball);
    }
  });

  socket.on("posicionado",function(data){
    $("#plataforma").append(data);
    $("#plataforma div").on("mousemove", make);
  });

  function make(){
    killed = $(this);
    var div1 = $("#"+$(txtMen).val());

    var x1 = div1.offset().left;
    var y1 = div1.offset().top;
    var h1 = div1.outerHeight(true);
    var w1 = div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = $(this).offset().left;
    var y2 = $(this).offset().top;
    var h2 = $(this).outerHeight(true);
    var w2 = $(this).outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if( b1 < y2 || b1 > b2 || r1 < x2 || x1 > r2){ return false};
    $("#"+$(txtMen).val()).css("height","+=1");
    $("#"+$(txtMen).val()).css("width","+=1");
    $(killed).remove();

    var obj={
      killer:$(killed).text(),
      sum:"#"+$(txtMen).val()+"-",
      name:$(txtMen).val()
    }
    socket.emit("kill", obj);
  }

  socket.on("killed", function(data){
    var c = parseInt($(data.sum).text());
    c += 1;
    $(data.sum).text(c);
    $(data.sum).attr("data-percent",c);
    $(data.sum).append("<span> - "+data.name+"</span>");
    $("#ball"+data.kill).remove();
  });

  $("#btn").on("click", function(){
    var playerColor=$("#color").val();
    var playerBorder;

    if(playerColor=="#f44336"){
      playerBorder="#d21305";
    }
    if(playerColor=="#a4f21e"){
      playerBorder="#7fc407";
    }
    if(playerColor=="#2196f3"){
      playerBorder="#0173a8";
    }

    var objPlayer={
      id: $(txtMen).val(),
      color: $(color).val(),
      border: playerBorder
    }

    var obj={
      playerPrincipal:"<div id='"+objPlayer.id+"' class='player' type='player' name='player' style='background-color:"+objPlayer.color+";border:5px solid "+objPlayer.border+"'>"+objPlayer.id+"</div>",
      list:"<li id='"+objPlayer.id+"-' class='test' data-percentage='0'>0</li>"
    }

    socket.emit("create", obj);

  });

  socket.on("created", function(data){
    $("body").append(data.playerPrincipal);
    $("#listaj").append(data.list);
  });

  $("body").on("mousemove",function(event){
    var myPlayer={
      player:$(txtMen).val(),
      x:event.pageX,
      y:event.pageY,
      h:parseInt($("#"+$(txtMen).val()).css("height")),
      w:parseInt($("#"+$(txtMen).val()).css("width"))
    }

    $("#"+$(txtMen).val()).css("left",event.pageX);
    $("#"+$(txtMen).val()).css("top",event.pageY);

    socket.emit("move",myPlayer);
  });

  socket.on("moved",function(data){
    var move={
      left:data.x,
      top:data.y,
      height:data.h,
      width:data.w
    }
    $("#"+data.player).css(move);

    $("body .player").on("mousemove", stop);

    function stop(){
      var the_killed;
      var enemi=(this);

      var typee=emeni.attr("type");
      var namee=emeni.attr("name");
      var anchoe=parseInt(enemi.css("width"));
      var altoe=parseInt(enemi.css("height"));

      var player=$("#"+$(txtMen).val());
      var typej=player.attr("type");
      var namej=player.attr("name");
      var anchoj=parseInt(enemi.css("width"));
      var altoj=parseInt(enemi.css("height"));

      if(typee=="player" && namee!==player.text()){
        if(anchoe < anchoj && altoe < altoJ){
          the_killed=enemi;
        }else{
          the_killed=player;
        }

        $(the_killed).remove();
        socket.emit("playerkilled",$(the_killed).text());
      }
    }

    socket.on("killedplayer",function(data){
      $("#"+data).remove();
    });
  });


});
