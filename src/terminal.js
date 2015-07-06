var term;
var getTermObj=window.parent.getTermObj;
$(function(){
 term=$("#terminal").terminal(function(command,term){
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
  /*
  onExit: function(terminal){
   alert(terminal);
  }
  */
 });
 term.disable();
});

function enableRBM(){
 term.clear();
 term.push(
  getTermObj(),{
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
