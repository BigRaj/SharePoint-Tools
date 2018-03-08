/*!
 * Created by Rajiv Gomer
 * Released under the MIT license
 * Date: 2018-07-11
 * Tested: SharePoint 2013 On-Prem
 * Usage: SP.Redirect("<Required string: URL>","<string: TEXT FOR LINK>", <int: Seconds>, <boolean: override>);
 */

;(function(){
	var pageRedirect = function(url,title,delay,override){
	title = title || url;
	override = override || false;
	var count = delay || 10,
		modaltitle = "Redirecting",
		modalbody = "<div> Redirecting to: <br><a href='" + url + "'>" + title + "</a></div><br>You will be redirected in: <div id='countdownTimer' style='cursor:pointer;'>" + count + "</div>",
		dialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(modaltitle,modalbody),
		timer = function(){
			if(--count < 0){
				clearInterval(counter);
				dialog.close();
				window.location.replace(url);
			}
			else{
				if(count > 60){
					counterDiv.innerText = Math.floor(count/60).toString() + ":" + (count%60 < 10 ? "0" + Math.floor(count%60).toString() : Math.floor(count%60).toString());
					}
				else{
					counterDiv.innerText = "0:" + (count < 10 ? "0" + count.toString() : count.toString());

				}
			}
		},
		counterDiv = document.getElementById('countdownTimer');
		if(override){
			counterDiv.style.cursor = "pointer";
			counterDiv.onclick = function(){ clearInterval(counter); dialog.close();}
		}
		else{
			counterDiv.style.cursor = "default";
		}
		var counter = setInterval(timer,1000);
	}
        
	if(_v_dictSod['sp.ui.dialog.js'].state === Sods.loaded){
		window.SP.Redirect = pageRedirect;	
	}
	else{
		RegisterSod("sp.res.resx", "/_layouts/15/ScriptResx.ashx");
		RegisterSod("sp.ui.dialog.js", "/_layouts/15/sp.ui.dialog.debug.js");
		RegisterSodDep("sp.ui.dialog.js", "sp.res.resx");
		RegisterSod("sp.js", "/_layouts/15/sp.debug.js");
		RegisterSodDep("sp.js", "sp.runtime.js");
		RegisterSodDep("sp.js", "sp.ui.dialog.js");
		RegisterSodDep("sp.js", "sp.res.resx");

		SP.SOD.executeFunc('sp.ui.dialog.js',false,function(){
			window.SP = window.SP || {}
			window.SP.Redirect = pageRedirect;
		});
	}
}());
