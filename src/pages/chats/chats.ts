import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from 'api/collections';
import { Chat } from 'api/models';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { MessagesPage } from '../messages/messages';
import * as moment from 'moment';

/*
  Generated class for the Chats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit {
  chats;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap((chats: Chat[]) =>
        Observable.combineLatest(
          ...chats.map((chat: Chat) =>
            Messages
              .find({ chatId: chat._id })
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
          )
        )
      ).zone();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, { chat });
  }

  removeChat(chat: Chat): void {
    Chats.remove({ _id: chat._id }).subscribe(() => {
    });
  }
}