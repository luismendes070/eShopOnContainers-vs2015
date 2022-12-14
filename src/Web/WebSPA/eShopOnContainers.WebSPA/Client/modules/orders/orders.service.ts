import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { DataService } from '../shared/services/data.service';
import { IOrder } from '../shared/models/order.model';
import { IOrderItem } from '../shared/models/orderItem.model';
import { SecurityService } from '../shared/services/security.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { BasketWrapperService } from '../shared/services/basket.wrapper.service';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';


@Injectable()
export class OrdersService {
    private ordersUrl: string = '';

    constructor(private service: DataService, private basketService: BasketWrapperService, private identityService: SecurityService, private configurationService: ConfigurationService) {
        if (this.configurationService.isReady)
            this.ordersUrl = this.configurationService.serverSettings.orderingUrl;
        else
            this.configurationService.settingsLoaded$.subscribe(x => this.ordersUrl = this.configurationService.serverSettings.orderingUrl);

    }

    getOrders(): Observable<IOrder[]> {
        let url = this.ordersUrl + '/api/v1/orders';

        return this.service.get(url).map((response: Response) => {
            return response.json();
        });
    }

    getOrder(id: number): Observable<IOrder> {
        let url = this.ordersUrl + '/api/v1/orders/' + id;

        return this.service.get(url).map((response: Response) => {
            return response.json();
        });
    }

    postOrder(item): Observable<boolean> {
        return this.service.post(this.ordersUrl + '/api/v1/orders/new', item).map((response: Response) => {
            return true;
        });
    }

    mapBasketAndIdentityInfoNewOrder(): IOrder {
        let order = <IOrder>{};
        let basket = this.basketService.basket;
        let identityInfo = this.identityService.UserData;

        console.log(basket);
        console.log(identityInfo);

        // Identity data mapping:
        order.street = identityInfo.address_street;
        order.city = identityInfo.address_city;
        order.country = identityInfo.address_country;
        order.state = identityInfo.address_state;
        order.zipcode = identityInfo.address_zip_code;
        order.cardexpiration = identityInfo.card_expiration;
        order.cardnumber = identityInfo.card_number;
        order.cardsecuritynumber = identityInfo.card_security_number;
        order.cardtypeid = identityInfo.card_type;
        order.cardholdername = identityInfo.card_holder;
        order.total = 0;
        order.expiration = identityInfo.card_expiration;

        // basket data mapping:
        order.orderItems = new Array<IOrderItem>();
        basket.items.forEach(x => {
            let item: IOrderItem = <IOrderItem>{};
            item.pictureurl = x.pictureUrl;
            item.productId =  +x.productId;
            item.productname = x.productName;
            item.unitprice = x.unitPrice;
            item.units = x.quantity;

            order.total += (item.unitprice * item.units);

            order.orderItems.push(item);
        });

        order.buyer = basket.buyerId;

        return order;
    }

}

