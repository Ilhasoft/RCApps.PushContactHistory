import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';

import ILivechatInternalDataSource from '../../data/livechat/ILivechatInternalDataSource';

export default class LiveChatAppsEngine implements ILivechatInternalDataSource {

    constructor(
        private readonly modify: IModify,
    ) {
    }

    public async sendMessage(room: ILivechatRoom, text: string): Promise<string> {
        const livechatMessageBuilder = this.modify.getCreator().startLivechatMessage()
            .setRoom(room)
            .setVisitor(room.visitor)
            .setText(text);

        return await this.modify.getCreator().finish(livechatMessageBuilder);
    }

}
