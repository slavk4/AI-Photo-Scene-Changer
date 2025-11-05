
import { Option } from './types';

export const TIME_OF_DAY_OPTIONS: Option[] = [
  { id: 'time-day', label: 'Daytime', value: 'daytime' },
  { id: 'time-night', label: 'Night', value: 'night' },
  { id: 'time-sunrise', label: 'Sunrise', value: 'sunrise' },
  { id: 'time-sunset', label: 'Sunset', value: 'sunset' },
  { id: 'time-golden-hour', label: 'Golden Hour', value: 'golden hour' },
];

export const SEASON_OPTIONS: Option[] = [
  { id: 'season-summer', label: 'Summer', value: 'summer' },
  { id: 'season-winter', label: 'Winter', value: 'winter' },
  { id: 'season-spring', label: 'Spring', value: 'spring' },
  { id: 'season-autumn', label: 'Autumn', value: 'autumn' },
];

export const TOURIST_OPTIONS: Option[] = [
  { id: 'tourists-keep', label: 'Keep as is', value: 'keep tourists as is' },
  { id: 'tourists-add', label: 'Add Tourists', value: 'add some tourists to the scene' },
  { id: 'tourists-remove', label: 'Remove Tourists', value: 'remove all tourists from the scene' },
];

export const FORMAT_OPTIONS: Option[] = [
  { id: 'format-original', label: 'Original', value: 'keep the original aspect ratio' },
  { id: 'format-horizontal', label: 'Horizontal (16:9)', value: 'in a horizontal 16:9 aspect ratio' },
  { id: 'format-vertical', label: 'Vertical (9:16)', value: 'in a vertical 9:16 aspect ratio' },
  { id: 'format-square', label: 'Square (1:1)', value: 'in a square 1:1 aspect ratio' },
];

export const PERSPECTIVE_OPTIONS: Option[] = [
    { id: 'perspective-original', label: 'Original', value: 'keep the original perspective' },
    { id: 'perspective-eye-level', label: 'Eye-level', value: 'from an eye-level perspective' },
    { id: 'perspective-low-angle', label: 'Low Angle', value: 'from a low angle, looking up' },
    { id: 'perspective-high-angle', label: 'High Angle', value: 'from a high angle, looking down (drone shot)' },
    { id: 'perspective-left', label: 'From Left', value: 'from the left side' },
    { id: 'perspective-right', label: 'From Right', value: 'from the right side' },
];