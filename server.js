
var fs=require('fs');
var express=require('express');
var app=express();
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');

var states;
fs.readFile("states.json", function(err, data) {
    states = JSON.parse(data.toString());
});
var users={
    jessica: "vliet",
    alice: "password1",
    bob: "password2",
    charlie: "password3",
    dan: "password4"
};
var msgs=[
    {user:"kilroy", phone: "123 555 1212", message:"was here!"}
]

app.set('port', (process.env.PORT || 8888));
app.use(cookieParser());
app.use(bodyParser.json());

//raises error 401 for an incorrect login
function sendUnauthorized(response) {
    response.status(401);
    response.send("Unauthorized");
}

app.post('/login', function(request, response) {
    var user = request.body.user;

    //RAISES error 401 for an incorrect login
    if (users[user] === undefined || users[user] !== request.body.password) {
        return sendUnauthorized(response);
    }

    //OUTPUT {"result": true} and a cookie is set
    response.cookie('login', user);
    response.json({result: true});

});

//Logout the user
app.get('/logout', function(request, response) {
    //OUTPUT Cookie is removed
    response.clearCookie('login');
    response.redirect('/home.html');
});

//root
app.get('/', function(request, response) {
    response.redirect('/home.html');
});


function propSort(prop) {
    var dir=1;
    if(prop[0] === "-") {
        dir = -1;
        prop = prop.substr(1);
    }
    return function (a,b) {
        var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
        return result * dir;
    }
}

app.get('/states/abbreviations', function(request, response) {
    var result = []
    for (var ind=0; ind<states.length; ind++) {
        result.push(states[ind].abbreviation)
    }
    response.json(result);
})

app.get('/states/:abbrev', function(request, response) {
    var abbrev = request.params.abbrev;

    for (var ind=0; ind<states.length; ind++) {
        if (states[ind].abbreviation == abbrev) {
            response.json(states[ind])
        }
    }
    response.status(404);
    response.send("Not Found");
});

app.get('/states',function(request, response) {
    var sort = request.query.sort;
    var result = states;
    if (sort) {
        result.sort(propSort(sort));
    }
    var offset = request.query.offset;
    if (offset === undefined) {
        offset=0;
    } else {
        offset = +offset;
    }
    var limit = request.query.limit;
    if (limit === undefined) {
        limit = 10;
    } else {
        limit = +limit;
    }
    if (limit > 10) {
        limit = 10;
    }
    for (var ind=0; ind<states.length; ind++) {
        states[ind].city = states[ind]['most-populous-city'];
    states[ind].miles = states[ind]['square-miles'];
    states[ind].time1 = states[ind]['time-zone1'];
    states[ind].time2 = states[ind]['time-zone2'];
    }
    result = result.slice(offset, offset+limit);
    response.json({'res':result, 'len': states.length});
});

app.get('/secret', function(request, response) {
    var user = request.cookies.login;
    if (users[user] === undefined) {
        return sendUnauthorized(response);
    }
    response.json({user: user, message: "This is the secret message"});
});

app.post('/write', function(request, response) {
    var user = request.cookies.login;
    if (users[user] === undefined) {
        return sendUnauthorized(response);
    }
    var msg = request.body.message;
    var phone = request.body.phone;
    if (msg === undefined || phone === undefined) {
        response.status(400);
        response.send("Bad request");
        return;
    }
    msgs.push({user:user, phone:phone, message: msg});
    response.json(msgs);
});

app.get('/read', function(request, response) {
    response.json(msgs);
});
app.use(express.static(__dirname+'/public'));

var server=app.listen(app.get('port'), function() {
    console.log("We have started our server at ", app.get('port'));
});
