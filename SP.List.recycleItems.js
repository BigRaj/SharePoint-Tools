/*!
* Title: SP.List.recycleItems.js
* Created by Rajiv Gomer
* Released under the MIT license
* Date: 2018-03-09
* Tested using SharePoint 2013 On-Prem
* Parameters:  1.  Required: List View Name (string)
* Usage:       1.  SP.List.recycleItems('<List View Name>');
* Usage:       2.  new SP.ClientContext.get_context().get_web().get_lists().getByTitle('<List Name>').recycleItems('<List View Name>');
*/
;(function(){
    var recycleItems = function(listViewName){
        listViewName = listViewName || false;
        var successMessage = 'Item(s) Recycled',
            ctx = this.get_context(),
            list = this,
            items,
            views = this.get_views(),
            view,
			counter,
            noop = function(){},
            error = function(sender, args){
                var message = args.get_message() + '\n' + args.get_errorCode();
                console.error(message);
            },
            execute = function(payload,callback){
                payload = payload || null;
                callback = callback || noop;
                if(typeof(payload) === 'function'){
                    callback = payload;
                }
                if(payload !== null && callback !== payload){
                    ctx.load(payload);
                }
                ctx.executeQueryAsync(callback.bind(null,payload),error);
            },
            getView = function(){
                view = views.getByTitle(listViewName);
                execute(view,getItems);
            },
            getItems = function(){
                var camlQuery;
                if(!listViewName){
                    camlQuery = new SP.CamlQuery.createAllItemsQuery();
                }
                else{
                    camlQuery = new SP.CamlQuery();
                    camlQuery.set_viewXml(view.get_listViewXml());
                }
                items = list.getItems(camlQuery);
                execute(items,recycleItems);
            },
            success = function(sender, args){
                console.log(counter + ' ' + successMessage);
            },
            recycleItems = function(){
                var enumerator = items.getEnumerator();
                var recycleitems = [];
                while(enumerator.moveNext()){
                    var item = enumerator.get_current();
                    recycleitems.push(item);
                }
                for(var i = 0; i < recycleitems.length; i++){
                    recycleitems[i].recycle();
					counter = i+1;
                }
                execute(success);
            };
        if(!listViewName){
            console.error('Error: You must provide a View Name');
        }
        else{
            getView();
        }
    }
    if(_v_dictSod['sp.js'].state === Sods.loaded){
        window.SP.List.prototype.recycleItems = recycleItems;
    }
    else{
        RegisterSod("sp.res.resx", "/_layouts/15/ScriptResx.ashx");
        RegisterSod("sp.js", "/_layouts/15/sp.debug.js");
        RegisterSodDep("sp.js", "sp.res.resx");
        SP.SOD.executeFunc('sp.js',false,function(){
            window.SP.List.prototype.recycleItems = recycleItems;
        });
    }
}())