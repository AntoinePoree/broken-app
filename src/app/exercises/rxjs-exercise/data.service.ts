import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject } from '@angular/core';
import { Observable} from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';

export interface User {
  id: number;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  public users = computed(() => this._users.value() ?? []);

  private _users = rxResource<User[], User[]>({
    loader: () => this.fetchUsers().pipe(distinctUntilChanged()),
});

  private fetchUsers(): Observable<User[]> {
    // TODO: bring a real api
    return this.http.get<User[]>('https://api.example.com/users').pipe(
      map((users) => users.sort((a, b) => b.score - a.score)) // Trie par score
    );
  }

  updateScore(userId: number, newScore: number): void {
    this._users.update((users) =>
      users?.map((user) =>
        user.id === userId ? { ...user, score: newScore } : user
      )
    );
  }
}
