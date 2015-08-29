var rpgIframe,terminalIframe,game;
var rpg,term;
var nowActive;
$(function(){
 rpgIframe=$("#rpg");
 terminalIframe=$("#terminal");
 terminalIframe.hide();
 rpgIframe[0].contentWindow.focus();
 nowActive="rpg";
 rpg=rpgIframe[0].contentWindow;
 term=terminalIframe[0].contentWindow;
 $(window).on('click',function(){
  if(nowActive=="rpg"){
   rpg.focus();
  }else if(nowActive=="term"){
   term.focus();
  }
  return false;
 });
 $("a").on('click',function(e){
  e.stopPropagation();
 });
 console.log(document.activeElement);
});

function toggleConnect(){
 var focusElem=document.activeElement;
 if(focusElem==rpgIframe[0]){
  terminalIframe.show();
  terminalIframe[0].contentWindow.focusWindow();
  nowActive="term";
 }else if(focusElem==terminalIframe[0]){
  terminalIframe.hide();
  rpgIframe[0].contentWindow.focus();
  rpgIframe[0].contentWindow.toggle_pause();
  nowActive="rpg";
 }else{
  console.log();
 }
}

function getTermObj(){
 return rpgIframe[0].contentWindow.termCommands();
}
