var commands = [{
    name: "clear",
    function: clearConsole
}, {
    name: "ls",
    function: showDirectory
}, {
    name: "history",
    function: showHistory
}]; // an object 


var cursor = $("#cusor");
var terminal = $("#terminal");
var text = ["\nroot@root~$:", ""]; // an array



var commandHistory = [];

var lineY = 1;
var index = 0;

setInterval(function() {
    cursor.toggleClass("invisible");
}, 500); // add and remove class invisible for cusor every 500ms

function scrollBottom() {
    $('html, body').animate({scrollTop: $(document).height()}, 100); // .animate({param}, speed, callback)
} // scroll to botommmmmmmm


function clearConsole() {
    text = [];
    lineY = 0;
}

function showDirectory() {
    lineY++;
    text[lineY] = "\nDesktop Documents Downloads Music Public Videos Pictures Templates"
}

function showHistory() {
    var txt = "";
    for (var i = 0; i < commandHistory.length; i++) {
        txt = txt + "\n " + (i+1) + " " + commandHistory[i];
    }
    lineY++;
    text[lineY] = txt;
}
function printConsole(txt) {
    cursor.remove();
    terminal.html(txt);
    terminal.append("<span id='cursor'></span>");
    cursor = $("#cursor");
}

function processCommand(rawData) {
    var args = rawData.split(" ");
    var command = args[0];
    if (command !== "")
        commandHistory.push(rawData);
    args.shift(); // like pop [a, b, c] -> [b, c]
    var unknowCommand = true;
    for (var i = 0; i < commands.length; i++) {
        if (command === commands[i].name) {
            commands[i].function(args);
            unknowCommand = false;
            break;
        } // === dont convert both type, == attemp to convert to number, string or boolean
    }

    if (unknowCommand == true) {
        lineY++;
        if (command == "")
            text[lineY] = "\n :)";
        else
            text[lineY] = "\nbash: " + command + " may be found, but cant use :<";
    }
}

function next_line() {
    processCommand(text[lineY]);
    if (lineY != 0) {
        lineY++;
        text[lineY] = "\n";
    } else
        text[lineY] = "";
    text[lineY] += "root@root~$: ";
    lineY++;
    text[lineY] = "";
    printConsole(text);
}

function erase(n) {
    text[lineY] = text[lineY].slice(0, -n); // like [0, 2] in python [a, b, c].slice(0, -1) -> [a, b]
    index--;
    printConsole(text);
}

$(document).ready(function() {
    printConsole(text);
})

$("html").on("keydown", function(e) {
    e = e || window.event; // if event pass, e = event or it will be set to global event
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode; // typeof(0) -> number (0 <=> 48)
    //  | Backspace
    if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") { // e.target.tagName find out which element triggered event
        e.preventDefault(); // cancle event if cancleable
        if (index != 0) {
            erase(1);
        }
    }
});

$(document).keypress(function(e) {
    e = e || window.event; // if event pass, e = event or it will be set to global event
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    switch (keyCode) {
        case 13: // ENTER key
            {
                scrollBottom();
                next_line();
                break;
            }
        default:
            {
                var data = String.fromCharCode(keyCode);
                if (data != undefined) {
                    scrollBottom();
                    var length = text[lineY].length;
                    text[lineY] += data;
                    index = index + (text[lineY].length - length);
                    printConsole(text);
                }
                break;
            }
    }
});