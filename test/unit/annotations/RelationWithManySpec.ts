import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "../../../src/decorator/error/WrongAnnotationUsageError";
import {WrongFieldTypeError} from "../../../src/decorator/error/WrongFieldTypeError";
import {RelationMetadata} from "../../../src/metadata-builder/metadata/RelationMetadata";
import {BothJoinTypesUsedError} from "../../../src/decorator/error/BothJoinTypesUsedError";

chai.should();
chai.use(require("sinon-chai"));

describe('RelationWithMany Annotation', function() {

    class TestClass {
        someProperty: string;
    }

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should throw exception if annotation is set to non-property', function () {
        expect(() => RelationWithMany(type => TestClass)(null, 'abc')).to.throw(WrongAnnotationUsageError);
        expect(() => RelationWithMany(type => TestClass)(new TestClass(), null)).to.throw(WrongAnnotationUsageError);
    });

    it('should throw exception if both left join and right join are being set in options', sinon.test(function () {
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;
        expect(() => RelationWithMany(typeInFunction, null, {
            alwaysInnerJoin: true,
            alwaysLeftJoin: true
        })(object, 'someProperty')).to.throw(BothJoinTypesUsedError);
    }));

    it('should add a new relation with many metadata to the metadata storage', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;

        RelationWithMany(typeInFunction)(object, 'someProperty');
        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: undefined,
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: undefined,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    }));

    it('should add a new metadata with specific name if name is given', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;

        RelationWithMany('my_property', typeInFunction)(object, 'someProperty');
        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: 'my_property',
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: undefined,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    }));

    it('should add a new metadata with inverse side property if inverse side is given', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;
        let inverseSideProperty = (testClassProperty: TestClass) => testClassProperty.someProperty;

        RelationWithMany('my_property', typeInFunction, inverseSideProperty)(object, 'someProperty');
        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: 'my_property',
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: inverseSideProperty,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    }));

    it('should add a new metadata with cascade options if they are given in annotation options', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;
        let inverseSideProperty = (testClassProperty: TestClass) => testClassProperty.someProperty;

        RelationWithMany('my_property', typeInFunction, inverseSideProperty, {
            cascadeInsert: true,
            cascadeUpdate: true,
            cascadeRemove: true
        })(object, 'someProperty');

        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: 'my_property',
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: inverseSideProperty,
            isCascadeInsert: true,
            isCascadeUpdate: true,
            isCascadeRemove: true,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    }));

    it('should add a new metadata with left join option if its given in annotation options', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;
        let inverseSideProperty = (testClassProperty: TestClass) => testClassProperty.someProperty;

        RelationWithMany('my_property', typeInFunction, inverseSideProperty, {
            alwaysLeftJoin: true
        })(object, 'someProperty');

        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: 'my_property',
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: inverseSideProperty,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: true,
            isAlwaysInnerJoin: false
        });
    }));

    it('should add a new metadata with inner join option if its given in annotation options', sinon.test(function () {
        var addRelationWithManyMetadata = this.mock(defaultMetadataStorage).expects('addRelationWithManyMetadata');
        let object = new TestClass();
        let typeInFunction = (type: any) => TestClass;
        let inverseSideProperty = (testClassProperty: TestClass) => testClassProperty.someProperty;

        RelationWithMany('my_property', typeInFunction, inverseSideProperty, {
            alwaysInnerJoin: true
        })(object, 'someProperty');

        addRelationWithManyMetadata.should.have.been.calledWithMatch(<RelationMetadata> {
            object: object,
            name: 'my_property',
            type: typeInFunction,
            propertyName: 'someProperty',
            inverseSide: inverseSideProperty,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: true
        });
    }));

});
