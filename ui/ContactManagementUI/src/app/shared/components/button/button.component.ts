import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() variant: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  @Input() cooldown:string = "3"; // cooldown time in seconds

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  isCooldown = false;

  get classes(): string {
    return [
      "btn mx-1",
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? "btn-full-width" : "",
      (this.disabled || this.isCooldown) ? "opacity-50 cursor-not-allowed" : "",
      this.loading ? "btn-loading" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading && !this.isCooldown) {
      this.buttonClick.emit(event);
      this.startCooldown();
    }
  }

  private startCooldown(): void {
    this.isCooldown = true;
    setTimeout(() => {
      this.isCooldown = false;
    }, Number(this.cooldown) * 1000);
  }
}
