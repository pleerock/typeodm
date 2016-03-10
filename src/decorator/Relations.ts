import {defaultMetadataStorage} from "../metadata-builder/MetadataStorage";
import {RelationTypeInFunction, PropertyTypeInFunction} from "../metadata-builder/metadata/RelationMetadata";
import {BothJoinTypesUsedError} from "./error/BothJoinTypesUsedError";
import {WrongFieldTypeError} from "./error/WrongFieldTypeError";
import {WrongAnnotationUsageError} from "./error/WrongAnnotationUsageError";
import {RelationOptions} from "./options/RelationOptions";

/**
 * Class properties marked with this annotation used to create a one-to-one, one-to-many relation with other documents.
 */
export function RelationWithOne<T>(typeFunction: RelationTypeInFunction, options?: RelationOptions): Function;
export function RelationWithOne<T>(typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithOne<T>(name: string, typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithOne<T>(name: string|RelationTypeInFunction,
                                   typeFunctionOrInverseSideOrOptions: RelationTypeInFunction|PropertyTypeInFunction<T>|RelationOptions,
                                   inverseSideOrOptions?: PropertyTypeInFunction<T>|RelationOptions,
                                   options?: RelationOptions): Function {
    return function (object: Object, propertyName: string) {
        let typeFunction: RelationTypeInFunction;
        if (name instanceof Function) {
            options = <RelationOptions> inverseSideOrOptions;
            inverseSideOrOptions = <PropertyTypeInFunction<T>> typeFunctionOrInverseSideOrOptions;
            typeFunction = <RelationTypeInFunction> name;
            name = null;
        } else {
            typeFunction = <RelationTypeInFunction> typeFunctionOrInverseSideOrOptions;
        }
        if (typeof typeFunctionOrInverseSideOrOptions === "object") {
            options = <RelationOptions> typeFunctionOrInverseSideOrOptions;
        }

        if (!object || !propertyName || !object.constructor)
            throw new WrongAnnotationUsageError("RelationWithOne", "class property", object);

        if (!typeFunction || !(typeof typeFunction === "function"))
            throw new WrongFieldTypeError(null, (<any> object.constructor).name, propertyName);

        if (options && options.alwaysLeftJoin && options.alwaysInnerJoin)
            throw new BothJoinTypesUsedError((<any> object.constructor).name, propertyName);

        defaultMetadataStorage.addRelationWithOneMetadata({
            object: object,
            name: name ? <string> name : undefined,
            type: typeFunction,
            propertyName: propertyName,
            inverseSide: <PropertyTypeInFunction<T>> inverseSideOrOptions,
            isCascadeInsert: !!(options && options.cascadeInsert),
            isCascadeUpdate: !!(options && options.cascadeUpdate),
            isCascadeRemove: !!(options && options.cascadeRemove),
            isAlwaysLeftJoin: !!(options && options.alwaysLeftJoin),
            isAlwaysInnerJoin: !!(options && options.alwaysInnerJoin)
        });
    };
}

/**
 * Class properties marked with this annotation used to create a many-to-many, many-to-one relation with other documents.
 */
export function RelationWithMany<T>(typeFunction: RelationTypeInFunction, options?: RelationOptions): Function;
export function RelationWithMany<T>(typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithMany<T>(name: string, typeFunction: RelationTypeInFunction, inverseSide?: PropertyTypeInFunction<T>, options?: RelationOptions): Function;
export function RelationWithMany<T>(name: string|RelationTypeInFunction,
                                    typeFunctionOrInverseSideOrOptions: RelationTypeInFunction|PropertyTypeInFunction<T>|RelationOptions,
                                    inverseSideOrOptions?: PropertyTypeInFunction<T>|RelationOptions,
                                    options?: RelationOptions): Function {
    return function (object: Object, propertyName: string) {
        let typeFunction: RelationTypeInFunction;
        if (name instanceof Function) {
            options = <RelationOptions> inverseSideOrOptions;
            inverseSideOrOptions = <PropertyTypeInFunction<T>> typeFunctionOrInverseSideOrOptions;
            typeFunction = <RelationTypeInFunction> name;
            name = null;
        } else {
            typeFunction = <RelationTypeInFunction> typeFunctionOrInverseSideOrOptions;
        }
        if (typeof typeFunctionOrInverseSideOrOptions === "object") {
            options = <RelationOptions> typeFunctionOrInverseSideOrOptions;
        }

        if (!object || !propertyName || !object.constructor)
            throw new WrongAnnotationUsageError("RelationWithMany", "class property", object);

        if (!typeFunction || !(typeof typeFunction === "function"))
            throw new WrongFieldTypeError(null, (<any> object.constructor).name, propertyName);

        if (options && options.alwaysLeftJoin && options.alwaysInnerJoin)
            throw new BothJoinTypesUsedError((<any> object.constructor).name, propertyName);

        defaultMetadataStorage.addRelationWithManyMetadata({
            object: object,
            name: name ? <string> name : undefined,
            type: typeFunction,
            propertyName: propertyName,
            inverseSide: <PropertyTypeInFunction<T>> inverseSideOrOptions,
            isCascadeInsert: !!(options && options.cascadeInsert),
            isCascadeUpdate: !!(options && options.cascadeUpdate),
            isCascadeRemove: !!(options && options.cascadeRemove),
            isAlwaysLeftJoin: !!(options && options.alwaysLeftJoin),
            isAlwaysInnerJoin: !!(options && options.alwaysInnerJoin)
        });
    };
}
