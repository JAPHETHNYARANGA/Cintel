import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, catchError } from 'rxjs/operators';
import { ApiServerService } from './service/api-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';

  constructor(private apiServerService: ApiServerService) { }

  ngOnInit(): void {
    this.loadUsers()
  }


  private loadUsers(): void {
    this.isLoading = true;
    this.apiServerService.getUsers().pipe(
      debounceTime(300), 
      catchError((error) => {
        this.errorMessage = 'An error occurred while fetching data';
        this.isLoading = false;
        throw error;
      })
    ).subscribe((data: any[]) => {
      this.users = data;
      this.filteredUsers = data;
      this.isLoading = false;
    });
  }


  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
