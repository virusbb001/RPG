var term;
var rpg;
$(function(){
 term=$("#terminal").terminal(function(command,term){
  // デバッグ用
  if(command.length>0){
   term.echo("あなたは'"+command+"'とタイプした");
  }
  if(command == "connect"){
   window.parent.toggleConnect();
  }
  if(command == "exit"){
   term.echo("YOU CANNOT ");
  }
 },{
  greetings: "Rogue Bot Manager\n<fn> + <Up>と<fn> + <Down> でスクロール",
  prompt: '> ',
  enabled: true,
  checkArity: false
 });
 term.disable();
});

function enableRBM(){
 if(!rpg){
  rpg=window.parent.rpg;
 }
 var availableCmd=rpg.getTermCommands();
 term.clear();
 term.echo("Rogue Bot Manager\n<fn> + <Up>と<fn> + <Down> でスクロール");
 term.push(
  function(command,term){
   var cmd=$.terminal.splitCommand(command);
   console.log(cmd);
   if(availableCmd[cmd.name]){
    availableCmd[cmd.name].apply(term,cmd.args);
   }else{
    term.echo("[[b;red;]コマンドが見つからない]");
   }
  },{
  name: "RBM",
  prompt: "RBM> ",
  onExit: function(terminal){
   window.parent.toggleConnect()
  }
 });
}

function focusWindow(){
 window.focus();
 $("#terminal").css({height: $(document).height()});
 term.enable();
 enableRBM();
}
