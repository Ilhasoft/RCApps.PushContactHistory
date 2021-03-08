import { HttpStatusCode, IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import IRapidProRemoteDataSource from '../../data/rapidpro/IRapidProRemoteDataSource';
import RPMessage from '../../domain/RPMessage';
import DateStringUtils from '../../utils/DateStringUtils';

export default class RapidProRestApi implements IRapidProRemoteDataSource {

    constructor(
        private readonly http: IHttp,
        private readonly baseUrl: string,
        private readonly authToken: string,
        private readonly timeout: number,
    ) {
        this.timeout = this.timeout < 5 ? 5 : this.timeout;
    }

    public async getHistory(visitorToken: string, after: string): Promise<Array<RPMessage>> {
        const reqOptions = this.requestOptions();
        reqOptions['params'] = { contact: visitorToken, after };

        const response = await this.http.get(this.baseUrl + '/api/v2/messages.json', reqOptions);
        if (!response || response.statusCode !== HttpStatusCode.OK) {
            return [];
        }

        const tzOffset = DateStringUtils.getTimezoneOffsetInMinutes(after);

        const result: Array<RPMessage> = [];

        response.data.results.forEach((message) => {
            if (message.status !== 'errored') {
                const date = message.sent_on ?? message.created_on;
                const sentOn = DateStringUtils.format(DateStringUtils.addMinutes(date, tzOffset), 'dd/MM/yyyy, hh:mm');

                message.text && result.push({ direction: message.direction, sentOn, text: message.text } as RPMessage);
                message.attachments.forEach((attachment) => {
                    result.push({ direction: message.direction, sentOn, text: attachment.url } as RPMessage);
                });
            }
        });

        return result;
    }

    private requestOptions(): object {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.authToken}`,
            },
            timeout: this.timeout * 1000,
        };
    }

}
