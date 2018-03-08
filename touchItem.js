/*
 * Created by Rajiv Gomer
 * Released under the MIT license
 * Date: 2018-03-07
 * Tested using SharePoint 2013 On-Prem
 */
var listTitle = '<ListName>', // NAME OF LIST HERE 
    ctx = new SP.ClientContext.get_current(), 
    list = ctx.get_web().get_lists().getByTitle(listTitle), 
    camlQuery = SP.CamlQuery.createAllItemsQuery(), 
    items = list.getItems(camlQuery);  
ctx.load(items); 
ctx.executeQueryAsync(
	function(){   //items retrieved
    	var enumerator = items.getEnumerator();
    	while(enumerator.moveNext())
    	{
      		var item = enumerator.get_current();
      		item.update();
      		ctx.executeQueryAsync(
        		function(){
          			// need to add more identifying information here
          			console.log('succeeded');
        		},
        		function(){
	          		console.error('failed'); 
    	    	}
      		);
    	}
  	},
  	function(){
    	console.error('failed to getitems');
  	}
);
