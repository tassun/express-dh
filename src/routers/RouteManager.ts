import { Application, Request, Response } from 'express';

import path from 'path';
import signrouter from './SignRouter';
import diffierouter from "./DiffieRouter";

export class RouteManager {
    public static route(app: Application, dir: string) {
        
        app.get('/dh', function(req: Request, res: Response) {
            console.log('working '+dir+' - send /public/dh.html');
            let parent = path.dirname(dir);
            res.sendFile(parent + '/public/dh.html');
        });
        
        app.use("/",signrouter);   
        app.use("/crypto",diffierouter);

    }
}

/*

http://localhost:8080/
http://localhost:8080/dh

curl -X POST http://localhost:8080/crypto/dh
curl -X POST http://localhost:8080/crypto/dh/encrypt -d plaintext=Hello
curl -X POST http://localhost:8080/crypto/dh/decrypt -d ciphertext=???

*/