
RequestCache = new Hashtable();
function Cart() {
	this.groups = new Hashtable();
	//this.RequestCache = new Hashtable();
	
	/* 
	 * group:
	 * group[i]: -> items[1...n] Array of items
	 * group.group_price: Price of group purchase determined by the SERVER
	 *
	 * item:
	 * item.item_price: Set by the server by getRequest
	 * item.item_id: Set by the server, corresponds to the databases item entry
	 */
}

/**
 * In the shopping cart: add an item to a group, potentially creating a new group
 * @param groupId group a purchase
 * @param itemData Database entry sent from the server as JSON and parsed into an item object
 */
Cart.prototype.addItem = function (groupId, itemData) {
	var group = this.groups.get(groupId);
	
	if (group == null) {
		//alert("Adding new group because ["+groupId+"] is undefined");
		this.groups.put(groupId, []);
		group = this.groups.get(groupId);
	}

	group.push({ item: itemData});
}

Cart.prototype.addItems = function (groupId, itemData) {
	var cart = this;
	if (typeOf(itemData) != 'array') {
		alert("Usage Error: itemData is not of type array");
		return;
	}
	$.each(itemData, function(i, item) {
			cart.addItem(groupId, item);
	});
}

Cart.prototype.removeGroup = function (groupId) {
	var cart = this;
	var groups = cart.groups.get(groupId);
	
	groups.splice(groupId, 1);
}

/**
 * 
 * Returns 	true if found an item to pop
 *			false otherwise
 */
Cart.prototype.popItem = function (groupId, itemId) {
	var cart = this;
	var group = this.groups.get(groupId);
	if (group == null) {
		return false;
	}
	for (var i=0; i < group.length; ++i) {
		var box = group[i];
		var item = box.item;
		if (item['item_id'] == itemId) {
			group.splice(i, 1);		
			return true;
		}
	}
	return false;
}

Cart.prototype.popAllItems = function (groupId, itemId) {
	var cart = this;
	while (cart.popItem(groupId, itemId) == true);
}

Cart.prototype.getItemIds = function (groupId) {
	var cart = this;
	var group = cart.groups.get(groupId);
	var items = [];
	
	$.each(group, function(i, box) {
		var item = box.item;
		items.push(item['id']);
	});
	return items;
}

/**
 * Returns array of prices for the requested group
 */
Cart.prototype.getItemPrices = function (groupId) {
	var cart = this;
	var group = cart.groups.get(groupId);
	var prices = [];
	
	$.each(group, function(i, box) {
		var item = box.item;
		prices.push(item['item_price']);
	});
	return prices;
}

Cart.prototype.getGroupPrice = function (groupId) {
	var cart = this;
	var group = cart.groups.get(groupId);
	var price = 0.0;
	
	return group['group_price'];
}

Cart.prototype.setGroupPrice = function(groupId, price) {
	var cart = this;
	var group = cart.groups.get(groupId);

	group['group_price'] = price;
}

/**
 * Returns array of stored items { id, price, data }
 */
Cart.prototype.getItems = function (groupId) {
	var cart = this;
	var group = cart.groups.get(groupId);
	var items = [];
	
	$.each(group, function(i, box) {
		var item = box.item;
		items.push(item);
	});
	return items;
}

/**
 * Return array of group keys
 */
Cart.prototype.getGroups = function () {
	var cart = this;
	var groups = [];
	
	$.each(cart.groups.keys(), function(i, group) {
		groups.push(group);
	});
	return groups;
}

Cart.prototype.getGroupCount = function() {
	var cart = this;
	return cart.groups.size();
}

Cart.prototype.debugCart2String = function () {
	var itemsStr = "";
	var cart = this;
	$.each(cart.groups.values(), function(i, group) {
		$.each(group, function(j, box) {
			var item = box.item;
			itemsStr += "{" + item['item_id'] +","+ item['item_price'] + "}\n";
		});
	});
	//alert("Items: ["+itemsStr+"]");
	return itemsStr;
}

/*************************************************************
 * COMMUNICATION
 *************************************************************/

Cart.prototype.calcGroupPrice = function(groupId) {
	var cart = this;
	var group = cart.groups.get(groupId);
	var items = group.items;
	var items_comma = items.join(",");
	
	this.getRequestUnparsed(price, items_comma, function(key, val, data) {
		alert("Price is: [" + data + "]");
	});
}

Cart.prototype.getRequest = getRequest;
Cart.prototype.getRequestUnparsed = getRequestUnparsed;

Cart.prototype.getCategory = function(category, callback) {
	return this.getRequest(RequestCategory, category, callback);
}

Cart.prototype.getType = function(type, callback) {
	return this.getRequest(RequestType, type, callback);
}



function getRequestUnparsed(reqKey, reqValue, callbackFunc) {
 	var list = [];
	var key = reqKey + reqValue;
	var results = [];
	
	results = RequestCache.get(key);
	if (results != null) {
		//alert("Returning cached value");
		callbackFunc(reqKey, reqValue, results);
		return;
	}
	
  	$.getJSON('http://chrismeyers.org/larrys/cgi-bin/items.pl?'+reqKey+'='+reqValue+"&callback=?", function(data) {
		RequestCache.put(key, data);
		callbackFunc(reqKey, reqValue, data);
	}); // JSON
}

function getRequest(reqKey, reqValue, callbackFunc) {
	var list = [];
	var key = reqKey + reqValue;
	var results = [];
	
	results = this.RequestCache.get(key);
	if (results != null) {
		//alert("Returning cached value");
		callbackFunc(reqKey, reqValue, results);
		return;
	}
	
  	$.getJSON('http://chrismeyers.org/larrys/cgi-bin/items.pl?'+reqKey+'='+reqValue+"&callback=?", function(data) {
		$.each(data, function(i, item) {
			var entry = {};
			$.each(item, function(j, k) {
				entry[j] = k;
				//alert("Pushed it");
			});
			list.push(entry);
		});
		RequestCache.put(key, list);
		callbackFunc(reqKey, reqValue, list);
	}); // JSON
}
