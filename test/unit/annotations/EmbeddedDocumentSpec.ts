import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {EmbeddedDocument} from "../../../src/decorator/EmbeddedDocument";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "../../../src/decorator/error/WrongAnnotationUsageError";

chai.should();
chai.use(require("sinon-chai"));

describe('EmbeddedDocument Annotation', function() {

    class TestClass {
    }

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should throw exception if annotation is set to a non constructor object', function () {
        expect(() => EmbeddedDocument()(null)).to.throw(WrongAnnotationUsageError);
        expect(() => EmbeddedDocument()(function() {})).to.throw(WrongAnnotationUsageError);
    });

    it('should add a new document metadata to the metadata storage', sinon.test(function () {
        var addDocumentMetadata = this.mock(defaultMetadataStorage).expects('addDocumentMetadata');

        let object = new TestClass();
        EmbeddedDocument()(object.constructor);
        addDocumentMetadata.should.have.been.calledWith({
            objectConstructor: object.constructor,
            name: ''
        });
    }));

});
