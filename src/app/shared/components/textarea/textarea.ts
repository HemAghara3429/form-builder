import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-textarea',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
})
export class Textarea implements OnInit {
  @Input() label: string = '';
  @Input() iconName?: string;
  @Input() iconSize: 'small' | 'medium' | 'large' = 'small';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rows: number = 4;
  @Input() id?: string;
  @Input() errorMessage?: string;
  @Input() maxLength?: number;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.id) {
      this.id = `textarea-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onBlur(): void {
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.onValueChange(target ? target.value : '');
  }
}
