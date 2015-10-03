import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {EmbeddedDocument} from "../../../src/annotation/EmbeddedDocument";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageException} from "../../../src/annotation/exception/WrongAnnotationUsageException";

chai.should();
chai.use(require("sinon-chai"));

describe('EmbeddedDocument Annotation', function() {

    class TestClass {
    }

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should throw exception if annotation is set to a non constructor object', function () {
        expect(() => EmbeddedDocument()(null)).to.throw(WrongAnnotationUsageException);
        expect(() => EmbeddedDocument()(function() {})).to.throw(WrongAnnotationUsageException);
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
