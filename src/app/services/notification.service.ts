import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private stompClient: any;
  private notificationSubject = new Subject<string>();
  apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private auth: AuthService, private http: HttpClient) {}

  connect(proposalId?: number) {
    const socket = new SockJS('/ws');
    this.stompClient = Stomp.over(socket);

    this.auth.getCurrentUser().subscribe({
      next: (user) => {
        this.stompClient.connect(
          {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          (frame: any) => {
            console.log('WebSocket connected', frame);
            console.log('ROle', user.roles);
            if (user.roles[0].name === 'SHOP') {
              this.stompClient.subscribe(
                '/topic/emergency-request',
                (message: any) => {
                  console.log('SHOP received:', message.body);
                  this.notificationSubject.next(message.body);
                }
              );
            }

            this.stompClient.subscribe(
              `/user/${user.username}/queue/proposal`,
              (message: any) => {
                console.log('CUSTOMER received:', message.body);
                this.notificationSubject.next(message.body);
              }
            );

            this.stompClient.subscribe(
              `/user/${user.username}/queue/notifications`,
              (message: any) => {
                this.notificationSubject.next(message.body);
              }
            );
            if (proposalId !== undefined){
              this.stompClient.subscribe(
                `/topic/proposal/${proposalId}`,
                (message: any) => {
                  this.notificationSubject.next(message.body);
                  console.log('Received Location:', message.body);
                }
              );
            }
          },
          (error: any) => {
            console.error('WebSocket connection error:', error);
          }
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }



  sendLocation(proposalId: string, location: string) {
    // Gửi vị trí của Shop hoặc KH đến topic chung
    this.stompClient.send(`/app/send-location/${proposalId}`, {}, location);
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      console.log('Disconnected');
    }
  }

  getNotifications() {
    return this.notificationSubject.asObservable();
  }

  getUnreadOfCurrentUser() {
    return this.http.get(this.apiUrl + '/current-user/unread');
  }
  getByCurrentUser() {
    return this.http.get(this.apiUrl + '/current-user');
  }
}
