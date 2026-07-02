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
  //@input is decorator that allow the parent component to pass the data to the child component and
  //@output is decorator that allow the child component to send the data to the parent component.
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

  //emit method send the data to the parent component when the value is change in the textarea.
  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  //emit method send the data to the parent component when the textarea is blur.
  onBlur(): void {
    this.blur.emit();
  }

  //emit method send the data to the parent component when the textarea is focus.
  onFocus(): void {
    this.focus.emit();
  }

  //onInputChange method is called when the value of the textarea is changed and it will call the onValueChange method to emit the new value to the parent component.
  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.onValueChange(target ? target.value : '');
  }
}
