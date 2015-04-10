$(function(){
    var curu = "curuser";

    function chatH(){
        return $("#contain").outerHeight()-130;
    }
    $("#sendmsg").click(function(){
        var msgtxt = $("#inputcontain").find("input[name='inp']").val();
        msgtxt = $.trim(msgtxt);
        if(msgtxt){
            $(".chatcont.cur").append($("<div>").append(msgtxt).addClass("chatitem l"));
            webSock.send(JSON.stringify({"type":"msg", "to":curu, "msg":msgtxt}));
            if($(".chatcont.cur").outerHeight(true) > chatH()){
                $("#chatcontain").scrollTop($(".chatcont.cur").outerHeight(true)-chatH());
            }
        }
    });

    var cflag = false;

    $("#contact").mousedown(function(ev){
        var oPos = $(this).offset();
        if(ev.target === this){
            $(document).mousemove(function(eve){
                $("#contact").css({top:(oPos.top+eve.pageY-ev.pageY), left:(oPos.left+eve.pageX-ev.pageX)});
            });
        }
    });

    $("#contain").mousedown(function(ev){
        var os = $(this).offset();
        var os1 = {top:(os.top+$(this).outerHeight()), left:(os.left+$(this).outerWidth())};
        res = wj(ev.pageY, ev.pageX, os.top, os.left, os1.top, os1.left);
        if(res){
            cflag = true;
        }
        if(res === 1){
            $(document).mousemove(function(eve){
                $("#contain").css({height:($("#contain").data("oh")+eve.pageY-ev.pageY-20)});
                $("#chatcontain").css("height", chatH());

                if($(".chatcont.cur").outerHeight(true) > chatH()){
                    $("#chatcontain").scrollTop($(".chatcont.cur").outerHeight(true)-chatH());
                }

            });
        }else{
            if(ev.target === this){
                var oPos = $(this).offset();
                $(document).mousemove(function(eve){
                    $("#contain").css({top:(oPos.top+eve.pageY-ev.pageY), left:(oPos.left+eve.pageX-ev.pageX)});
                });
            }
        }
    });

    function wj(c, cy, x, y, x1, y1){
        function abs(e){
            if(e<0){
                return -e;
            }else{
                return e;
            }
        }

        if((abs(c-x)<5||abs(c-x1)<5)&&(abs(cy-y)<5||abs(cy-y1)<5)){
            return 2;
        }

        if(abs(c-x)<5||abs(c-x1)<5){
            return 1;
        }

        if(abs(cy-y)<5||abs(cy-y1)<5){
            return 3;
        }

        return false;
    }

    $("#contain").data("oh", $("#contain").outerHeight());

    $(document).mouseup(function(){
        if(cflag){
            $("#contain").data("oh", $("#contain").outerHeight());
            cflag = false;
        }
        $(document).unbind('mousemove');
    });

    $(".contactitem").click(function(){
        $("#chattitle").text($(this).text());
        var chatcont = $(this).data("chatcont");
        $(".chatcont").removeClass("cur");
        if(chatcont){
            chatcont.addClass("cur");
            if($(".chatcont.cur").outerHeight(true) > chatH()){
                $("#chatcontain").scrollTop($(".chatcont.cur").outerHeight(true)-chatH());
            }
            $(this).removeClass("onmsg");
        }else{
            var curchatcont = $("<div>").addClass("chatcont cur");
            $("#chatcontain").append(curchatcont);
            $(this).data("chatcont", curchatcont);
        }
    });

    var webSock = new WebSocket("");

    webSock.onmessage = function(ev){
        var data = ev.data;
        data = JSON.parse(data); //{"type":"msg", "from":"user", "msg":"msg text"}
        if(data["type"]==="msg"){
            var ulist = $("#contactcontent").data("user");
            var tar = ulist[data["form"]];
            tar.addClass("onmsg");
            tar.append($("<div>").append(data["msg"]).addClass("chatitem wd"));
        }
    };

    $("input[name='inp']").focusin(function(){
        $(".chatcont.cur").find(".wd").removeClass("wd");
    });

























});