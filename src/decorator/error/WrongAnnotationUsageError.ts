export class WrongAnnotationUsageError extends Error {
    name = "WrongAnnotationUsageError";

    constructor(annotationName: string, correctPlace: string, whereActuallyUsed: any) {
        super();
        if (typeof whereActuallyUsed === "object")
            whereActuallyUsed = JSON.stringify(whereActuallyUsed);

        this.message = annotationName + " annotation is used in wrong place. " + annotationName + " annotation must " +
            "be set to " + correctPlace + ", but instead set to " + whereActuallyUsed;
    }

}