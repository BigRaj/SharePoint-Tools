/*!
 * Created by Rajiv Gomer
 * Released under the MIT license
 * Date: 2018-03-08
 * Tested using SharePoint 2013 On-Prem
 * Parameters:  1.  None
 *              2.  List View Name (string)
 * Usage:       1.  SP.List.touchItems();
 *              2.  SP.List.touchItems('<List View Name>');
 */

;(function(){
    var touchItems = function(listViewName){
        listViewName = listViewName || false;
        var ctx = this.get_context(),
            list = this,
            items,
            views = this.get_views(),
            view,
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
                execute(items,touch);
            },
            success = function(sender, args){
                var message = "Operation Successful";
                console.log(message);
            },
            touch = function(){
                var enumerator = items.getEnumerator();
                while(enumerator.moveNext()){
                    var item = enumerator.get_current();
                    item.update();
                    execute(success);
                }
            };
        if(!listViewName){
            getItems();
        }
        else{
            getView();
        }
    }
        
    if(_v_dictSod['sp.js'].state === Sods.loaded){
        window.SP.List.prototype.touchItems = touchItems;
    }
    else{
        RegisterSod("sp.res.resx", "/_layouts/15/ScriptResx.ashx");
        RegisterSod("sp.js", "/_layouts/15/sp.js");
        RegisterSodDep("sp.js", "sp.res.resx");

        SP.SOD.executeFunc('sp.js',false,function(){
            window.SP.List.prototype.touchItems = touchItems;
        });
    }
}())
