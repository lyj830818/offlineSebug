var CC = {};

CC.callback = {
    list: function(result) {
        CC.ui.ready();
        var html = "", list = result.list, page = parseInt(result.page);
        var ul = $("#list ul");

        $("#article").hide();
        $("#list h2").text(result.title);

        if(list.length == 0) {
            if(page == 0) {
                ul.html("没有找到符合条件的漏洞。");
                $("#main footer").hide();
            } else {
                ul.append("没有更多了~");
                $("#main footer").hide();
            }
        } else {
            if(page == 0) {
                $("#list").hide().fadeIn();
                ul.html(html);
            }
            for(var i=0; i<list.length; i++) {
                var item = list[i];
                html += ['<li>', (item.pubdate ? '<span class="date">' + item.pubdate + '</span>' : ""), 
                    '<a data-insite="true" href="/', result.prefix, "/", item.id, '/">',                
                    item.title, '</a></li>'].join("");
            }
            ul.append(["<h3>第", page, "页</h3>", html].join(""));

            if(result.context) {
                prefix = ["", result.context, result.search, ""].join("/");
                $("#load-more").attr("href", prefix + (page + 1));
                $("#main footer").show();
            } else {
                $("#main footer").hide();
            }       
        }
             
    },
    article: function(result) {
        $("#list").hide();
        $("#article").fadeIn();

        $("#vul-title").text(result.title);
        $("#vul-content").html(result.content);
        $("#vul-date").html(result.pubdate);
        $("#vul-appdir").text(result.appdir).attr("href", "/app/"+ result.appdir);

        $("#vul-content a").each(function(i, e) {
            var url = e.href;
            if(url.substring(0, 17) === "http://sebug.net/")
                if(url.substring(17, 25) === "lto?url=")
                    e.href = "/pdf/" + encodeURIComponent(url.substring(25));
                else
                    $(e).remove();
        });
    }
};

CC.ui = {
    busy: function() {
        $("#busy").fadeIn();
    },
    ready: function() {
        $("#busy").fadeOut(100);
    },
};

$(function() {
    $("#appdir").on("click", "a", function() {
        CC.ui.busy();
        $.getJSON("/dir/" + this.innerHTML, CC.callback.list);
        return false;
    });
    $("#quick-search").on("submit", function() {
        var key = $("#keyword").val();
        if(key.length) {
            CC.ui.busy();
            $.getJSON("/search/" + key, CC.callback.list);
        }
        return false;
    });
    $("#main").on("click", "a", function(e) {
        var callback, url = this.href;

        if($(this).data("insite")) {
            if(url.match(/\/(app|search)\//))
                callback = CC.callback.list;
            else if(url.match(/\/vul\//))
                callback = CC.callback.article;
        } else {
            window.open(url, "_blank");
        }
        
        if(callback) $.getJSON(url, callback);
        e.preventDefault();
    });
});