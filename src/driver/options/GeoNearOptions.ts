export interface GeoNearOptions {

    /**
     * Max number of results to return.
     */
    num?: number;

    /**
     * Include results up to maxDistance from the point.
     */
    maxDistance?: number;

    /**
     * Include results starting at minDistance from a point (2.6 or higher)
     */
    minDistance?: number;

    /**
     * Include a value to multiply the distances with allowing for range conversions.
     */
    distanceMultiplier?: number;

    /**
     * The preferred read preference.
     */
    readPreference?: string;

    /**
     * Filter the results by a query.
     */
    query: Object;

    /**
     * Perform query using a spherical model.
     */
    spherical: boolean;

    /**
     * The closest location in a document to the center of the search region will always be returned MongoDB > 2.X.
     */
    uniqueDocs: boolean;

    /**
     * Include the location data fields in the top level of the results MongoDB > 2.X.
     */
    includeLocs: boolean;

}