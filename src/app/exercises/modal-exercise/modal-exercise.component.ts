import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-modal-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="card">
  <h2>Exercice 1: Modal et Z-index</h2>
  <p>Corriger les problèmes de z-index du modal et améliorer son animation.</p>

  <button class="btn" (click)="openModal()">Ouvrir le Modal</button>

  @if (isVisible()) {
    <div class="modal-container" (click)="closeModal()">
      <div class="overlay"></div>
      <div 
        class="modal" 
        [@modalAnimation]="isHiding() ? 'closing' : 'open'" 
        (@modalAnimation.done)="onAnimationDone()" 
        (click)="$event.stopPropagation()">
        
        <h3>Contenu du Modal</h3>
        <p>Ce modal doit apparaître au-dessus de tous les autres éléments.</p>
        <button class="btn" (click)="closeModal()">Fermer</button>
      </div>
    </div>
  }
</div>
`,
  styles: [`
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  `],  animations: [
    trigger('modalAnimation', [
      state('open', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      state('closing', style({ opacity: 0, transform: 'translateY(-20px) scale(0.9)' })),
      
      transition('void => open', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1.05)' })),
        animate('100ms ease-in', style({ transform: 'scale(1)' }))
      ]),
      
      transition('open => closing', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(200px) scale(0.9)' }))
      ])
    ])
  ]
})
export class ModalExerciseComponent {
  isVisible = signal(false); 
  isHiding = signal(false);  

  openModal() {
    this.isVisible.set(true);
  }

  closeModal() {
    if (this.isHiding()) return; 
    this.isHiding.set(true);  
  }

  onAnimationDone() {
    if (this.isHiding()) {
      this.isVisible.set(false);
      this.isHiding.set(false); 
    }
  }
}
