var rpgIframe,terminalIframe,game;
var rpg,term;
$(function(){
 rpgIframe=$("#rpg");
 terminalIframe=$("#terminal");
 terminalIframe.hide();
 rpgIframe[0].contentWindow.focus();
 rpg=rpgIframe[0].contentWindow;
 term=terminalIframe[0].contentWindow;
 $(window).on('click',function(){
  rpg.focus();
 });
});

function toggleConnect(){
 var focusElem=document.activeElement;
 if(focusElem==rpgIframe[0]){
  terminalIframe.show();
  terminalIframe[0].contentWindow.focusWindow();
 }else if(focusElem==terminalIframe[0]){
  terminalIframe.hide();
  rpgIframe[0].contentWindow.focus();
  rpgIframe[0].contentWindow.toggle_pause();
 }else{
  console.log();
 }
}

function getTermObj(){
 return rpgIframe[0].contentWindow.termCommands();
}
