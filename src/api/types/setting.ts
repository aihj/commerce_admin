/*
  tbl_conference_setting
*/

export type SettingVoContentType =
  (typeof SettingVoContentType)[keyof typeof SettingVoContentType];

const SettingVoContentType = {
  PRIVACY_POLICY: 'PRIVACY_POLICY',
  GREETINGS: 'GREETINGS',
  TERMS_OF_USE: 'TERMS_OF_USE',
} as const;

/**
 * 각각의 학회에서 보여줄 Html setting 정보
 */
export interface SettingVo {
  settingIdx?: number;
  conferenceIdx?: number;
  contentType?: SettingVoContentType;
  title?: string;
  content?: string;
  description?: string;
  isAvailable?: number;
  createdT?: number;
}
