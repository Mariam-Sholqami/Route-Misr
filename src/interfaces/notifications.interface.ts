/******* the people inside a notification *******/
export interface INotificationUser {
  _id: string;
  name: string;
  photo: string;
}

/******* one notification  *******/
export interface INotification {
  _id: string;
  recipient: INotificationUser; // me
  actor: INotificationUser; // the person who did the action 
  type: string; // follow , like , comment ...
  entityType: string; // what the notification is about
  entityId: string; // the id of that post / user => to open it
  isRead: boolean;
  createdAt: string;
  readAt?: string; // after the notification is read
  entity?: {
    _id: string;
    body?: string;
    image?: string;
    name?: string;
    username?: string;
  };
}