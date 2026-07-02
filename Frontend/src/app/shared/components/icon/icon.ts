import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; //this is the material icon module  for the icon.

/** Maps legacy icon names to Material Icons ligature names. */
const ICON_NAME_MAP: Record<string, string> = {
  'file-text': 'description',
  building: 'business',
  image: 'image',
  layers: 'layers',
  user: 'person',
  'log-out': 'logout',
  clock: 'schedule',
  'message-circle': 'chat_bubble_outline',
  'share-2': 'share',
  list: 'list',
  settings: 'settings',
  hammer: 'handyman',
  link: 'link',
  check: 'check',
  x: 'close',
  'chevron-down': 'expand_more',
  bookmark: 'bookmark',
  'refresh-cw': 'refresh',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [MatIconModule],
  template: `<mat-icon [class]="'icon icon-' + size">{{ materialIconName }}</mat-icon>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        color: inherit;
        line-height: 1;
      }

      .icon {
        width: auto;
        height: auto;
        color: inherit;
        overflow: visible;
      }

      .icon-small {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .icon-medium {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .icon-large {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name: string = 'file-text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; //base on requirment you can take the diffrent size of button take.

  get materialIconName(): string {
    return ICON_NAME_MAP[this.name] ?? this.name;
  }
}
