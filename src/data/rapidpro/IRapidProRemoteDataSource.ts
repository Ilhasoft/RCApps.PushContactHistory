import RPMessage from '../../domain/RPMessage';

export default interface IRapidProRemoteDataSource {

    getHistory(visitorToken: string, after: string, defaultTimezone: number): Promise<Array<RPMessage>>;

}
