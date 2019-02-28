var padManager = require('ep_etherpad-lite/node/db/PadManager');
var async = require('../../src/node_modules/async');

exports.eejsBlock_indexWrapper = function(hook_name, args, cb) {
    args.content += '<div id="small_list"></div><script src="./static/js/jquery.js"></script><script>$(function () { $("#small_list").load("./small_list"); });</script>';
};

var listAllPads = padManager.listAllPads;
if (listAllPads.length === 0) {  // Etherpad 1.8+ detected
    var nodeify = require('../../src/node_modules/nodeify');
    listAllPads = function(callback) {
        return nodeify(padManager.listAllPads(), callback);
    }
}

exports.registerRoute = function(hook_name, args, cb) {
    args.app.get("/small_list", function(req, res) {

        async.waterfall([
            function(callback) {
                listAllPads(callback);
            },
            function(data, callback) {
                r = "<ul>";
                for (var i = 0; i < data.padIDs.length; i++) {
                    r += '<li><a href="./p/' + data.padIDs[i] + '">' + data.padIDs[i] + '</li>';
                }
                r += "</ul>";
                res.send(r);
            },
        ]);
    });
};
