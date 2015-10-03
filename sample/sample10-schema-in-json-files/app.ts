import {OdmFactory} from "../../src/OdmFactory";

/**
 * This sample is focused to teach on how to:
 *  - create a document which schema is defined in the json configuration file
 *  - work with such documents
 * */

OdmFactory.createMongodbConnection('mongodb://localhost:27017/typeodm-samples', [__dirname + '/document']).then(connection => {
    console.log('Connection to mongodb is established');

    // ----------------------------------------------------------------------
    // Insert related document. Example1 (regular hard way):
    // ----------------------------------------------------------------------

    // get repositories we need
    //let questionRepository = connection.getRepository("Question");

    //let question = questionRepository.create();
    //question['name'] = "Hello";
    //console.log(question);
    // todo

    //}).catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));