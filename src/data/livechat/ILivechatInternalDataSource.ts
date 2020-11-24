import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';

export default interface ILivechatInternalDataSource {

    sendMessage(room: ILivechatRoom, text: string): Promise<string>;

}
