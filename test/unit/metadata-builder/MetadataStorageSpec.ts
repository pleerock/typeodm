import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {defaultMetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {WrongAnnotationUsageError} from "../../../src/decorator/error/WrongAnnotationUsageError";
import {WrongFieldTypeError} from "../../../src/decorator/error/WrongFieldTypeError";
import {RelationMetadata} from "../../../src/metadata-builder/metadata/RelationMetadata";
import {BothJoinTypesUsedError} from "../../../src/decorator/error/BothJoinTypesUsedError";
import {MetadataStorage} from "../../../src/metadata-builder/MetadataStorage";
import {DocumentMetadata} from "../../../src/metadata-builder/metadata/DocumentMetadata";
import {MetadataAlreadyExistsError} from "../../../src/metadata-builder/error/MetadataAlreadyExistsError";
import {MetadataWithSuchNameAlreadyExistsError} from "../../../src/metadata-builder/error/MetadataWithSuchNameAlreadyExistsError";
import {FieldMetadata} from "../../../src/metadata-builder/metadata/FieldMetadata";

chai.should();
chai.use(require("sinon-chai"));

describe('MetadataStorage', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    class FirstTestClass {
        someProperty: string;
    }
    class SecondTestClass {
        someAnotherProperty: string;
    }
    class ThirdTestClass {
        anotherProperty: string;
    }

    let metadataStorage: MetadataStorage,
        firstTestObject: FirstTestClass,
        secondTestObject: SecondTestClass,
        thirdTestObject: ThirdTestClass;

    beforeEach(function() {
        metadataStorage     = new MetadataStorage();
        firstTestObject     = new FirstTestClass();
        secondTestObject    = new SecondTestClass();
        thirdTestObject     = new ThirdTestClass();
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it('should add a document metadata', function () {
        metadataStorage.addDocumentMetadata({
            objectConstructor: FirstTestClass,
            name: 'Document'
        });
    });

    it('should give all added document metadatas', function () {
        let first = { objectConstructor: FirstTestClass, name: 'FirstDocument' };
        let second = { objectConstructor: SecondTestClass, name: 'SecondDocument' };
        metadataStorage.addDocumentMetadata(first);
        metadataStorage.addDocumentMetadata(second);
        metadataStorage.documentMetadatas.should.include(first).and.include(second);
    });

    it('should throw exception if document with the same constructor or name is adding twice', function () {
        let metadataWithClass = { objectConstructor: FirstTestClass, name: <string> undefined };
        let metadataWithName1 = { objectConstructor: SecondTestClass, name: 'Document' };
        let metadataWithName2 = { objectConstructor: ThirdTestClass, name: 'Document' };

        expect(() => metadataStorage.addDocumentMetadata(metadataWithClass)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addDocumentMetadata(metadataWithClass)).to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addDocumentMetadata(metadataWithName1)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addDocumentMetadata(metadataWithName2)).to.throw(MetadataWithSuchNameAlreadyExistsError);
    });

    it('should add a abstract document metadata', function () {
        metadataStorage.addAbstractDocumentMetadata({
            objectConstructor: FirstTestClass
        });
    });

    it('should give all added abstract document metadatas', function () {
        let first = { objectConstructor: FirstTestClass };
        let second = { objectConstructor: SecondTestClass };
        metadataStorage.addAbstractDocumentMetadata(first);
        metadataStorage.addAbstractDocumentMetadata(second);
        metadataStorage.abstractDocumentMetadatas.should.include(first).and.include(second);
    });

    it('should throw exception if abstract document with the same constructor is adding twice', function () {
        let metadataWithClass = { objectConstructor: SecondTestClass };

        expect(() => metadataStorage.addAbstractDocumentMetadata(metadataWithClass)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addAbstractDocumentMetadata(metadataWithClass)).to.throw(MetadataAlreadyExistsError);
    });

    it('should add a odm event subscriber metadata', function () {
        metadataStorage.addOdmEventSubscriberMetadata({
            objectConstructor: FirstTestClass
        });
    });

    it('should give all odm event subscribers metadatas', function () {
        let first = { objectConstructor: FirstTestClass };
        let second = { objectConstructor: SecondTestClass };
        metadataStorage.addOdmEventSubscriberMetadata(first);
        metadataStorage.addOdmEventSubscriberMetadata(second);
        metadataStorage.odmEventSubscriberMetadatas.should.include(first).and.include(second);
    });

    it('should throw exception if odm event subscriber with the same constructor is adding twice', function () {
        let metadataWithClass = { objectConstructor: SecondTestClass };

        expect(() => metadataStorage.addOdmEventSubscriberMetadata(metadataWithClass)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addOdmEventSubscriberMetadata(metadataWithClass)).to.throw(MetadataAlreadyExistsError);
    });

    it('should add a field metadata', function () {
        metadataStorage.addFieldMetadata({
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            isArray: false,
            propertyName: 'someProperty'
        });
    });

    it('should give field metadatas', function () {
        let first = { object: firstTestObject, name: <string> undefined, type: (type: any) => 'string', isId: false, isObjectId: false, isAutoGenerated: false, isCreateDate: false, isUpdateDate: false, isArray: false, propertyName: 'someProperty' };
        let second = { object: firstTestObject, name: <string> undefined, type: (type: any) => 'string', isId: false, isObjectId: false, isAutoGenerated: false, isCreateDate: false, isUpdateDate: false, isArray: false, propertyName: 'someProperty2' };
        metadataStorage.addFieldMetadata(first);
        metadataStorage.addFieldMetadata(second);
        metadataStorage.fieldMetadatas.should.include(first).and.include(second);
    });

    it('should throw exception if field metadata with the same property name or name is adding twice', function () {
        let metadataForSomeProperty1: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeProperty2: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeProperty3: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'somePropertyX'
        };
        let metadataForSomeProperty4: FieldMetadata = {
            object: secondTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeName1: FieldMetadata = {
            object: firstTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty1'
        };
        let metadataForSomeName2: FieldMetadata = {
            object: firstTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty2'
        };
        let metadataForSomeName3: FieldMetadata = {
            object: secondTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty3'
        };

        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty1)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty2)).to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty3)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty4)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName1)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName2)).to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName3)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
    });

    it('should throw exception if relation to one metadata with the same property name or name is adding twice', function () {
        metadataStorage.addRelationWithOneMetadata({
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    });

    it('should give all relation with one metadatas', function () {
        let first: RelationMetadata = { object: firstTestObject, name: undefined, type: type => SecondTestClass, propertyName: 'someProperty', inverseSide: null,
            isCascadeInsert: false, isCascadeUpdate: false, isCascadeRemove: false, isAlwaysLeftJoin: false, isAlwaysInnerJoin: false };
        let second: RelationMetadata = { object: firstTestObject, name: undefined, type: type => SecondTestClass, propertyName: 'someProperty2', inverseSide: null,
            isCascadeInsert: false, isCascadeUpdate: false, isCascadeRemove: false, isAlwaysLeftJoin: false, isAlwaysInnerJoin: false };
        metadataStorage.addRelationWithOneMetadata(first);
        metadataStorage.addRelationWithOneMetadata(second);
        metadataStorage.relationWithOneMetadatas.should.include(first).and.include(second);
    });

    it('should add a relation with many metadata', function () {
        let metadataForSomeProperty1: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty2: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty3: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => FirstTestClass,
            propertyName: 'somePropertyX',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty4: RelationMetadata = {
            object: secondTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName1: RelationMetadata = {
            object: firstTestObject,
            name: 'my_property',
            type: type => SecondTestClass,
            propertyName: 'someProperty1',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName2: RelationMetadata = {
            object: firstTestObject,
            name: 'my_property',
            type: type => SecondTestClass,
            propertyName: 'someProperty2',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName3: RelationMetadata = {
            object: secondTestObject,
            name: 'my_property',
            type: type => FirstTestClass,
            propertyName: 'someProperty3',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };

        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeProperty1)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeProperty2)).to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeProperty3)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeProperty4)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeName1)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeName2)).to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithOneMetadata(metadataForSomeName3)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
    });

    it('should give all relation with many metadatas', function () {
        let first: RelationMetadata = { object: firstTestObject, name: undefined, type: type => SecondTestClass, propertyName: 'someProperty', inverseSide: null,
            isCascadeInsert: false, isCascadeUpdate: false, isCascadeRemove: false, isAlwaysLeftJoin: false, isAlwaysInnerJoin: false };
        let second: RelationMetadata = { object: firstTestObject, name: undefined, type: type => SecondTestClass, propertyName: 'someProperty2', inverseSide: null,
            isCascadeInsert: false, isCascadeUpdate: false, isCascadeRemove: false, isAlwaysLeftJoin: false, isAlwaysInnerJoin: false };
        metadataStorage.addRelationWithManyMetadata(first);
        metadataStorage.addRelationWithManyMetadata(second);
        metadataStorage.relationWithManyMetadatas.should.include(first).and.include(second);
    });

    it('should throw exception if field metadata with the same property name or name is adding twice', function () {
        let metadataForSomeProperty1: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeProperty2: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeProperty3: FieldMetadata = {
            object: firstTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'somePropertyX'
        };
        let metadataForSomeProperty4: FieldMetadata = {
            object: secondTestObject,
            name: undefined,
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty'
        };
        let metadataForSomeName1: FieldMetadata = {
            object: firstTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty1'
        };
        let metadataForSomeName2: FieldMetadata = {
            object: firstTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty2'
        };
        let metadataForSomeName3: FieldMetadata = {
            object: secondTestObject,
            name: 'xxx',
            type: (type: any) => 'string',
            isId: false,
            isObjectId: false,
            isArray: false,
            isAutoGenerated: false,
            isCreateDate: false,
            isUpdateDate: false,
            propertyName: 'someProperty3'
        };

        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty1)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty2)).to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty3)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeProperty4)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName1)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName2)).to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addFieldMetadata(metadataForSomeName3)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
    });

    it('should throw exception if relation to many metadata with the same property name or name is adding twice', function () {
        metadataStorage.addRelationWithManyMetadata({
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        });
    });

    it('should add a relation with many metadata', function () {
        let metadataForSomeProperty1: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty2: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty3: RelationMetadata = {
            object: firstTestObject,
            name: undefined,
            type: type => FirstTestClass,
            propertyName: 'somePropertyX',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeProperty4: RelationMetadata = {
            object: secondTestObject,
            name: undefined,
            type: type => SecondTestClass,
            propertyName: 'someProperty',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName1: RelationMetadata = {
            object: firstTestObject,
            name: 'my_property',
            type: type => SecondTestClass,
            propertyName: 'someProperty1',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName2: RelationMetadata = {
            object: firstTestObject,
            name: 'my_property',
            type: type => SecondTestClass,
            propertyName: 'someProperty2',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };
        let metadataForSomeName3: RelationMetadata = {
            object: secondTestObject,
            name: 'my_property',
            type: type => FirstTestClass,
            propertyName: 'someProperty3',
            inverseSide: null,
            isCascadeInsert: false,
            isCascadeUpdate: false,
            isCascadeRemove: false,
            isAlwaysLeftJoin: false,
            isAlwaysInnerJoin: false
        };

        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeProperty1)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeProperty2)).to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeProperty3)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeProperty4)).not.to.throw(MetadataAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeName1)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeName2)).to.throw(MetadataWithSuchNameAlreadyExistsError);
        expect(() => metadataStorage.addRelationWithManyMetadata(metadataForSomeName3)).not.to.throw(MetadataWithSuchNameAlreadyExistsError);
    });

});
