import {Container} from "typedi/Container";
import {MongodbDriver} from "../../src/driver/MongodbDriver";
import {ConnectionManager} from "../../src/connection/ConnectionManager";
import {Post} from "./document/Post";
import {PostController} from "./PostController";

/**
 * This sample is focused to teach on how to:
 *  - use typedi component and its container with the
 * */

let connectionManager = Container.get<ConnectionManager>(ConnectionManager);
connectionManager.container = Container;
connectionManager.addConnection(new MongodbDriver(require('mongodb')));
connectionManager.importDocumentsFromDirectories([__dirname + '/document']);
console.log('connection is added!');

connectionManager.getConnection().connect({ url: 'mongodb://localhost:27017/typeodm-samples'}).then(connection => {
    console.log('Connection to mongodb is established');

    // we need to execute start point this way to make everything to work properly:
    Container.get<any>(require('./PostController').PostController).action();


}).catch(e => console.log('Error during connection to mongodb: ' + e));