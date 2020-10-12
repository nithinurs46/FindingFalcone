import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../service/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public nav: NavbarService, private router: Router) { }

  ngOnInit() {
  }
  navigateHome() {
    this.nav.hide();
    this.router.navigate(['welcome']);
  }

}
