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
  
    const token = localStorage.getItem("token");
    if (token) {
      this.auth.getCurrentUser().subscribe({
        next: (user) => {
          this.stompClient.connect(
            { Authorization: 'Bearer ' + token },
            (frame: any) => {
              console.log('WebSocket connected', frame);
              this.subscribeToTopics(user, proposalId);
            },
            (error: any) => {
              console.error('WebSocket connection error:', error);
            }
          );
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    }
  }
  
  private subscribeToTopics(user: any, proposalId?: number) {
    // các shop sẽ subcribe kênh này và nhận thông báo mỗi khi có ER
    if (user.roles?.[0]?.name === 'SHOP') {
      this.stompClient.subscribe('/topic/emergency-request', (message: any) => {
        console.log('SHOP received:', message.body);
        this.notificationSubject.next(message.body);
      });
    }
  
    // kênh của khách hàng (đã yêu cầu cứu trợ) mỗi khi nhận đc các đề xuất từ shop
    this.stompClient.subscribe(`/user/${user.username}/queue/proposal`, (message: any) => {
      console.log('CUSTOMER received:', message.body);
      this.notificationSubject.next(message.body);
    });
  
    // Subscribe cho notifications chung
    this.stompClient.subscribe(`/user/${user.username}/queue/notifications`, (message: any) => {
      this.notificationSubject.next(message.body);
    });
  
    // Nếu có proposalId, subscribe theo proposal
    if (proposalId !== undefined) {
      this.stompClient.subscribe(`/topic/proposal/${proposalId}`, (message: any) => {
        this.notificationSubject.next(message.body);
        console.log('Received Location:', message.body);
      });
    }
  }
  



  sendLocation(proposalId: string, location: string) {
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
