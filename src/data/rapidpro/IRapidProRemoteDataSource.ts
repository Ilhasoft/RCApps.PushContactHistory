import RPMessage from '../../domain/RPMessage';

export default interface IRapidProRemoteDataSource {

    getHistory(visitorToken: string, after: string): Promise<Array<RPMessage>>;

}
