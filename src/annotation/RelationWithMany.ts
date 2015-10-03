import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {RelationTypeInFunction, PropertyTypeInFunction} from "../metadata-builder/metadata/RelationMetadata";
import {BothJoinTypesUsedException} from "./exception/BothJoinTypesUsedException";
import {WrongFieldTypeException} from "./exception/WrongFieldTypeException";
import {WrongAnnotationUsageException} from "./exception/WrongAnnotationUsageException";
import {RelationOptions} from "./options/RelationOptions";

/**
 * Class properties marked with this annotation used to create a many-to-many, many-to-one relation with other documents.
 */
export function RelationWithMany<T>(typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithMany<T>(name: string, typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithMany<T>(name: string|RelationTypeInFunction, typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>|RelationOptions, options?: RelationOptions): Function {
    return function (object: Object, propertyName: string) {
        if (name instanceof Function) {
            options = <RelationOptions> inverseSide;
            inverseSide = typeFunction;
            typeFunction = <RelationTypeInFunction> name;
            name = null;
        }

        if (!object || !propertyName || !object.constructor)
            throw new WrongAnnotationUsageException('RelationWithMany', 'class property', object);

        if (!typeFunction || !(typeof typeFunction === 'function'))
            throw new WrongFieldTypeException(null, object.constructor.name, propertyName);

        if (options && options.alwaysLeftJoin && options.alwaysInnerJoin)
            throw new BothJoinTypesUsedException(object.constructor.name, propertyName);

        defaultMetadataStorage.addRelationWithManyMetadata({
            object: object,
            name: name ? <string> name : undefined,
            type: typeFunction,
            propertyName: propertyName,
            inverseSide: <PropertyTypeInFunction<T>> inverseSide,
            isCascadeInsert: !!(options && options.cascadeInsert),
            isCascadeUpdate: !!(options && options.cascadeUpdate),
            isCascadeRemove: !!(options && options.cascadeRemove),
            isAlwaysLeftJoin: !!(options && options.alwaysLeftJoin),
            isAlwaysInnerJoin: !!(options && options.alwaysInnerJoin)
        });
    };
}
