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
   //@input is decorator that allow the parent component to pass the data to the child component and
  //@output is decorator that allow the child component to send the data to the parent component.
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

  //ngOnChanges method is called when the value of the selectedValue is changed and it will update the _selectedValue property.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      this._selectedValue = this.selectedValue ?? '';
    }
  }

  //emit method send the data to the parent component when the value is change in the select field.
  onSelectionChange(newValue: string): void {
    this.selectedValue = newValue;
    this.selectionChange.emit(newValue);
  }

  //onSelectChange method is called when the value of the select field is changed and it will call the onSelectionChange method to emit the new value to the parent component.
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onSelectionChange(target ? target.value : '');
  }

  //emit method send the data to the parent component when the select field is blur.
  onBlur(): void {
    this.blur.emit();
  }
}
