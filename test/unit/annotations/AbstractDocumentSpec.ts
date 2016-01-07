import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {AbstractDocument} from "../../../src/decorator/Document";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "../../../src/decorator/error/WrongAnnotationUsageError";

chai.should();
chai.use(require("sinon-chai"));

describe('AbstractDocument Annotation', function() {

    class TestClass {
    }

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should throw exception if annotation is set to a non constructor object', function () {
        expect(() => AbstractDocument()(null)).to.throw(WrongAnnotationUsageError);
        expect(() => AbstractDocument()(function() {})).to.throw(WrongAnnotationUsageError);
    });

    it('should add a new abstract document metadata to the metadata storage', sinon.test(function () {
        var addAbstractDocumentMetadata = this.mock(defaultMetadataStorage).expects('addAbstractDocumentMetadata');

        let object = new TestClass();
        AbstractDocument()(object.constructor);
        addAbstractDocumentMetadata.should.have.been.calledWith({
            objectConstructor: object.constructor
        });
    }));

});
