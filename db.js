var sqlite3 = require('sqlite3')
  , config  = require('./config').default
;

var db = new sqlite3.Database(config.db.database);

exports.dir = function(alphabet, callback) {
	alphabet = alphabet.match(/^\w$/) ? alphabet.toUpperCase() : "0";
	db.all("select appdir as id, appdir, title from [dir] where key=?", [alphabet], function(err, rows) {
		callback({
			prefix: "app",
			title: alphabet,
			page: 0,
			list: err ? [] : rows
		});
	});
}

exports.app = function(title, page, callback) {
	var start = parseInt(page);
	start = start < 0 ? 0 : start * 20 ;
	db.all("select ssv as id, appdir, title, pubdate from [vul] where appdir=? order by pubdate desc limit ?, 20",
		[title, start], function(err, rows) {
		callback({
			search: title,
			prefix: "vul",
			title: title + "的漏洞目录",
			page: page,
			list: err ? [] : rows
		});
	});
}

exports.search = function(keyword, page, callback) {
	keyword = keyword.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5\' ']/g, "");	
	var start = parseInt(page)
	start = start < 0 ? 0 : start * 20 ;
	var where = "content like '%" + keyword.replace(/\s{1,}/g, "%' and content like '%") + "%'";
	db.all("select ssv as id, ssv, title, appdir, pubdate from [vul] where "
		+ where + " order by pubdate desc limit ?, 20", [start], function(err, rows) {
		callback({
			search: keyword,
			prefix: "vul",
			title: keyword + "的搜索结果",
			page: page,
			list: err ? [] : rows
		});
	})
}

exports.vul = function(ssvid, callback) {
	db.get("select ssv as id, * from [vul] where ssv = ? limit 1", [ssvid], function(err, row) {
		callback(err ? {} : row);
	})
}