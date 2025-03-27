import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface PerformanceExercise {
  id: number,
  value: number 
}

@Component({
  selector: 'app-performance-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Exercice 3: Performance</h2>
      <p>Optimiser les calculs intensifs et éviter le blocage du thread principal.</p>

      <div class="controls">
        <button class="btn" (click)="startHeavyCalculation()">
          Démarrer le calcul intensif
        </button>
      </div>

      <div class="results">
        @if (calculating()) {
          <div class="loading-spinner"></div>
        }
        
        @if (results().length > 0) {
          <div class="data-grid">
            @for (result of results(); track result.id) {
              <div class="grid-item">
                {{ result.value }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .controls {
      margin-bottom: 20px;
    }
    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
    }
    .grid-item {
      padding: 10px;
      background: #eee;
      text-align: center;
      border-radius: 4px;
    }
    .results {
      margin-top: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceExerciseComponent {
  calculating = signal(false);
  results = signal<PerformanceExercise[]>([]);
  
 startHeavyCalculation() {
    this.calculating.set(true);
    const data = Array.from({ length: 1000 }, (_, i) => i);

    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./performance.worker.ts', import.meta.url));
      
      worker.onmessage = ({ data }) => {
        this.results.set(data);
        this.calculating.set(false);
        worker.terminate();
      };

      worker.postMessage(data);
    } else {
      this.results.set(this.heavyCalculation(data));
      this.calculating.set(false);
    }
  }

  private heavyCalculation(data: number[]): PerformanceExercise[] {
    return data.map((n, id) => {
      let value = n;
      for (let i = 0; i < 1000000; i++) {
        value = Math.sqrt(value * i);
      }
      return { id, value: Math.round(value) };
    });
  }
}