//here enum describe here provide the constant value for the filed type.
export enum FieldType {
  SINGLE_LINE = 'single_line',
  PARAGRAPH = 'paragraph',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  DATE_PICKER = 'date_picker',
  TIME_PICKER = 'time_picker',
  UPLOAD_FILE = 'upload_file',
  RATING_STAR = 'rating_star',
  IMAGE = 'image',
  TERMS_CONDITION = 'terms_condition',
  RATING_NUMBER = 'rating_number',
}

export interface FieldOption {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  collapsed: boolean;
  options: FieldOption[];
  description?: string;
  maxRating?: number;
  imageUrl?: string;
  termsText?: string;
}

//here descrive the structure of the sidebar items
export interface PaletteItem {
  type: FieldType;
  label: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

//here describe the structure of the sidebar items with the type, label, icon, iconColor, iconBg.
export const FIELD_PALETTE: PaletteItem[] = [
  { type: FieldType.SINGLE_LINE, label: 'Single Line', icon: 'title', iconColor: '#e85d4c', iconBg: '#fde8e6' },
  { type: FieldType.PARAGRAPH, label: 'Paragraph', icon: 'notes', iconColor: '#22a06b', iconBg: '#e3fcef' },
  { type: FieldType.CHECKBOX, label: 'Checkbox', icon: 'check_box', iconColor: '#d4a017', iconBg: '#fef9e7' },
  { type: FieldType.DROPDOWN, label: 'Dropdown', icon: 'arrow_drop_down_circle', iconColor: '#e84393', iconBg: '#fce4ec' },
  { type: FieldType.RADIO, label: 'Radio Button', icon: 'radio_button_checked', iconColor: '#3b82f6', iconBg: '#e8f0fe' },
  { type: FieldType.DATE_PICKER, label: 'Date Picker', icon: 'calendar_today', iconColor: '#f97316', iconBg: '#fff7ed' },
  { type: FieldType.TIME_PICKER, label: 'Time Picker', icon: 'schedule', iconColor: '#14b8a6', iconBg: '#e6fffa' },
  { type: FieldType.UPLOAD_FILE, label: 'Upload File', icon: 'cloud_upload', iconColor: '#8b5cf6', iconBg: '#f3e8ff' },
  { type: FieldType.RATING_STAR, label: 'Rating Star', icon: 'star', iconColor: '#eab308', iconBg: '#fefce8' },
  { type: FieldType.IMAGE, label: 'Image', icon: 'image', iconColor: '#2563eb', iconBg: '#e8f0fe' },
  { type: FieldType.TERMS_CONDITION, label: 'Terms & Conditions', icon: 'gavel', iconColor: '#dc2626', iconBg: '#fee2e2' },
  { type: FieldType.RATING_NUMBER, label: 'Rating Number', icon: 'pin', iconColor: '#16a34a', iconBg: '#dcfce7' },
];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  [FieldType.SINGLE_LINE]: 'Short Answer',
  [FieldType.PARAGRAPH]: 'Paragraph',
  [FieldType.CHECKBOX]: 'Checkbox',
  [FieldType.DROPDOWN]: 'Dropdown',
  [FieldType.RADIO]: 'Radio Button',
  [FieldType.DATE_PICKER]: 'Date Picker',
  [FieldType.TIME_PICKER]: 'Time Picker',
  [FieldType.UPLOAD_FILE]: 'Upload File',
  [FieldType.RATING_STAR]: 'Rating Star',
  [FieldType.IMAGE]: 'Image',
  [FieldType.TERMS_CONDITION]: 'Terms & Conditions',
  [FieldType.RATING_NUMBER]: 'Rating Number',
};

export function createDefaultField(type: FieldType): FormField {
  const id = `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const base: FormField = {
    id,
    type,
    label: '',
    placeholder: '',
    required: false,
    collapsed: false,
    options: [],
  };

  switch (type) {
    case FieldType.CHECKBOX:
    case FieldType.DROPDOWN:
    case FieldType.RADIO:
      base.options = [
        { id: `${id}-opt-1`, label: 'Option 1' },
        { id: `${id}-opt-2`, label: 'Option 2' },
        { id: `${id}-opt-3`, label: 'Option 3' },
      ];
      break;
    case FieldType.RATING_STAR:
      base.maxRating = 5;
      break;
    case FieldType.RATING_NUMBER:
      base.maxRating = 10;
      break;
    case FieldType.TERMS_CONDITION:
      base.termsText = 'I agree to the terms and conditions.';
      break;
    case FieldType.IMAGE:
      base.imageUrl = '';
      break;
  }

  return base;
}
