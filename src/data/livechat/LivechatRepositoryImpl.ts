import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';

import RPMessage, { Direction } from '../../domain/RPMessage';
import ILivechatInternalDataSource from './ILivechatInternalDataSource';
import ILivechatRepository from './ILivechatRepository';

export default class LiveChatRepositoryImpl implements ILivechatRepository {
    constructor(
        private readonly internalDataSource: ILivechatInternalDataSource,
    ) {
    }

    public async sendChatbotHistory(messages: Array<RPMessage>, room: ILivechatRoom): Promise<string> {
        if (messages.length === 0) {
            return '';
        }
        return await this.internalDataSource.sendMessage(room, this.buildChatbotHistoryMessage(messages));
    }

    private buildChatbotHistoryMessage(messages: Array<RPMessage>): string {
        let messageText = '**Chatbot History**';

        for (let i = messages.length - 1; i >= 0; i--) {
            messageText += messages[i].direction === Direction.IN
                ? `\n> :bust_in_silhouette: [${messages[i].sentOn}]: \`${messages[i].text}\``
                : `\n> :robot: [${messages[i].sentOn}]: ${messages[i].text}`;
        }
        return messageText;
    }

}
