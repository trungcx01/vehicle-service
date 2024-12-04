import { LoadingService } from './services/loading.service';
import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showHeaderFooter: boolean = true;
  loading = false;
  constructor(private router: Router, public loadingService: LoadingService) {}
  urlNoHeaderFooter = ['/shop-home', '/login', '/signup', '/unauthorized', '/map', '/admin'];  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        // Kiểm tra URL và ẩn/hiện Header/Footer
        this.showHeaderFooter = !this.urlNoHeaderFooter.some((url) =>
          event.url.startsWith(url)
        );
      }
  
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.loading = false; 
        }, 600);
        
      }
    });
  }
  
}
