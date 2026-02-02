import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CursorEffectsService } from './cursor-effects.service';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [],
  templateUrl: './custom-cursor.component.html',
  styleUrl: './custom-cursor.component.scss'
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private cursor!: HTMLElement;
  private cursorDot!: HTMLElement;
  private cursorOutline!: HTMLElement;
  private trailElements: HTMLElement[] = [];
  
  private mousePosition = { x: 0, y: 0 };
  private cursorPosition = { x: 0, y: 0 };
  private animationId!: number;
  private isClicking = false;
  private isHovering = false;
  
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private cursorEffects: CursorEffectsService
  ) {}

  ngOnInit(): void {
    // Check if it's a touch device
    if (this.isTouchDevice()) {
      return;
    }
    
    this.createCursor();
    this.addEventListeners();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.removeCursor();
    this.cursorEffects.cleanup();
  }

  private isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private createCursor(): void {
    // Create main cursor container - only the circle outline
    this.cursor = this.renderer.createElement('div');
    this.renderer.setStyle(this.cursor, 'position', 'fixed');
    this.renderer.setStyle(this.cursor, 'top', '0');
    this.renderer.setStyle(this.cursor, 'left', '0');
    this.renderer.setStyle(this.cursor, 'pointer-events', 'none');
    this.renderer.setStyle(this.cursor, 'z-index', '99999');
    this.renderer.setStyle(this.cursor, 'opacity', '1');
    
    // Create cursor outline only (no dot - keep default cursor)
    this.cursorOutline = this.renderer.createElement('div');
    this.renderer.setStyle(this.cursorOutline, 'width', '40px');
    this.renderer.setStyle(this.cursorOutline, 'height', '40px');
    this.renderer.setStyle(this.cursorOutline, 'border', '2px solid rgba(102, 126, 234, 0.6)');
    this.renderer.setStyle(this.cursorOutline, 'border-radius', '50%');
    this.renderer.setStyle(this.cursorOutline, 'position', 'absolute');
    this.renderer.setStyle(this.cursorOutline, 'top', '-20px');
    this.renderer.setStyle(this.cursorOutline, 'left', '-20px');
    this.renderer.setStyle(this.cursorOutline, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
    this.renderer.setStyle(this.cursorOutline, 'backdrop-filter', 'blur(5px)');
    
    // Append only the outline
    this.renderer.appendChild(this.cursor, this.cursorOutline);
    this.renderer.appendChild(this.document.body, this.cursor);
    
    // Create trail elements
    this.createTrailElements();
    
    // Keep default cursor visible - don't hide it
    // this.renderer.setStyle(this.document.body, 'cursor', 'none'); // Removed this line
    
    // Set initial position
    this.mousePosition.x = window.innerWidth / 2;
    this.mousePosition.y = window.innerHeight / 2;
    this.cursorPosition.x = this.mousePosition.x;
    this.cursorPosition.y = this.mousePosition.y;
    
  }

  private createTrailElements(): void {
    for (let i = 0; i < 6; i++) {
      const trail = this.renderer.createElement('div');
      this.renderer.setStyle(trail, 'position', 'fixed');
      this.renderer.setStyle(trail, 'top', '0');
      this.renderer.setStyle(trail, 'left', '0');
      this.renderer.setStyle(trail, 'width', `${20 - i * 2}px`);
      this.renderer.setStyle(trail, 'height', `${20 - i * 2}px`);
      this.renderer.setStyle(trail, 'border', '1px solid rgba(102, 126, 234, 0.3)');
      this.renderer.setStyle(trail, 'border-radius', '50%');
      this.renderer.setStyle(trail, 'pointer-events', 'none');
      this.renderer.setStyle(trail, 'z-index', (99998 - i).toString());
      this.renderer.setStyle(trail, 'opacity', (0.6 - i * 0.1).toString());
      this.renderer.setStyle(trail, 'transform', `scale(${1 - i * 0.15})`);
      this.renderer.setStyle(trail, 'top', `${-10 + i}px`);
      this.renderer.setStyle(trail, 'left', `${-10 + i}px`);
      
      this.renderer.appendChild(this.document.body, trail);
      this.trailElements.push(trail);
    }
  }

  private addEventListeners(): void {
    // Mouse move
    this.renderer.listen(this.document, 'mousemove', (e: MouseEvent) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      
      // Create particles on fast movement
      const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
      if (speed > 8 && Math.random() > 0.7) {
        this.cursorEffects.createParticles(e.clientX, e.clientY, 3);
      }
    });

    // Mouse down - Enhanced click animation
    this.renderer.listen(this.document, 'mousedown', (e: MouseEvent) => {
      this.isClicking = true;
      
      // Animate the outline with a beautiful click effect
      this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1.8)');
      this.renderer.setStyle(this.cursorOutline, 'border-color', '#ff6b6b');
      this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(255, 107, 107, 0.2)');
      this.renderer.setStyle(this.cursorOutline, 'box-shadow', '0 0 30px rgba(255, 107, 107, 0.6)');
      
      // Create multiple ripple effects
      this.cursorEffects.createRippleEffect(e.clientX, e.clientY);
      setTimeout(() => this.cursorEffects.createRippleEffect(e.clientX, e.clientY), 100);
      
      // Create particle explosion
      this.cursorEffects.createParticles(e.clientX, e.clientY, 12);
      
      // Create expanding ring effect
      this.createExpandingRing(e.clientX, e.clientY);
    });

    // Mouse up - Return to normal state
    this.renderer.listen(this.document, 'mouseup', () => {
      this.isClicking = false;
      this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1)');
      this.renderer.setStyle(this.cursorOutline, 'border-color', 'rgba(102, 126, 234, 0.6)');
      this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
      this.renderer.setStyle(this.cursorOutline, 'box-shadow', 'none');
    });

    // Interactive elements
    this.setupInteractiveElements();

    // Mouse enter/leave window
    this.renderer.listen(this.document, 'mouseenter', () => {
      this.renderer.setStyle(this.cursor, 'opacity', '1');
    });

    this.renderer.listen(this.document, 'mouseleave', () => {
      this.renderer.setStyle(this.cursor, 'opacity', '0');
    });
  }

  private setupInteractiveElements(): void {
    // Links
    const links = this.document.querySelectorAll('a');
    links.forEach(link => {
      this.renderer.listen(link, 'mouseenter', () => {
        this.isHovering = true;
        this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1.5)');
        this.renderer.setStyle(this.cursorOutline, 'border-color', '#10ac84');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(16, 172, 132, 0.15)');
      });
      
      this.renderer.listen(link, 'mouseleave', () => {
        this.isHovering = false;
        this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1)');
        this.renderer.setStyle(this.cursorOutline, 'border-color', 'rgba(102, 126, 234, 0.6)');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
      });

      this.renderer.listen(link, 'click', (e: MouseEvent) => {
        this.cursorEffects.createStarEffect(e.clientX, e.clientY);
      });
    });

    // Buttons
    const buttons = this.document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach(button => {
      this.renderer.listen(button, 'mouseenter', () => {
        this.isHovering = true;
        this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1.3)');
        this.renderer.setStyle(this.cursorOutline, 'border-color', '#f368e0');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(243, 104, 224, 0.15)');
      });
      
      this.renderer.listen(button, 'mouseleave', () => {
        this.isHovering = false;
        this.renderer.setStyle(this.cursorOutline, 'transform', 'scale(1)');
        this.renderer.setStyle(this.cursorOutline, 'border-color', 'rgba(102, 126, 234, 0.6)');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
      });

      this.renderer.listen(button, 'click', (e: MouseEvent) => {
        this.cursorEffects.createExplosionEffect(e.clientX, e.clientY);
      });
    });

    // Input fields
    const inputs = this.document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      this.renderer.listen(input, 'mouseenter', () => {
        this.isHovering = true;
        this.renderer.setStyle(this.cursorOutline, 'border-color', '#2ed573');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(46, 213, 115, 0.15)');
      });
      
      this.renderer.listen(input, 'mouseleave', () => {
        this.isHovering = false;
        this.renderer.setStyle(this.cursorOutline, 'border-color', 'rgba(102, 126, 234, 0.6)');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
      });
    });

    // Images
    const images = this.document.querySelectorAll('img');
    images.forEach(image => {
      this.renderer.listen(image, 'mouseenter', () => {
        this.renderer.setStyle(this.cursorOutline, 'border-color', '#ffa726');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(255, 167, 38, 0.15)');
      });
      
      this.renderer.listen(image, 'mouseleave', () => {
        this.renderer.setStyle(this.cursorOutline, 'border-color', 'rgba(102, 126, 234, 0.6)');
        this.renderer.setStyle(this.cursorOutline, 'background', 'rgba(102, 126, 234, 0.1)');
      });
    });
  }

  private startAnimation(): void {
    const animate = () => {
      // Smooth cursor movement
      const ease = 0.15;
      this.cursorPosition.x += (this.mousePosition.x - this.cursorPosition.x) * ease;
      this.cursorPosition.y += (this.mousePosition.y - this.cursorPosition.y) * ease;
      
      // Update cursor position
      if (this.cursor) {
        this.renderer.setStyle(this.cursor, 'transform', 
          `translate3d(${this.cursorPosition.x}px, ${this.cursorPosition.y}px, 0)`);
      }
      
      // Update trail elements
      this.updateTrail();
      
      // Breathing effect for outline
      if (this.cursorOutline && !this.isHovering && !this.isClicking) {
        const breathe = Math.sin(Date.now() * 0.003) * 0.1 + 1;
        this.renderer.setStyle(this.cursorOutline, 'transform', `scale(${breathe})`);
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private updateTrail(): void {
    this.trailElements.forEach((element, index) => {
      const delay = (index + 1) * 0.05;
      const targetX = this.cursorPosition.x - delay * (this.mousePosition.x - this.cursorPosition.x);
      const targetY = this.cursorPosition.y - delay * (this.mousePosition.y - this.cursorPosition.y);
      
      this.renderer.setStyle(element, 'transform', 
        `translate3d(${targetX}px, ${targetY}px, 0)`);
    });
  }

  private removeCursor(): void {
    if (this.cursor && this.cursor.parentNode) {
      this.renderer.removeChild(this.document.body, this.cursor);
    }
    
    this.trailElements.forEach(element => {
      if (element.parentNode) {
        this.renderer.removeChild(this.document.body, element);
      }
    });
    
    // Restore default cursor
    this.renderer.setStyle(this.document.body, 'cursor', 'auto');
  }

  private createExpandingRing(x: number, y: number): void {
    const ring = this.renderer.createElement('div');
    this.renderer.setStyle(ring, 'position', 'fixed');
    this.renderer.setStyle(ring, 'left', x + 'px');
    this.renderer.setStyle(ring, 'top', y + 'px');
    this.renderer.setStyle(ring, 'width', '10px');
    this.renderer.setStyle(ring, 'height', '10px');
    this.renderer.setStyle(ring, 'border', '3px solid #667eea');
    this.renderer.setStyle(ring, 'border-radius', '50%');
    this.renderer.setStyle(ring, 'pointer-events', 'none');
    this.renderer.setStyle(ring, 'z-index', '99997');
    this.renderer.setStyle(ring, 'transform', 'translate(-50%, -50%) scale(0)');
    this.renderer.setStyle(ring, 'opacity', '1');
    
    this.renderer.appendChild(this.document.body, ring);
    
    // Animate the ring
    ring.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0)', 
        opacity: '1',
        borderWidth: '3px'
      },
      { 
        transform: 'translate(-50%, -50%) scale(8)', 
        opacity: '0',
        borderWidth: '1px'
      }
    ], {
      duration: 600,
      easing: 'ease-out'
    });
    
    // Remove the ring after animation
    setTimeout(() => {
      if (ring.parentNode) {
        this.renderer.removeChild(this.document.body, ring);
      }
    }, 600);
  }
}