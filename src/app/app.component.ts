import { Component, AfterViewInit, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , AfterViewInit {
  title = 'poc-multplataforma';

  constructor(private swUpdate: SwUpdate, ) {}

  public ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(
        () => {
          if (confirm('new version available. Load new version?')) {
            window.location.reload();
          }
      });
    }
  }

  public ngAfterViewInit(): void {
    // window.moveTo(0, 0);
    // window.resizeTo(screen.availWidth, screen.availHeight);
  }

}
