import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ILivechatRoom, IPostLivechatRoomStarted } from '@rocket.chat/apps-engine/definition/livechat';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import LiveChatRepositoryImpl from './src/data/livechat/LivechatRepositoryImpl';
import IRapidProRemoteDataSource from './src/data/rapidpro/IRapidProRemoteDataSource';
import LiveChatAppsEngine from './src/local/livechat/LivechatAppsEngine';
import RapidProRestApi from './src/remote/rapidpro/RapidproRestApi';
import {
    APP_SETTINGS,
    CONFIG_DEFAULT_TIMEZONE,
    CONFIG_HISTORY_TIME,
    CONFIG_RAPIDPRO_AUTH_TOKEN,
    CONFIG_RAPIDPRO_URL,
    CONFIG_REQUEST_TIMEOUT,
} from './src/settings/Constants';

export class PushContactHistoryApp extends App implements IPostLivechatRoomStarted {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        APP_SETTINGS.forEach((setting) => configuration.settings.provideSetting(setting));
        await configuration.scheduler.registerProcessors([
            {
                id: 'send-history',
                processor: async (job, read, modify, http, persis) => {
                    const rpHostUrl = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_RAPIDPRO_URL);
                    const rpAuthToken = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_RAPIDPRO_AUTH_TOKEN);
                    const reqTimeout = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_REQUEST_TIMEOUT);
                    const historyTime = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_HISTORY_TIME);
                    const defaultTimezone = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_DEFAULT_TIMEZONE);

                    const after = new Date();
                    after.setHours(after.getHours() - historyTime);

                    const rapidProDataSource: IRapidProRemoteDataSource = new RapidProRestApi(
                        http,
                        rpHostUrl,
                        rpAuthToken,
                        reqTimeout ? reqTimeout : 5,
                    );
                    const messages = await rapidProDataSource.getHistory(
                        job.token,
                        after.toISOString(),
                        defaultTimezone,
                    );

                    const livechatRepo = new LiveChatRepositoryImpl(
                        new LiveChatAppsEngine(modify),
                    );
                    await livechatRepo.sendChatbotHistory(messages, job.room);
                },
            },
        ]);
    }

    public async executePostLivechatRoomStarted(room: ILivechatRoom, read: IRead, http: IHttp, persis: IPersistence, modify: IModify): Promise<void> {
        const id = 'send-history';
        const when = 'five seconds';
        await modify.getScheduler().scheduleOnce({ data: { token: room.visitor.token, room }, id, when });
    }

}
