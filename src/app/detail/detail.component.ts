import { BaseComponent } from './../lib/base-component';
import { Component, OnInit, Injector } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent extends BaseComponent implements OnInit {
  detail:any;
  splq:any;
  productRelative: any;
 
  constructor(injector: Injector) { 
    super(injector);
  }
  ngOnInit(): void {
    this.detail = {};
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/sanpham/get-by-id/'+id).takeUntil(this.unsubscribe).subscribe(res => {
        this.splq = res;
        this._api.get('/api/Product/get-item-related/' + id + '/' + this.splq.maloai).takeUntil(this.unsubscribe)
          .subscribe((data) => {
            this.productRelative = data;
            setTimeout(() => {
              this.loadScripts();
            });
        });
        this.detail = res;
        setTimeout(() => {
          this.loadScripts();
        });
      }); 
    });
    Observable.combineLatest(
      this._api.get('/api/sanpham/get-spkm'),
    ).takeUntil(this.unsubscribe).subscribe(res => {
      this.splq = res[0];
      setTimeout(() => {
        this.loadScripts();
      });
    }, err => { });
  }
  addToCart(it) { 
    this._cart.addToCart(it);
    alert('Thêm thành công!'); 
  }
}


