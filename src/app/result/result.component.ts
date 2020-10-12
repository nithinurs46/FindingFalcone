import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  status: string;

  planetFound: string;

  timeTaken: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.status = this.activatedRoute.snapshot.queryParamMap.get('status');
    this.planetFound = this.activatedRoute.snapshot.queryParamMap.get('planet');
    this.timeTaken = this.activatedRoute.snapshot.queryParamMap.get('time');
  }

  findFalconeAgain = function () {
    this.router.navigate(['/welcome']);
  };

}
