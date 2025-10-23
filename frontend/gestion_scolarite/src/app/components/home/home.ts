import { Component } from '@angular/core';
import { HomeService, Dashboard } from '../../services/home-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
dashboards: Dashboard[] = [];
  loading = true;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getAllDashboards().subscribe({
      next: (data) => {
        // Backend renvoie { success, data, count }
        this.dashboards = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dashboards :', err);
        this.loading = false;
      }
    });
  }
}

  