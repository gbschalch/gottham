// Funções Essenciais

var apiRequest = function(method, route, data, type)
{
    return new Promise(function(resolve, reject)
    {
        var m = method.toUpperCase();
        var r = new XMLHttpRequest();

        if (data) {
            data = JSON.stringify(data);
        } else {
        	data = null;
        }

        r.open(m, route, true);

        //r.withCredentials = true;
        //r.setRequestHeader('Content-type', 'application/json');
        //r.setRequestHeader('Accept', 'application/json');

        r.onreadystatechange = function()
        {
            if (this.readyState == 4) {

                if (this.status != 200) {

                    try {
                        reject(JSON.parse(r.responseText));
                    } catch (e) {
                        reject(r.responseText);
                    }

                } else {

                    if (type == 'blob') {
                        resolve(r.response);
                    } else {
                        try {
                        	console.log('Chegoy no Try');
                            resolve(JSON.parse(r.responseText));
                        } catch (e) {
                        	console.log('Caiy no catch');
                            resolve(r.responseText);
                        }
                    }
                }
            }
        };
        r.send(data);
    });
};