import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/sections/navbar.component';
import { FooterComponent } from './components/sections/footer.component';
import {Title} from "@angular/platform-browser";
import {siteConfig} from "@/config/site.config";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent implements OnInit {
  private titleService = inject(Title);
  ngOnInit(): void {
    this.titleService.setTitle(siteConfig.tabTitle)
  }
}
