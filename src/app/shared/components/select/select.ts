import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

export interface SelectOption {
  id: string;
  label: string;
  value?: any;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() iconName?: string;
  @Input() iconSize: 'small' | 'medium' | 'large' = 'small';
  @Input() options: SelectOption[] = [];
  private _selectedValue: string = '';

  @Input()
  set selectedValue(value: string) {
    this._selectedValue = value ?? '';
  }

  get selectedValue(): string {
    return this._selectedValue;
  }
  @Input() placeholder: string = 'Select an option';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id?: string;
  @Input() errorMessage?: string;

  @Output() selectionChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.id) {
      this.id = `select-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      this._selectedValue = this.selectedValue ?? '';
    }
  }

  onSelectionChange(newValue: string): void {
    this.selectedValue = newValue;
    this.selectionChange.emit(newValue);
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onSelectionChange(target ? target.value : '');
  }

  onBlur(): void {
    this.blur.emit();
  }
}
