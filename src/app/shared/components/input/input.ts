import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

type InputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent implements OnInit {
  @Input() label: string = '';
  @Input() iconName?: string;
  @Input() iconSize: 'small' | 'medium' | 'large' = 'small';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: InputType = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id?: string;
  @Input() errorMessage?: string;
  @Input() icon?: string;
  @Input() maxLength?: number;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.id) {
      this.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onValueChange(target ? target.value : '');
  }

  onBlur(): void {
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }
}
