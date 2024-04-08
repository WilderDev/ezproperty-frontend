import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Ticket } from "../models/ticket";
import { response } from "express";


@Injectable({ providedIn: 'root'})
export class TicketService {
    private ticketSub = new BehaviorSubject<Ticket | undefined | null>(null)

  constructor(
    private router: Router,
    private http: HttpClient
    ) { }

    public get currentTicket() {
      return this.ticketSub.asObservable();
    }

    addNewTicket(ticket: Ticket) {
      return this.http.post(`${environment.API_URL}/tickets/create`, ticket)
    }

    getAllTickets() {
      return this.http.get<{success: boolean, data:{tickets: Ticket[]}}>(`${environment.API_URL}/tickets/all`).pipe(map(response => response.data.tickets))
    }

    getTicketById (id: string) {

      return this.http.get<{success: true,
      data: {ticket: Ticket}}>(`${environment.API_URL}/tickets/find/${id}`).pipe(map(response => response.data.ticket))


    }

    updateTicket (id: string, params: any) {
      return this.http.patch(`${environment.API_URL}/tickets/edit/${id}`, params).pipe(map(x => {
        const ticket = {...this.ticketSub, ...params};

        console.log("params:", params)
        console.log("ticketSub: ", this.ticketSub)
        console.log(ticket)
        this.ticketSub.next(ticket);

        console.log(ticket)
        return x
      }))
    }

    deleteTicket (id: string) {
      return this.http.delete(`${environment.API_URL}/trailers/delete/${id}`).pipe(map(x => {
        return x
      }))
    }
}