import { nanoid } from "nanoid";

class NotificationSchema implements StaticSchema<UserNotification> {
  getId(): keyof UserNotification {
    return "_id";
  }

  createEntityFromParams(params: Partial<UserNotification>): UserNotification {
    const id = nanoid();

    return {
      _id: id,
      actionUserId: '',
      generalAlertId: '',
      image: null,
      orderId: Date.now(),
      pushData: {} as TODO,
      text: '',
      time: Date.now(),
      userId: '',
      userImage: '',
      usernames: [],
      ...params,
    };
  }
}

export const notificationSchema = new NotificationSchema();
