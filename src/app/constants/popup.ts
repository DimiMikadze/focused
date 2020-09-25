export enum SiteStatus {
  AVAILABLE_FOR_BLOCKING = 'AVAILABLE_FOR_BLOCKING',
  UNAVAILABLE_FOR_BLOCKING = 'UNAVAILABLE_FOR_BLOCKING',
  ALREADY_BLOCKED = 'ALREADY_BLOCKED',
}

export enum SiteMessage {
  FOCUS_MODE_OFF = 'Focus mode is currently off',
  UNAVAILABLE_FOR_BLOCKING = 'Not available on this page',
  AVAILABLE_FOR_BLOCKING = '',
  ALREADY_BLOCKED = 'This site is currently blocked',
}
