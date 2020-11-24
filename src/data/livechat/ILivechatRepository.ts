import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';

import RPMessage from '../../domain/RPMessage';

export default interface ILivechatRepository {

    sendChatbotHistory(messages: Array<RPMessage>, room: ILivechatRoom): Promise<string>;

}
