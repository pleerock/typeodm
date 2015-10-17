export interface GeoHaystackSearchOptions {

    /**
     * Max number of results to return.
     */
    limit?: number;

    /**
     * Filter the results by a query.
     */
    search?: Object;

    /**
     * Include results up to maxDistance from the point.
     */
    maxDistance?: number;

    /**
     * The preferred read preference.
     */
    readPreference?: string;

}