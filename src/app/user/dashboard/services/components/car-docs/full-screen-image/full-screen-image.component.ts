import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-full-screen-image',
  templateUrl: './full-screen-image.component.html',
  styleUrls: ['./full-screen-image.component.scss'],
})
export class FullScreenImageComponent implements AfterViewInit {
  @Input() car: any;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('wrapperElement') wrapperElement!: ElementRef<HTMLDivElement>;

  scale = 1;
  translateX = 0;
  translateY = 0;

  private MIN_SCALE = 1;
  private MAX_SCALE = 6;

  private pointers = new Map<number, { x: number; y: number }>();
  private panStart = { x: 0, y: 0 };
  private panStartTranslate = { x: 0, y: 0 };

  private pinchStartDistance = 0;
  private pinchStartScale = 1;

  private wrapperRect!: DOMRect;

  constructor(private modalCtrl: ModalController, private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.wrapperRect = this.wrapperElement.nativeElement.getBoundingClientRect();
    this.centerImage();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  private clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  private getDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private centerImage() {
    this.scale = 1;
    this.translateX = this.wrapperRect.width / 2;
    this.translateY = this.wrapperRect.height / 2;
    this.applyTransform();
  }

  private applyTransform() {
    const img = this.imageElement.nativeElement;
    img.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    img.style.transformOrigin = 'center center';
  }

  private applyBounds() {
    const img = this.imageElement.nativeElement;
    const rect = img.getBoundingClientRect();

    const wrapperW = this.wrapperRect.width;
    const wrapperH = this.wrapperRect.height;

    const offsetX = (rect.width - wrapperW) / 2;
    const offsetY = (rect.height - wrapperH) / 2;

    this.translateX = this.clamp(this.translateX, wrapperW / 2 - offsetX, wrapperW / 2 + offsetX);
    this.translateY = this.clamp(this.translateY, wrapperH / 2 - offsetY, wrapperH / 2 + offsetY);

    if (this.scale <= this.MIN_SCALE + 0.001) {
      this.centerImage();
    } else {
      this.applyTransform();
    }
  }

  // Pointer Down
  onPointerDown(ev: PointerEvent) {
    (ev.target as Element).setPointerCapture(ev.pointerId);
    this.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

    if (this.pointers.size === 1) {
      const p = this.pointers.get(ev.pointerId)!;
      this.panStart = { x: p.x, y: p.y };
      this.panStartTranslate = { x: this.translateX, y: this.translateY };
    } else if (this.pointers.size === 2) {
      const [p1, p2] = Array.from(this.pointers.values());
      this.pinchStartDistance = this.getDistance(p1, p2);
      this.pinchStartScale = this.scale;
    }
  }

  // Pointer Move
  onPointerMove(ev: PointerEvent) {
    if (!this.pointers.has(ev.pointerId)) return;
    this.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

    this.ngZone.runOutsideAngular(() => {
      if (this.pointers.size === 1) {
        const p = this.pointers.get(ev.pointerId)!;
        const dx = p.x - this.panStart.x;
        const dy = p.y - this.panStart.y;

        if (this.scale > 1) {
          this.translateX = this.panStartTranslate.x + dx;
          this.translateY = this.panStartTranslate.y + dy;
          this.applyBounds();
        }
      } else if (this.pointers.size === 2) {
        const [p1, p2] = Array.from(this.pointers.values());
        const distance = this.getDistance(p1, p2);
        const newScale = this.clamp(
          (distance / this.pinchStartDistance) * this.pinchStartScale,
          this.MIN_SCALE,
          this.MAX_SCALE
        );
        this.scale = newScale;
        this.applyBounds();
      }
    });
  }

  // Pointer Up
  onPointerUp(ev: PointerEvent) {
    this.pointers.delete(ev.pointerId);
    if (this.pointers.size < 2) {
      this.pinchStartDistance = 0;
      this.pinchStartScale = this.scale;
    }
    this.applyBounds();
  }

  // Wheel Zoom (Desktop)
  onWheel(ev: WheelEvent) {
    ev.preventDefault();
    const delta = -ev.deltaY;
    const zoomIntensity = 0.0015;

    const rect = this.wrapperRect;
    const px = ev.clientX - rect.left;
    const py = ev.clientY - rect.top;

    const targetScale = this.clamp(
      this.scale * (1 + delta * zoomIntensity),
      this.MIN_SCALE,
      this.MAX_SCALE
    );

    const k = targetScale / this.scale;
    this.translateX = px - (px - this.translateX) * k;
    this.translateY = py - (py - this.translateY) * k;

    this.scale = targetScale;
    this.applyBounds();
  }
}
