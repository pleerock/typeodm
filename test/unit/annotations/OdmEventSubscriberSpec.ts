import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {OdmEventSubscriber} from "../../../src/decorator/OdmEventSubscriber";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "../../../src/decorator/error/WrongAnnotationUsageError";

chai.should();
chai.use(require("sinon-chai"));

describe('OdmEventSubscriber Annotation', function() {

    class TestClass {
    }

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should throw exception if annotation is set to a non constructor object', function () {
        expect(() => OdmEventSubscriber()(null)).to.throw(WrongAnnotationUsageError);
        expect(() => OdmEventSubscriber()(function() {})).to.throw(WrongAnnotationUsageError);
    });

    it('should add a new document metadata to the metadata storage', sinon.test(function () {
        var addOdmEventSubscriberMetadata = this.mock(defaultMetadataStorage).expects('addOdmEventSubscriberMetadata');

        let object = new TestClass();
        OdmEventSubscriber()(object.constructor);
        addOdmEventSubscriberMetadata.should.have.been.calledWith({
            objectConstructor: object.constructor
        });
    }));

});
