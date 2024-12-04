import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  if (req.url.includes('localhost') || req.url.includes('127.0.0.1')){
    loadingService.showLoading();
  }
  return next(req).pipe(
    finalize(() => {
      if (req.url.includes('localhost') || req.url.includes('127.0.0.1')){
        loadingService.hideLoading();
      }
    })
  );
};
